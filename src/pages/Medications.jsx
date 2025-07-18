import React, { useState, useMemo } from 'react';
import { useMedications } from '../hooks/useData';
import { formatDate, formatTime } from '../utils/dateUtils';
import { Plus, Edit, Trash2, Pill, Clock, AlertTriangle, Calendar, User, Search, Filter, Bell, CheckCircle } from 'lucide-react';

const Medications = () => {
  const { medications, addMedication, updateMedication, deleteMedication } = useMedications();
  const [showForm, setShowForm] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);
  const [viewMode, setViewMode] = useState('active'); // 'active', 'schedule', 'history'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    type: '',
    dosage: '',
    strength: '',
    frequency: '',
    timesPerDay: 1,
    scheduleeTimes: ['08:00'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    prescribedBy: '',
    pharmacy: '',
    instructions: '',
    sideEffects: '',
    cost: '',
    insurance: '',
    refillDate: '',
    quantity: '',
    refillsRemaining: '',
    isActive: true,
    isPRN: false, // As needed
    foodInstructions: '',
    storage: '',
    interactions: '',
    notes: ''
  });

  const medicationTypes = [
    'Pain Reliever',
    'Anti-inflammatory',
    'Muscle Relaxant',
    'Antidepressant',
    'Anticonvulsant',
    'Topical',
    'Injection',
    'Supplement',
    'Vitamin',
    'Other'
  ];

  const frequencies = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'Every 8 hours',
    'Every 6 hours',
    'Every 4 hours',
    'As needed',
    'Weekly',
    'Monthly'
  ];

  const foodInstructions = [
    'Take with food',
    'Take on empty stomach',
    'Take with or without food',
    'Take 1 hour before meals',
    'Take 2 hours after meals'
  ];

  const storageInstructions = [
    'Room temperature',
    'Refrigerate',
    'Keep in original container',
    'Keep away from light',
    'Keep away from moisture',
    'Do not freeze'
  ];

  const activeMedications = useMemo(() => {
    return medications.filter(med => med.isActive);
  }, [medications]);

  const inactiveMedications = useMemo(() => {
    return medications.filter(med => !med.isActive);
  }, [medications]);

  const filteredMedications = useMemo(() => {
    const medsToFilter = viewMode === 'active' ? activeMedications : 
                        viewMode === 'history' ? inactiveMedications : medications;
    
    return medsToFilter.filter(med => {
      const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           med.genericName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           med.prescribedBy?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || med.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [activeMedications, inactiveMedications, medications, viewMode, searchTerm, filterType]);

  const todaysSchedule = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const schedule = [];
    
    activeMedications.forEach(med => {
      if (med.scheduleeTimes && !med.isPRN) {
        med.scheduleeTimes.forEach(time => {
          schedule.push({
            medicationId: med.id,
            medicationName: med.name,
            dosage: med.dosage,
            time: time,
            datetime: `${today}T${time}`,
            taken: false // In a real app, this would come from a log
          });
        });
      }
    });
    
    return schedule.sort((a, b) => a.time.localeCompare(b.time));
  }, [activeMedications]);

  const medicationStats = useMemo(() => {
    const total = medications.length;
    const active = activeMedications.length;
    const needingRefill = activeMedications.filter(med => {
      if (!med.refillDate) return false;
      const refillDate = new Date(med.refillDate);
      const today = new Date();
      const daysUntilRefill = Math.ceil((refillDate - today) / (1000 * 60 * 60 * 24));
      return daysUntilRefill <= 7;
    }).length;
    
    const scheduledToday = todaysSchedule.length;
    const takenToday = todaysSchedule.filter(dose => dose.taken).length;
    const adherenceRate = scheduledToday > 0 ? Math.round((takenToday / scheduledToday) * 100) : 100;

    return {
      total,
      active,
      needingRefill,
      scheduledToday,
      adherenceRate
    };
  }, [medications, activeMedications, todaysSchedule]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingMedication) {
      updateMedication(editingMedication.id, formData);
    } else {
      addMedication(formData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      genericName: '',
      type: '',
      dosage: '',
      strength: '',
      frequency: '',
      timesPerDay: 1,
      scheduleeTimes: ['08:00'],
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      prescribedBy: '',
      pharmacy: '',
      instructions: '',
      sideEffects: '',
      cost: '',
      insurance: '',
      refillDate: '',
      quantity: '',
      refillsRemaining: '',
      isActive: true,
      isPRN: false,
      foodInstructions: '',
      storage: '',
      interactions: '',
      notes: ''
    });
    setShowForm(false);
    setEditingMedication(null);
  };

  const handleEdit = (medication) => {
    setEditingMedication(medication);
    setFormData({
      name: medication.name || '',
      genericName: medication.genericName || '',
      type: medication.type || '',
      dosage: medication.dosage || '',
      strength: medication.strength || '',
      frequency: medication.frequency || '',
      timesPerDay: medication.timesPerDay || 1,
      scheduleeTimes: medication.scheduleeTimes || ['08:00'],
      startDate: medication.startDate || new Date().toISOString().split('T')[0],
      endDate: medication.endDate || '',
      prescribedBy: medication.prescribedBy || '',
      pharmacy: medication.pharmacy || '',
      instructions: medication.instructions || '',
      sideEffects: medication.sideEffects || '',
      cost: medication.cost || '',
      insurance: medication.insurance || '',
      refillDate: medication.refillDate || '',
      quantity: medication.quantity || '',
      refillsRemaining: medication.refillsRemaining || '',
      isActive: medication.isActive !== undefined ? medication.isActive : true,
      isPRN: medication.isPRN || false,
      foodInstructions: medication.foodInstructions || '',
      storage: medication.storage || '',
      interactions: medication.interactions || '',
      notes: medication.notes || ''
    });
    setShowForm(true);
  };

  const updateScheduleTimes = (timesPerDay) => {
    const defaultTimes = ['08:00', '14:00', '20:00', '02:00'];
    const newTimes = defaultTimes.slice(0, timesPerDay);
    setFormData({
      ...formData,
      timesPerDay: timesPerDay,
      scheduleeTimes: newTimes
    });
  };

  const updateScheduleTime = (index, time) => {
    const newTimes = [...formData.scheduleeTimes];
    newTimes[index] = time;
    setFormData({
      ...formData,
      scheduleeTimes: newTimes
    });
  };

  const checkInteractions = (medicationName) => {
    // Simplified interaction checker - in real app would use a drug interaction API
    const commonInteractions = {
      'ibuprofen': ['warfarin', 'aspirin', 'prednisone'],
      'acetaminophen': ['warfarin', 'alcohol'],
      'tramadol': ['sertraline', 'fluoxetine', 'paroxetine'],
      'gabapentin': ['morphine', 'oxycodone', 'alcohol'],
      'cyclobenzaprine': ['tramadol', 'sertraline', 'alcohol']
    };

    const currentMedNames = activeMedications.map(med => med.name.toLowerCase());
    const medName = medicationName.toLowerCase();
    
    if (commonInteractions[medName]) {
      const interactions = commonInteractions[medName].filter(drug => 
        currentMedNames.some(currentMed => currentMed.includes(drug))
      );
      return interactions;
    }
    
    return [];
  };

  return (
    <div>
      <div className="page-header">
        <h2>Medications</h2>
        <p>Manage your medications, schedules, and track adherence</p>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#667eea' }}>
            {medicationStats.active}
          </div>
          <div className="stat-label">Active Medications</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: medicationStats.adherenceRate >= 80 ? '#48bb78' : '#f56565' }}>
            {medicationStats.adherenceRate}%
          </div>
          <div className="stat-label">Adherence Rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: medicationStats.needingRefill > 0 ? '#f56565' : '#48bb78' }}>
            {medicationStats.needingRefill}
          </div>
          <div className="stat-label">Need Refill Soon</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#ed8936' }}>
            {medicationStats.scheduledToday}
          </div>
          <div className="stat-label">Scheduled Today</div>
        </div>
      </div>

      {/* Controls */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className={`btn ${viewMode === 'active' ? 'btn-primary' : 'btn-secondary'} btn-small`}
                  onClick={() => setViewMode('active')}
                >
                  Active ({medicationStats.active})
                </button>
                <button
                  className={`btn ${viewMode === 'schedule' ? 'btn-primary' : 'btn-secondary'} btn-small`}
                  onClick={() => setViewMode('schedule')}
                >
                  Today's Schedule
                </button>
                <button
                  className={`btn ${viewMode === 'history' ? 'btn-primary' : 'btn-secondary'} btn-small`}
                  onClick={() => setViewMode('history')}
                >
                  History
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Search size={16} color="#718096" />
                <input
                  type="text"
                  placeholder="Search medications..."
                  className="form-input"
                  style={{ width: '200px' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="form-select"
                style={{ width: '150px' }}
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="All">All Types</option>
                {medicationTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <Plus size={16} />
              Add Medication
            </button>
          </div>
        </div>
      </div>

      {/* Medication Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => resetForm()}>
          <div className="modal" style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingMedication ? 'Edit Medication' : 'Add New Medication'}
              </h3>
              <button className="modal-close" onClick={resetForm}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Medication Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Generic Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.genericName}
                    onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select
                    className="form-select"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="">Select type...</option>
                    {medicationTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Strength/Dosage *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    placeholder="e.g., 200mg, 10ml"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Frequency</label>
                  <select
                    className="form-select"
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  >
                    <option value="">Select frequency...</option>
                    {frequencies.map(freq => (
                      <option key={freq} value={freq}>{freq}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Prescribed By</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.prescribedBy}
                    onChange={(e) => setFormData({ ...formData, prescribedBy: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">End Date (if applicable)</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Schedule Section */}
              {!formData.isPRN && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f7fafc', borderRadius: '0.5rem' }}>
                  <h4 style={{ margin: '0 0 1rem', color: '#2d3748' }}>Dosing Schedule</h4>
                  
                  <div className="form-group">
                    <label className="form-label">Times per day</label>
                    <select
                      className="form-select"
                      value={formData.timesPerDay}
                      onChange={(e) => updateScheduleTimes(parseInt(e.target.value))}
                    >
                      <option value={1}>1 time per day</option>
                      <option value={2}>2 times per day</option>
                      <option value={3}>3 times per day</option>
                      <option value={4}>4 times per day</option>
                    </select>
                  </div>

                  <div className="grid grid-2" style={{ gap: '1rem' }}>
                    {formData.scheduleeTimes.map((time, index) => (
                      <div key={index} className="form-group">
                        <label className="form-label">Time {index + 1}</label>
                        <input
                          type="time"
                          className="form-input"
                          value={time}
                          onChange={(e) => updateScheduleTime(index, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-2" style={{ gap: '1rem', marginTop: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Food Instructions</label>
                  <select
                    className="form-select"
                    value={formData.foodInstructions}
                    onChange={(e) => setFormData({ ...formData, foodInstructions: e.target.value })}
                  >
                    <option value="">Select...</option>
                    {foodInstructions.map(instruction => (
                      <option key={instruction} value={instruction}>{instruction}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Storage Instructions</label>
                  <select
                    className="form-select"
                    value={formData.storage}
                    onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                  >
                    <option value="">Select...</option>
                    {storageInstructions.map(instruction => (
                      <option key={instruction} value={instruction}>{instruction}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Pharmacy</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.pharmacy}
                    onChange={(e) => setFormData({ ...formData, pharmacy: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Cost</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    placeholder="$0.00"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Refill Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.refillDate}
                    onChange={(e) => setFormData({ ...formData, refillDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Refills Remaining</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.refillsRemaining}
                    onChange={(e) => setFormData({ ...formData, refillsRemaining: e.target.value })}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Instructions</label>
                <textarea
                  className="form-textarea"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="Special instructions for taking this medication..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Side Effects</label>
                <textarea
                  className="form-textarea"
                  value={formData.sideEffects}
                  onChange={(e) => setFormData({ ...formData, sideEffects: e.target.value })}
                  placeholder="Known side effects to watch for..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Drug Interactions</label>
                <textarea
                  className="form-textarea"
                  value={formData.interactions}
                  onChange={(e) => setFormData({ ...formData, interactions: e.target.value })}
                  placeholder="Known drug interactions..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-textarea"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes..."
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span className="form-label" style={{ margin: 0 }}>Currently active</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isPRN}
                    onChange={(e) => setFormData({ ...formData, isPRN: e.target.checked })}
                  />
                  <span className="form-label" style={{ margin: 0 }}>Take as needed (PRN)</span>
                </label>
              </div>

              {/* Interaction Check */}
              {formData.name && (
                <InteractionChecker medicationName={formData.name} checkInteractions={checkInteractions} />
              )}

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingMedication ? 'Update' : 'Add'} Medication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      {viewMode === 'schedule' ? (
        <TodaysSchedule schedule={todaysSchedule} />
      ) : (
        <div className="grid" style={{ gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          {filteredMedications.map(medication => (
            <MedicationCard 
              key={medication.id}
              medication={medication}
              onEdit={handleEdit}
              onDelete={deleteMedication}
              viewMode={viewMode}
            />
          ))}
          
          {filteredMedications.length === 0 && (
            <div className="card">
              <div className="card-content">
                <p style={{ textAlign: 'center', color: '#718096', padding: '2rem' }}>
                  {viewMode === 'active' ? 'No active medications found.' :
                   viewMode === 'history' ? 'No medication history found.' :
                   'No medications match your search criteria.'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Refill Reminders */}
      {viewMode === 'active' && (
        <RefillReminders medications={activeMedications} />
      )}
    </div>
  );
};

// Medication Card Component
const MedicationCard = ({ medication, onEdit, onDelete, viewMode }) => {
  const needsRefill = useMemo(() => {
    if (!medication.refillDate) return false;
    const refillDate = new Date(medication.refillDate);
    const today = new Date();
    const daysUntilRefill = Math.ceil((refillDate - today) / (1000 * 60 * 60 * 24));
    return daysUntilRefill <= 7;
  }, [medication.refillDate]);

  return (
    <div className="card">
      <div className="card-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, color: '#2d3748', fontSize: '1.25rem' }}>
                {medication.name}
              </h3>
              {medication.type && (
                <span style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#667eea',
                  color: 'white',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {medication.type}
                </span>
              )}
              {!medication.isActive && (
                <span style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#718096',
                  color: 'white',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  Inactive
                </span>
              )}
              {needsRefill && (
                <span style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#f56565',
                  color: 'white',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  Refill Soon
                </span>
              )}
            </div>

            {medication.genericName && (
              <p style={{ margin: '0 0 0.5rem', color: '#718096', fontSize: '0.875rem' }}>
                Generic: {medication.genericName}
              </p>
            )}

            <div className="grid grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <strong style={{ fontSize: '0.875rem', color: '#2d3748' }}>Dosage:</strong>
                <div style={{ color: '#4a5568' }}>{medication.dosage}</div>
              </div>
              {medication.frequency && (
                <div>
                  <strong style={{ fontSize: '0.875rem', color: '#2d3748' }}>Frequency:</strong>
                  <div style={{ color: '#4a5568' }}>{medication.frequency}</div>
                </div>
              )}
              {medication.prescribedBy && (
                <div>
                  <strong style={{ fontSize: '0.875rem', color: '#2d3748' }}>Prescribed by:</strong>
                  <div style={{ color: '#4a5568' }}>{medication.prescribedBy}</div>
                </div>
              )}
              {medication.startDate && (
                <div>
                  <strong style={{ fontSize: '0.875rem', color: '#2d3748' }}>Start Date:</strong>
                  <div style={{ color: '#4a5568' }}>{formatDate(medication.startDate)}</div>
                </div>
              )}
            </div>

            {medication.scheduleeTimes && !medication.isPRN && (
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ fontSize: '0.875rem', color: '#2d3748' }}>Schedule:</strong>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                  {medication.scheduleeTimes.map((time, index) => (
                    <span key={index} style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#e2e8f0',
                      color: '#4a5568',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem'
                    }}>
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {medication.isPRN && (
              <div style={{ marginBottom: '1rem' }}>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#ed8936',
                  color: 'white',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  Take as needed (PRN)
                </span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary btn-small" onClick={() => onEdit(medication)}>
              <Edit size={14} />
            </button>
            <button className="btn btn-danger btn-small" onClick={() => onDelete(medication.id)}>
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {(medication.instructions || medication.foodInstructions || medication.sideEffects) && (
          <div style={{ padding: '1rem', backgroundColor: '#f7fafc', borderRadius: '0.5rem', marginBottom: '1rem' }}>
            {medication.instructions && (
              <div style={{ marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '0.875rem', color: '#2d3748' }}>Instructions:</strong>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#4a5568' }}>
                  {medication.instructions}
                </p>
              </div>
            )}
            {medication.foodInstructions && (
              <div style={{ marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '0.875rem', color: '#2d3748' }}>Food:</strong>
                <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: '#4a5568' }}>
                  {medication.foodInstructions}
                </span>
              </div>
            )}
            {medication.sideEffects && (
              <div>
                <strong style={{ fontSize: '0.875rem', color: '#2d3748' }}>Side Effects:</strong>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#4a5568' }}>
                  {medication.sideEffects}
                </p>
              </div>
            )}
          </div>
        )}

        {(medication.refillDate || medication.pharmacy || medication.cost) && (
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#718096', flexWrap: 'wrap' }}>
            {medication.refillDate && (
              <div>
                📅 Refill: {formatDate(medication.refillDate)}
              </div>
            )}
            {medication.pharmacy && (
              <div>
                🏥 {medication.pharmacy}
              </div>
            )}
            {medication.cost && (
              <div>
                💰 {medication.cost}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Today's Schedule Component
const TodaysSchedule = ({ schedule }) => {
  const [takenDoses, setTakenDoses] = useState(new Set());

  const toggleDose = (index) => {
    const newTakenDoses = new Set(takenDoses);
    if (newTakenDoses.has(index)) {
      newTakenDoses.delete(index);
    } else {
      newTakenDoses.add(index);
    }
    setTakenDoses(newTakenDoses);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>Today's Medication Schedule</h3>
        <div style={{ fontSize: '0.875rem', color: '#718096' }}>
          {schedule.filter((_, index) => takenDoses.has(index)).length} of {schedule.length} doses taken
        </div>
      </div>
      <div className="card-content">
        {schedule.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#718096', padding: '2rem' }}>
            No scheduled medications for today.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {schedule.map((dose, index) => {
              const isTaken = takenDoses.has(index);
              const isPast = new Date() > new Date(dose.datetime);
              
              return (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  backgroundColor: isTaken ? '#f0fff4' : isPast ? '#fef5e7' : '#f7fafc',
                  borderRadius: '0.5rem',
                  border: `1px solid ${isTaken ? '#48bb78' : isPast ? '#ed8936' : '#e2e8f0'}`
                }}>
                  <button
                    onClick={() => toggleDose(index)}
                    style={{
                      width: '2rem',
                      height: '2rem',
                      borderRadius: '50%',
                      border: 'none',
                      backgroundColor: isTaken ? '#48bb78' : '#e2e8f0',
                      color: isTaken ? 'white' : '#718096',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {isTaken ? <CheckCircle size={16} /> : <Clock size={16} />}
                  </button>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#2d3748' }}>
                      {dose.time} - {dose.medicationName}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                      {dose.dosage}
                    </div>
                  </div>
                  
                  {isTaken && (
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#48bb78',
                      color: 'white',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      ✓ Taken
                    </span>
                  )}
                  
                  {!isTaken && isPast && (
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#ed8936',
                      color: 'white',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      Missed
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Refill Reminders Component
const RefillReminders = ({ medications }) => {
  const needingRefill = useMemo(() => {
    return medications.filter(med => {
      if (!med.refillDate) return false;
      const refillDate = new Date(med.refillDate);
      const today = new Date();
      const daysUntilRefill = Math.ceil((refillDate - today) / (1000 * 60 * 60 * 24));
      return daysUntilRefill <= 14; // Show if refill needed within 2 weeks
    }).map(med => {
      const refillDate = new Date(med.refillDate);
      const today = new Date();
      const daysUntilRefill = Math.ceil((refillDate - today) / (1000 * 60 * 60 * 24));
      return { ...med, daysUntilRefill };
    }).sort((a, b) => a.daysUntilRefill - b.daysUntilRefill);
  }, [medications]);

  if (needingRefill.length === 0) return null;

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div className="card-header">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bell size={20} />
          Refill Reminders
        </h3>
      </div>
      <div className="card-content">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {needingRefill.map(med => (
            <div key={med.id} style={{
              padding: '1rem',
              backgroundColor: med.daysUntilRefill <= 3 ? '#fed7d7' : '#fef5e7',
              borderRadius: '0.5rem',
              border: `1px solid ${med.daysUntilRefill <= 3 ? '#f56565' : '#ed8936'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '600', color: '#2d3748' }}>
                    {med.name} - {med.dosage}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                    {med.pharmacy && `Pharmacy: ${med.pharmacy}`}
                    {med.refillsRemaining && ` • ${med.refillsRemaining} refills remaining`}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontWeight: '600', 
                    color: med.daysUntilRefill <= 3 ? '#c53030' : '#d69e2e' 
                  }}>
                    {med.daysUntilRefill <= 0 ? 'Refill needed now' :
                     med.daysUntilRefill === 1 ? 'Refill needed tomorrow' :
                     `Refill needed in ${med.daysUntilRefill} days`}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                    Due: {formatDate(med.refillDate)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Interaction Checker Component
const InteractionChecker = ({ medicationName, checkInteractions }) => {
  const interactions = checkInteractions(medicationName);

  if (interactions.length === 0) return null;

  return (
    <div style={{
      marginTop: '1rem',
      padding: '1rem',
      backgroundColor: '#fed7d7',
      borderRadius: '0.5rem',
      border: '1px solid #f56565'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <AlertTriangle size={16} color="#c53030" />
        <strong style={{ color: '#c53030' }}>Potential Drug Interactions</strong>
      </div>
      <div style={{ fontSize: '0.875rem', color: '#744210' }}>
        This medication may interact with: {interactions.join(', ')}
        <br />
        Please consult with your healthcare provider before taking this medication.
      </div>
    </div>
  );
};

export default Medications;