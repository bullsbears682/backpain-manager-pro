import React, { useState, useMemo } from 'react';
import { useAppointments } from '../hooks/useData';
import { formatDate, formatTime, formatDateTime } from '../utils/dateUtils';
import { Plus, Edit, Trash2, Calendar, Clock, MapPin, User, Phone, Mail, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';

const Appointments = () => {
  const { appointments, addAppointment, updateAppointment, deleteAppointment } = useAppointments();
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterProvider, setFilterProvider] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    providerName: '',
    providerType: '',
    datetime: '',
    duration: 60,
    location: '',
    address: '',
    phone: '',
    email: '',
    notes: '',
    appointmentType: '',
    status: 'scheduled',
    reminderTime: 24,
    cost: '',
    insurance: '',
    referralRequired: false
  });

  const providerTypes = [
    'General Practitioner',
    'Orthopedic Surgeon',
    'Physical Therapist',
    'Chiropractor',
    'Pain Management Specialist',
    'Rheumatologist',
    'Neurologist',
    'Radiologist',
    'Massage Therapist',
    'Acupuncturist'
  ];

  const appointmentTypes = [
    'Initial Consultation',
    'Follow-up',
    'Physical Therapy Session',
    'Diagnostic Test',
    'Surgery Consultation',
    'Pain Management',
    'Check-up',
    'Treatment',
    'Emergency Visit',
    'Telehealth'
  ];

  const appointmentStatuses = [
    'scheduled',
    'confirmed',
    'completed',
    'cancelled',
    'rescheduled',
    'no-show'
  ];

  const uniqueProviders = useMemo(() => {
    const providers = appointments.map(apt => apt.providerName).filter(Boolean);
    return ['All', ...new Set(providers)];
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const matchesProvider = filterProvider === 'All' || apt.providerName === filterProvider;
      const matchesStatus = filterStatus === 'All' || apt.status === filterStatus;
      const matchesSearch = apt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           apt.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           apt.appointmentType.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesProvider && matchesStatus && matchesSearch;
    });
  }, [appointments, filterProvider, filterStatus, searchTerm]);

  const sortedAppointments = useMemo(() => {
    return [...filteredAppointments].sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
  }, [filteredAppointments]);

  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    return sortedAppointments.filter(apt => new Date(apt.datetime) > now);
  }, [sortedAppointments]);

  const pastAppointments = useMemo(() => {
    const now = new Date();
    return sortedAppointments.filter(apt => new Date(apt.datetime) <= now);
  }, [sortedAppointments]);

  const calendarAppointments = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    return appointments.filter(apt => {
      const aptDate = new Date(apt.datetime);
      return aptDate.getFullYear() === year && aptDate.getMonth() === month;
    });
  }, [appointments, currentDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingAppointment) {
      updateAppointment(editingAppointment.id, formData);
    } else {
      addAppointment(formData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      providerName: '',
      providerType: '',
      datetime: '',
      duration: 60,
      location: '',
      address: '',
      phone: '',
      email: '',
      notes: '',
      appointmentType: '',
      status: 'scheduled',
      reminderTime: 24,
      cost: '',
      insurance: '',
      referralRequired: false
    });
    setShowForm(false);
    setEditingAppointment(null);
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      title: appointment.title || '',
      providerName: appointment.providerName || '',
      providerType: appointment.providerType || '',
      datetime: appointment.datetime || '',
      duration: appointment.duration || 60,
      location: appointment.location || '',
      address: appointment.address || '',
      phone: appointment.phone || '',
      email: appointment.email || '',
      notes: appointment.notes || '',
      appointmentType: appointment.appointmentType || '',
      status: appointment.status || 'scheduled',
      reminderTime: appointment.reminderTime || 24,
      cost: appointment.cost || '',
      insurance: appointment.insurance || '',
      referralRequired: appointment.referralRequired || false
    });
    setShowForm(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return '#667eea';
      case 'confirmed': return '#48bb78';
      case 'completed': return '#38a169';
      case 'cancelled': return '#f56565';
      case 'rescheduled': return '#ed8936';
      case 'no-show': return '#e53e3e';
      default: return '#718096';
    }
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDay = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  };

  const getDayAppointments = (date) => {
    return calendarAppointments.filter(apt => {
      const aptDate = new Date(apt.datetime);
      return aptDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  return (
    <div>
      <div className="page-header">
        <h2>Appointments</h2>
        <p>Manage your healthcare appointments and provider information</p>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#667eea' }}>
            {upcomingAppointments.length}
          </div>
          <div className="stat-label">Upcoming Appointments</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#48bb78' }}>
            {appointments.filter(apt => apt.status === 'completed').length}
          </div>
          <div className="stat-label">Completed This Month</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#ed8936' }}>
            {uniqueProviders.length - 1}
          </div>
          <div className="stat-label">Healthcare Providers</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#f56565' }}>
            {appointments.filter(apt => apt.status === 'cancelled').length}
          </div>
          <div className="stat-label">Cancelled This Month</div>
        </div>
      </div>

      {/* Controls */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setViewMode('list')}
                >
                  List View
                </button>
                <button
                  className={`btn ${viewMode === 'calendar' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setViewMode('calendar')}
                >
                  Calendar View
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Search size={16} color="#718096" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  className="form-input"
                  style={{ width: '200px' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="form-select"
                style={{ width: '150px' }}
                value={filterProvider}
                onChange={(e) => setFilterProvider(e.target.value)}
              >
                {uniqueProviders.map(provider => (
                  <option key={provider} value={provider}>{provider}</option>
                ))}
              </select>

              <select
                className="form-select"
                style={{ width: '150px' }}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                {appointmentStatuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <Plus size={16} />
              New Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Appointment Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => resetForm()}>
          <div className="modal" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingAppointment ? 'Edit Appointment' : 'New Appointment'}
              </h3>
              <button className="modal-close" onClick={resetForm}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Appointment Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Provider Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.providerName}
                    onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Provider Type</label>
                  <select
                    className="form-select"
                    value={formData.providerType}
                    onChange={(e) => setFormData({ ...formData, providerType: e.target.value })}
                  >
                    <option value="">Select type...</option>
                    {providerTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Appointment Type</label>
                  <select
                    className="form-select"
                    value={formData.appointmentType}
                    onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}
                  >
                    <option value="">Select type...</option>
                    {appointmentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Date & Time *</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={formData.datetime}
                    onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Duration (minutes)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    min="15"
                    max="480"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location/Clinic</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    {appointmentStatuses.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Reminder (hours before)</label>
                  <select
                    className="form-select"
                    value={formData.reminderTime}
                    onChange={(e) => setFormData({ ...formData, reminderTime: parseInt(e.target.value) })}
                  >
                    <option value={1}>1 hour</option>
                    <option value={24}>24 hours</option>
                    <option value={48}>48 hours</option>
                    <option value={168}>1 week</option>
                  </select>
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
                  <label className="form-label">Insurance</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.insurance}
                    onChange={(e) => setFormData({ ...formData, insurance: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-textarea"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes about the appointment..."
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.referralRequired}
                    onChange={(e) => setFormData({ ...formData, referralRequired: e.target.checked })}
                  />
                  <span className="form-label" style={{ margin: 0 }}>Referral required</span>
                </label>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingAppointment ? 'Update' : 'Create'} Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      {viewMode === 'list' ? (
        <div className="grid grid-2">
          {/* Upcoming Appointments */}
          <div className="card">
            <div className="card-header">
              <h3>Upcoming Appointments ({upcomingAppointments.length})</h3>
            </div>
            <div className="card-content">
              {upcomingAppointments.length === 0 ? (
                <p style={{ color: '#718096', textAlign: 'center', padding: '2rem' }}>
                  No upcoming appointments scheduled.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '600px', overflowY: 'auto' }}>
                  {upcomingAppointments.map(appointment => (
                    <AppointmentCard 
                      key={appointment.id} 
                      appointment={appointment} 
                      onEdit={handleEdit}
                      onDelete={deleteAppointment}
                      getStatusColor={getStatusColor}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Past Appointments */}
          <div className="card">
            <div className="card-header">
              <h3>Past Appointments ({pastAppointments.length})</h3>
            </div>
            <div className="card-content">
              {pastAppointments.length === 0 ? (
                <p style={{ color: '#718096', textAlign: 'center', padding: '2rem' }}>
                  No past appointments recorded.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '600px', overflowY: 'auto' }}>
                  {pastAppointments.slice(0, 10).map(appointment => (
                    <AppointmentCard 
                      key={appointment.id} 
                      appointment={appointment} 
                      onEdit={handleEdit}
                      onDelete={deleteAppointment}
                      getStatusColor={getStatusColor}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Calendar View */
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Calendar View</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button className="btn btn-secondary btn-small" onClick={() => navigateMonth(-1)}>
                  <ChevronLeft size={16} />
                </button>
                <span style={{ fontWeight: '600', minWidth: '150px', textAlign: 'center' }}>
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button className="btn btn-secondary btn-small" onClick={() => navigateMonth(1)}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
          <div className="card-content">
            <CalendarView 
              currentDate={currentDate}
              appointments={calendarAppointments}
              getDayAppointments={getDayAppointments}
              generateCalendarDays={generateCalendarDays}
              getStatusColor={getStatusColor}
            />
          </div>
        </div>
      )}

      {/* Provider Directory */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h3>Healthcare Provider Directory</h3>
        </div>
        <div className="card-content">
          <ProviderDirectory appointments={appointments} />
        </div>
      </div>
    </div>
  );
};

// Appointment Card Component
const AppointmentCard = ({ appointment, onEdit, onDelete, getStatusColor }) => {
  const isUpcoming = new Date(appointment.datetime) > new Date();
  
  return (
    <div style={{
      padding: '1.5rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.75rem',
      backgroundColor: '#f7fafc',
      borderLeft: `4px solid ${getStatusColor(appointment.status)}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <h4 style={{ margin: '0 0 0.5rem', color: '#2d3748', fontSize: '1.1rem' }}>
            {appointment.title}
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#718096', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
            <User size={14} />
            <span>{appointment.providerName}</span>
            {appointment.providerType && <span>• {appointment.providerType}</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#718096', fontSize: '0.875rem' }}>
            <Calendar size={14} />
            <span>{formatDateTime(appointment.datetime)}</span>
            <Clock size={14} />
            <span>{appointment.duration} min</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '1rem',
            fontSize: '0.75rem',
            fontWeight: '500',
            backgroundColor: getStatusColor(appointment.status),
            color: 'white'
          }}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </span>
          <button className="btn btn-secondary btn-small" onClick={() => onEdit(appointment)}>
            <Edit size={14} />
          </button>
          <button className="btn btn-danger btn-small" onClick={() => onDelete(appointment.id)}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {(appointment.location || appointment.address) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#718096', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
          <MapPin size={14} />
          <span>{appointment.location}{appointment.address && `, ${appointment.address}`}</span>
        </div>
      )}

      {(appointment.phone || appointment.email) && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
          {appointment.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#718096', fontSize: '0.875rem' }}>
              <Phone size={14} />
              <span>{appointment.phone}</span>
            </div>
          )}
          {appointment.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#718096', fontSize: '0.875rem' }}>
              <Mail size={14} />
              <span>{appointment.email}</span>
            </div>
          )}
        </div>
      )}

      {appointment.notes && (
        <div style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: '#f1f5f9', borderRadius: '0.5rem' }}>
          <strong style={{ fontSize: '0.875rem', color: '#2d3748' }}>Notes:</strong>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#4a5568' }}>
            {appointment.notes}
          </p>
        </div>
      )}

      {isUpcoming && appointment.reminderTime && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#667eea' }}>
          📅 Reminder set for {appointment.reminderTime} hours before
        </div>
      )}
    </div>
  );
};

// Calendar View Component
const CalendarView = ({ currentDate, appointments, getDayAppointments, generateCalendarDays, getStatusColor }) => {
  const days = generateCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      {/* Calendar Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', marginBottom: '1rem' }}>
        {weekDays.map(day => (
          <div key={day} style={{
            padding: '0.75rem',
            textAlign: 'center',
            fontWeight: '600',
            color: '#2d3748',
            backgroundColor: '#f7fafc'
          }}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: '#e2e8f0' }}>
        {days.map((day, index) => {
          const dayAppointments = getDayAppointments(day);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = day.toDateString() === new Date().toDateString();

          return (
            <div key={index} style={{
              minHeight: '120px',
              padding: '0.5rem',
              backgroundColor: isCurrentMonth ? 'white' : '#f7fafc',
              border: isToday ? '2px solid #667eea' : 'none'
            }}>
              <div style={{
                fontWeight: isToday ? '700' : '500',
                color: isCurrentMonth ? '#2d3748' : '#a0aec0',
                marginBottom: '0.5rem'
              }}>
                {day.getDate()}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {dayAppointments.slice(0, 3).map(apt => (
                  <div key={apt.id} style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: getStatusColor(apt.status),
                    color: 'white',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {formatTime(apt.datetime)} {apt.title}
                  </div>
                ))}
                {dayAppointments.length > 3 && (
                  <div style={{ fontSize: '0.75rem', color: '#718096', textAlign: 'center' }}>
                    +{dayAppointments.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Provider Directory Component
const ProviderDirectory = ({ appointments }) => {
  const providers = useMemo(() => {
    const providerMap = new Map();
    
    appointments.forEach(apt => {
      if (apt.providerName) {
        const key = apt.providerName;
        if (!providerMap.has(key)) {
          providerMap.set(key, {
            name: apt.providerName,
            type: apt.providerType || 'Unknown',
            location: apt.location || '',
            phone: apt.phone || '',
            email: apt.email || '',
            appointments: 0,
            lastVisit: null
          });
        }
        
        const provider = providerMap.get(key);
        provider.appointments++;
        
        const aptDate = new Date(apt.datetime);
        if (!provider.lastVisit || aptDate > provider.lastVisit) {
          provider.lastVisit = aptDate;
        }
      }
    });
    
    return Array.from(providerMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [appointments]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
      {providers.map((provider, index) => (
        <div key={index} style={{
          padding: '1.5rem',
          border: '1px solid #e2e8f0',
          borderRadius: '0.75rem',
          backgroundColor: '#f7fafc'
        }}>
          <h4 style={{ margin: '0 0 0.5rem', color: '#2d3748' }}>{provider.name}</h4>
          <p style={{ margin: '0 0 1rem', color: '#667eea', fontSize: '0.875rem', fontWeight: '500' }}>
            {provider.type}
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: '#4a5568' }}>
            {provider.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={14} />
                <span>{provider.location}</span>
              </div>
            )}
            {provider.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={14} />
                <span>{provider.phone}</span>
              </div>
            )}
            {provider.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={14} />
                <span>{provider.email}</span>
              </div>
            )}
          </div>

          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#718096' }}>
              <span>{provider.appointments} appointments</span>
              {provider.lastVisit && <span>Last: {formatDate(provider.lastVisit)}</span>}
            </div>
          </div>
        </div>
      ))}
      
      {providers.length === 0 && (
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#718096', padding: '2rem' }}>
          No healthcare providers in your directory yet. Add appointments to build your provider list.
        </div>
      )}
    </div>
  );
};

export default Appointments;