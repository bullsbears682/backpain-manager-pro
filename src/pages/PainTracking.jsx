import React, { useState, useMemo } from 'react';
import { usePainEntries } from '../hooks/useData';
import { useNotification } from '../components/Notification';
import PainScale from '../components/PainScale';
import { formatDate, formatTime } from '../utils/dateUtils';
import { Plus, Edit, Trash2, MapPin, Clock, Save, X } from 'lucide-react';

const PainTracking = () => {
  const { painEntries, addPainEntry, updatePainEntry, deletePainEntry } = usePainEntries();
  const { showNotification } = useNotification();
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    painLevel: 0,
    location: '',
    triggers: '',
    symptoms: '',
    notes: '',
    exerciseCompleted: false,
    medicationTaken: false
  });

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.painLevel === 0) {
      showNotification('Please select a pain level', 'warning');
      return;
    }

    if (!formData.location) {
      showNotification('Please select a pain location', 'warning');
      return;
    }

    try {
      if (editingEntry) {
        updatePainEntry(editingEntry.id, formData);
        showNotification('Pain entry updated successfully!', 'success');
      } else {
        addPainEntry(formData);
        showNotification('Pain entry logged successfully!', 'success');
      }
      
      // Reset form
      setFormData({
        painLevel: 0,
        location: '',
        triggers: '',
        symptoms: '',
        notes: '',
        exerciseCompleted: false,
        medicationTaken: false
      });
      setShowForm(false);
      setEditingEntry(null);
    } catch (error) {
      showNotification('Error saving pain entry. Please try again.', 'error');
    }
  };

  // Edit entry handler
  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      painLevel: entry.painLevel,
      location: entry.location,
      triggers: entry.triggers || '',
      symptoms: entry.symptoms || '',
      notes: entry.notes || '',
      exerciseCompleted: entry.exerciseCompleted || false,
      medicationTaken: entry.medicationTaken || false
    });
    setShowForm(true);
  };

  // Delete entry handler
  const handleDelete = (entryId) => {
    if (window.confirm('Are you sure you want to delete this pain entry?')) {
      try {
        deletePainEntry(entryId);
        showNotification('Pain entry deleted successfully!', 'success');
      } catch (error) {
        showNotification('Error deleting pain entry. Please try again.', 'error');
      }
    }
  };

  // Cancel form handler
  const handleCancel = () => {
    setShowForm(false);
    setEditingEntry(null);
    setFormData({
      painLevel: 0,
      location: '',
      triggers: '',
      symptoms: '',
      notes: '',
      exerciseCompleted: false,
      medicationTaken: false
    });
  };

  const painLocations = [
    'Lower Back',
    'Upper Back',
    'Neck',
    'Shoulders',
    'Mid Back',
    'Tailbone',
    'Hip',
    'Leg (Radiating)'
  ];

  const commonTriggers = [
    'Sitting too long',
    'Physical activity',
    'Lifting heavy objects',
    'Poor posture',
    'Stress',
    'Weather changes',
    'Sleeping position',
    'Lack of exercise'
  ];

  const commonSymptoms = [
    'Sharp pain',
    'Dull ache',
    'Burning sensation',
    'Stiffness',
    'Muscle spasms',
    'Tingling',
    'Numbness',
    'Radiating pain'
  ];

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setFormData({
      painLevel: entry.painLevel,
      location: entry.location || '',
      triggers: entry.triggers || '',
      symptoms: entry.symptoms || '',
      notes: entry.notes || '',
      exerciseCompleted: entry.exerciseCompleted || false,
      medicationTaken: entry.medicationTaken || false
    });
    setShowForm(true);
  };

  const sortedEntries = useMemo(() => {
    return [...painEntries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [painEntries]);

  const weeklyStats = useMemo(() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(date);
    }

    const weeklyEntries = painEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return last7Days.some(day => day.toDateString() === entryDate.toDateString());
    });

    const avgPain = weeklyEntries.length > 0
      ? (weeklyEntries.reduce((sum, entry) => sum + entry.painLevel, 0) / weeklyEntries.length).toFixed(1)
      : 0;

    const maxPain = weeklyEntries.length > 0
      ? Math.max(...weeklyEntries.map(entry => entry.painLevel))
      : 0;

    const minPain = weeklyEntries.length > 0
      ? Math.min(...weeklyEntries.map(entry => entry.painLevel))
      : 0;

    return { avgPain, maxPain, minPain, totalEntries: weeklyEntries.length };
  }, [painEntries]);

  return (
    <div>
      <div className="page-header">
        <h2>Pain Tracking</h2>
        <p>Monitor and record your back pain levels and related symptoms</p>
      </div>

      {/* Weekly Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value" style={{ color: weeklyStats.avgPain > 6 ? '#f56565' : weeklyStats.avgPain > 3 ? '#ed8936' : '#48bb78' }}>
            {weeklyStats.avgPain}
          </div>
          <div className="stat-label">Average Pain (7 days)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#f56565' }}>
            {weeklyStats.maxPain}
          </div>
          <div className="stat-label">Peak Pain Level</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#48bb78' }}>
            {weeklyStats.minPain}
          </div>
          <div className="stat-label">Lowest Pain Level</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#667eea' }}>
            {weeklyStats.totalEntries}
          </div>
          <div className="stat-label">Entries This Week</div>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Pain Entry Form */}
        <div className="card">
          <div className="card-header">
            <h3>{editingEntry ? 'Edit Pain Entry' : 'Record Pain Level'}</h3>
            {!showForm && (
              <button 
                className="btn btn-primary btn-small"
                onClick={() => setShowForm(true)}
              >
                <Plus size={16} />
                New Entry
              </button>
            )}
          </div>
          
          {showForm ? (
            <form onSubmit={handleSubmit} className="card-content">
              <div className="form-group">
                <label className="form-label">Pain Level (0-10)</label>
                <PainScale
                  value={formData.painLevel}
                  onChange={(value) => setFormData({ ...formData, painLevel: value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Pain Location</label>
                <select
                  className="form-select"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                >
                  <option value="">Select location...</option>
                  {painLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Triggers</label>
                <select
                  className="form-select"
                  value={formData.triggers}
                  onChange={(e) => setFormData({ ...formData, triggers: e.target.value })}
                >
                  <option value="">Select trigger...</option>
                  {commonTriggers.map(trigger => (
                    <option key={trigger} value={trigger}>{trigger}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Symptoms</label>
                <select
                  className="form-select"
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                >
                  <option value="">Select symptoms...</option>
                  {commonSymptoms.map(symptom => (
                    <option key={symptom} value={symptom}>{symptom}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Additional Notes</label>
                <textarea
                  className="form-textarea"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional details about your pain..."
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.exerciseCompleted}
                    onChange={(e) => setFormData({ ...formData, exerciseCompleted: e.target.checked })}
                  />
                  <span className="form-label" style={{ margin: 0 }}>Exercise completed today</span>
                </label>
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.medicationTaken}
                    onChange={(e) => setFormData({ ...formData, medicationTaken: e.target.checked })}
                  />
                  <span className="form-label" style={{ margin: 0 }}>Medication taken</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  {editingEntry ? 'Update Entry' : 'Save Entry'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="card-content">
              <p style={{ color: '#718096', textAlign: 'center', padding: '2rem' }}>
                Click "New Entry" to record your current pain level and symptoms.
              </p>
            </div>
          )}
        </div>

        {/* Pain History */}
        <div className="card">
          <div className="card-header">
            <h3>Pain History</h3>
          </div>
          <div className="card-content">
            {sortedEntries.length === 0 ? (
              <p style={{ color: '#718096', textAlign: 'center', padding: '2rem' }}>
                No pain entries recorded yet. Start tracking your pain levels to see your history here.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '600px', overflowY: 'auto' }}>
                {sortedEntries.map(entry => (
                  <div key={entry.id} style={{
                    padding: '1rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    backgroundColor: '#f7fafc'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: '3rem',
                          height: '3rem',
                          borderRadius: '50%',
                          backgroundColor: entry.painLevel > 6 ? '#f56565' : entry.painLevel > 3 ? '#ed8936' : '#48bb78',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: '700',
                          fontSize: '1.25rem'
                        }}>
                          {entry.painLevel}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', color: '#2d3748' }}>
                            {formatDate(entry.timestamp)} at {formatTime(entry.timestamp)}
                          </div>
                          {entry.location && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: '#718096' }}>
                              <MapPin size={14} />
                              {entry.location}
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-secondary btn-small"
                          onClick={() => handleEdit(entry)}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="btn btn-danger btn-small"
                          onClick={() => handleDelete(entry.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    
                    {(entry.triggers || entry.symptoms || entry.notes) && (
                      <div style={{ fontSize: '0.875rem', color: '#4a5568', marginTop: '0.5rem' }}>
                        {entry.triggers && <div><strong>Trigger:</strong> {entry.triggers}</div>}
                        {entry.symptoms && <div><strong>Symptoms:</strong> {entry.symptoms}</div>}
                        {entry.notes && <div><strong>Notes:</strong> {entry.notes}</div>}
                      </div>
                    )}
                    
                    {(entry.exerciseCompleted || entry.medicationTaken) && (
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                        {entry.exerciseCompleted && (
                          <span style={{ padding: '0.25rem 0.5rem', backgroundColor: '#48bb78', color: 'white', borderRadius: '0.25rem' }}>
                            Exercise completed
                          </span>
                        )}
                        {entry.medicationTaken && (
                          <span style={{ padding: '0.25rem 0.5rem', backgroundColor: '#667eea', color: 'white', borderRadius: '0.25rem' }}>
                            Medication taken
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PainTracking;