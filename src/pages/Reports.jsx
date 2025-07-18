import React, { useState, useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { usePainEntries, useAppointments, useMedications } from '../hooks/useData';
import { formatDate, getLastNDays } from '../utils/dateUtils';
import { Download, Calendar, TrendingUp, Activity, Pill, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Reports = () => {
  const { painEntries } = usePainEntries();
  const { appointments } = useAppointments();
  const { medications } = useMedications();
  const [dateRange, setDateRange] = useState('30');
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredData = useMemo(() => {
    const days = parseInt(dateRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const filteredPainEntries = painEntries.filter(entry => 
      new Date(entry.timestamp) >= startDate
    );

    const filteredAppointments = appointments.filter(apt => 
      new Date(apt.datetime) >= startDate
    );

    const filteredMedications = medications.filter(med => 
      new Date(med.startDate) >= startDate
    );

    return {
      painEntries: filteredPainEntries,
      appointments: filteredAppointments,
      medications: filteredMedications
    };
  }, [painEntries, appointments, medications, dateRange]);

  const reportStats = useMemo(() => {
    const data = filteredData.painEntries;
    
    if (data.length === 0) {
      return {
        averagePain: 0,
        maxPain: 0,
        minPain: 0,
        totalEntries: 0,
        painTrend: 0,
        mostCommonLocation: 'N/A',
        mostCommonTrigger: 'N/A',
        exerciseCompliance: 0
      };
    }

    const avgPain = (data.reduce((sum, entry) => sum + entry.painLevel, 0) / data.length).toFixed(1);
    const maxPain = Math.max(...data.map(entry => entry.painLevel));
    const minPain = Math.min(...data.map(entry => entry.painLevel));
    
    // Calculate pain trend
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    const firstAvg = firstHalf.length > 0 ? firstHalf.reduce((sum, entry) => sum + entry.painLevel, 0) / firstHalf.length : 0;
    const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((sum, entry) => sum + entry.painLevel, 0) / secondHalf.length : 0;
    const painTrend = (secondAvg - firstAvg).toFixed(1);

    // Most common location
    const locations = data.filter(entry => entry.location).map(entry => entry.location);
    const locationCounts = locations.reduce((acc, location) => {
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});
    const mostCommonLocation = Object.keys(locationCounts).length > 0 
      ? Object.keys(locationCounts).reduce((a, b) => locationCounts[a] > locationCounts[b] ? a : b)
      : 'N/A';

    // Most common trigger
    const triggers = data.filter(entry => entry.triggers).map(entry => entry.triggers);
    const triggerCounts = triggers.reduce((acc, trigger) => {
      acc[trigger] = (acc[trigger] || 0) + 1;
      return acc;
    }, {});
    const mostCommonTrigger = Object.keys(triggerCounts).length > 0
      ? Object.keys(triggerCounts).reduce((a, b) => triggerCounts[a] > triggerCounts[b] ? a : b)
      : 'N/A';

    // Exercise compliance
    const exerciseCompleted = data.filter(entry => entry.exerciseCompleted).length;
    const exerciseCompliance = ((exerciseCompleted / data.length) * 100).toFixed(0);

    return {
      averagePain: avgPain,
      maxPain,
      minPain,
      totalEntries: data.length,
      painTrend,
      mostCommonLocation,
      mostCommonTrigger,
      exerciseCompliance
    };
  }, [filteredData]);

  const painChartData = useMemo(() => {
    const days = getLastNDays(parseInt(dateRange));
    const data = days.map(day => {
      const dayEntries = filteredData.painEntries.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        return day.toDateString() === entryDate.toDateString();
      });
      
      if (dayEntries.length === 0) return null;
      
      const avgPain = dayEntries.reduce((sum, entry) => sum + entry.painLevel, 0) / dayEntries.length;
      return avgPain;
    });

    return {
      labels: days.map(day => day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [
        {
          label: 'Pain Level',
          data: data,
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [filteredData, dateRange]);

  const locationChartData = useMemo(() => {
    const locations = filteredData.painEntries
      .filter(entry => entry.location)
      .map(entry => entry.location);
    
    const locationCounts = locations.reduce((acc, location) => {
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});

    const sortedLocations = Object.entries(locationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    return {
      labels: sortedLocations.map(([location]) => location),
      datasets: [
        {
          label: 'Frequency',
          data: sortedLocations.map(([, count]) => count),
          backgroundColor: [
            '#667eea',
            '#f56565',
            '#48bb78',
            '#ed8936',
            '#9f7aea'
          ],
        },
      ],
    };
  }, [filteredData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const generatePDFReport = async () => {
    setIsGenerating(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Title
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Back Pain Management Report', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Date range
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Report Period: Last ${dateRange} days (${formatDate(new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000))} - ${formatDate(new Date())})`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Statistics
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Pain Statistics', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const stats = [
        `Average Pain Level: ${reportStats.averagePain}/10`,
        `Maximum Pain Level: ${reportStats.maxPain}/10`,
        `Minimum Pain Level: ${reportStats.minPain}/10`,
        `Total Pain Entries: ${reportStats.totalEntries}`,
        `Pain Trend: ${reportStats.painTrend > 0 ? '+' : ''}${reportStats.painTrend} (${reportStats.painTrend < 0 ? 'Improving' : reportStats.painTrend > 0 ? 'Worsening' : 'Stable'})`,
        `Most Common Location: ${reportStats.mostCommonLocation}`,
        `Most Common Trigger: ${reportStats.mostCommonTrigger}`,
        `Exercise Compliance: ${reportStats.exerciseCompliance}%`
      ];

      stats.forEach(stat => {
        pdf.text(stat, 20, yPosition);
        yPosition += 7;
      });

      yPosition += 10;

      // Recent appointments
      if (filteredData.appointments.length > 0) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Recent Appointments', 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        filteredData.appointments.slice(0, 5).forEach(apt => {
          const aptText = `${formatDate(apt.datetime)} - ${apt.title}`;
          pdf.text(aptText, 20, yPosition);
          yPosition += 7;
        });
        yPosition += 10;
      }

      // Medications
      if (filteredData.medications.length > 0) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Current Medications', 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        filteredData.medications.slice(0, 5).forEach(med => {
          const medText = `${med.name} - ${med.dosage} (${med.frequency})`;
          pdf.text(medText, 20, yPosition);
          yPosition += 7;
        });
        yPosition += 10;
      }

      // Pain entries summary
      if (filteredData.painEntries.length > 0) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Recent Pain Entries', 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        filteredData.painEntries.slice(-10).forEach(entry => {
          if (yPosition > pageHeight - 30) {
            pdf.addPage();
            yPosition = 20;
          }
          const entryText = `${formatDate(entry.timestamp)} - Pain: ${entry.painLevel}/10${entry.location ? ` (${entry.location})` : ''}`;
          pdf.text(entryText, 20, yPosition);
          yPosition += 7;
        });
      }

      // Footer
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text(`Generated by BackPain Manager Pro on ${formatDate(new Date())}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

      // Save the PDF
      pdf.save(`back-pain-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Reports & Analytics</h2>
        <p>Comprehensive analysis of your back pain management progress</p>
      </div>

      {/* Controls */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Date Range:</label>
              <select
                className="form-select"
                style={{ width: '150px' }}
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="7">Last 7 days</option>
                <option value="14">Last 14 days</option>
                <option value="30">Last 30 days</option>
                <option value="60">Last 60 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </div>
            
            <button 
              className="btn btn-primary"
              onClick={generatePDFReport}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <div className="spinner" style={{ width: '16px', height: '16px' }} />
              ) : (
                <Download size={16} />
              )}
              {isGenerating ? 'Generating...' : 'Download PDF Report'}
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value" style={{ color: reportStats.averagePain > 6 ? '#f56565' : reportStats.averagePain > 3 ? '#ed8936' : '#48bb78' }}>
            {reportStats.averagePain}
          </div>
          <div className="stat-label">Average Pain Level</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: reportStats.painTrend < 0 ? '#48bb78' : reportStats.painTrend > 0 ? '#f56565' : '#718096' }}>
            {reportStats.painTrend > 0 ? '+' : ''}{reportStats.painTrend}
          </div>
          <div className="stat-label">Pain Trend</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#667eea' }}>
            {reportStats.totalEntries}
          </div>
          <div className="stat-label">Total Entries</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: reportStats.exerciseCompliance > 70 ? '#48bb78' : reportStats.exerciseCompliance > 40 ? '#ed8936' : '#f56565' }}>
            {reportStats.exerciseCompliance}%
          </div>
          <div className="stat-label">Exercise Compliance</div>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Pain Trend Chart */}
        <div className="card">
          <div className="card-header">
            <h3>Pain Level Trend</h3>
          </div>
          <div className="chart-container">
            <Line data={painChartData} options={chartOptions} />
          </div>
        </div>

        {/* Pain Location Chart */}
        <div className="card">
          <div className="card-header">
            <h3>Most Affected Areas</h3>
          </div>
          <div className="chart-container">
            <Bar data={locationChartData} options={barChartOptions} />
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <h3>Pain Analysis</h3>
          </div>
          <div className="card-content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <strong>Most Common Pain Location:</strong>
                <div style={{ color: '#718096' }}>{reportStats.mostCommonLocation}</div>
              </div>
              <div>
                <strong>Most Common Trigger:</strong>
                <div style={{ color: '#718096' }}>{reportStats.mostCommonTrigger}</div>
              </div>
              <div>
                <strong>Pain Range:</strong>
                <div style={{ color: '#718096' }}>{reportStats.minPain}/10 - {reportStats.maxPain}/10</div>
              </div>
              <div>
                <strong>Trend Analysis:</strong>
                <div style={{ 
                  color: reportStats.painTrend < 0 ? '#48bb78' : reportStats.painTrend > 0 ? '#f56565' : '#718096',
                  fontWeight: '500'
                }}>
                  {reportStats.painTrend < 0 ? 'Pain levels are decreasing - Keep up the good work!' :
                   reportStats.painTrend > 0 ? 'Pain levels are increasing - Consider consulting your healthcare provider' :
                   'Pain levels are stable'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Recommendations</h3>
          </div>
          <div className="card-content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reportStats.exerciseCompliance < 50 && (
                <div style={{ padding: '1rem', backgroundColor: '#fed7d7', borderRadius: '0.5rem', border: '1px solid #f56565' }}>
                  <strong style={{ color: '#c53030' }}>Low Exercise Compliance</strong>
                  <div style={{ color: '#744210', marginTop: '0.5rem' }}>
                    Consider increasing your exercise frequency to improve back health.
                  </div>
                </div>
              )}
              
              {reportStats.painTrend > 1 && (
                <div style={{ padding: '1rem', backgroundColor: '#fed7d7', borderRadius: '0.5rem', border: '1px solid #f56565' }}>
                  <strong style={{ color: '#c53030' }}>Increasing Pain Trend</strong>
                  <div style={{ color: '#744210', marginTop: '0.5rem' }}>
                    Your pain levels have been increasing. Consider scheduling an appointment with your healthcare provider.
                  </div>
                </div>
              )}

              {reportStats.averagePain > 7 && (
                <div style={{ padding: '1rem', backgroundColor: '#fed7d7', borderRadius: '0.5rem', border: '1px solid #f56565' }}>
                  <strong style={{ color: '#c53030' }}>High Pain Levels</strong>
                  <div style={{ color: '#744210', marginTop: '0.5rem' }}>
                    Your average pain level is high. Please consult with your healthcare provider about pain management options.
                  </div>
                </div>
              )}

              {reportStats.painTrend < -1 && (
                <div style={{ padding: '1rem', backgroundColor: '#c6f6d5', borderRadius: '0.5rem', border: '1px solid #48bb78' }}>
                  <strong style={{ color: '#2f855a' }}>Improving Trend</strong>
                  <div style={{ color: '#22543d', marginTop: '0.5rem' }}>
                    Great progress! Your pain levels are decreasing. Continue with your current treatment plan.
                  </div>
                </div>
              )}

              {reportStats.exerciseCompliance > 80 && (
                <div style={{ padding: '1rem', backgroundColor: '#c6f6d5', borderRadius: '0.5rem', border: '1px solid #48bb78' }}>
                  <strong style={{ color: '#2f855a' }}>Excellent Exercise Compliance</strong>
                  <div style={{ color: '#22543d', marginTop: '0.5rem' }}>
                    You're doing great with your exercise routine! Keep it up.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary for Healthcare Providers */}
      <div className="card">
        <div className="card-header">
          <h3>Healthcare Provider Summary</h3>
        </div>
        <div className="card-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            <div>
              <h4 style={{ marginBottom: '1rem', color: '#2d3748', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={20} />
                Pain Summary
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, color: '#4a5568' }}>
                <li>Average: {reportStats.averagePain}/10</li>
                <li>Range: {reportStats.minPain}-{reportStats.maxPain}/10</li>
                <li>Entries: {reportStats.totalEntries}</li>
                <li>Trend: {reportStats.painTrend}</li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ marginBottom: '1rem', color: '#2d3748', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={20} />
                Treatment Compliance
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, color: '#4a5568' }}>
                <li>Exercise: {reportStats.exerciseCompliance}%</li>
                <li>Medications: {filteredData.medications.length} active</li>
                <li>Appointments: {filteredData.appointments.length} recent</li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ marginBottom: '1rem', color: '#2d3748', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} />
                Key Findings
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, color: '#4a5568' }}>
                <li>Primary location: {reportStats.mostCommonLocation}</li>
                <li>Main trigger: {reportStats.mostCommonTrigger}</li>
                <li>Period: {dateRange} days</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;