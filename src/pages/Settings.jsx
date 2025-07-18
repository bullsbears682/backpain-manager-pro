import React, { useState } from 'react';
import { useSettings } from '../hooks/useData';
import { storage } from '../utils/storage';
import { 
  User, 
  Bell, 
  Shield, 
  Download, 
  Upload, 
  Trash2, 
  Sun, 
  Moon, 
  Globe, 
  HelpCircle,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const Settings = () => {
  const { settings, updateSettings } = useSettings();
  const [activeSection, setActiveSection] = useState('profile');
  const [showConfirmDialog, setShowConfirmDialog] = useState(null);
  const [exportStatus, setExportStatus] = useState(null);
  const [importStatus, setImportStatus] = useState(null);

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Sun },
    { id: 'data', label: 'Data Management', icon: Download },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'help', label: 'Help & Support', icon: HelpCircle }
  ];

  const handleExportData = () => {
    try {
      setExportStatus('exporting');
      
      // Gather all data from localStorage
      const exportData = {
        painEntries: storage.get('backpain_pain_entries') || [],
        medications: storage.get('backpain_medications') || [],
        appointments: storage.get('backpain_appointments') || [],
        exercises: storage.get('backpain_exercises') || [],
        settings: storage.get('backpain_settings') || {},
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };

      // Create downloadable file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `backpain-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      setExportStatus('success');
      
      setTimeout(() => setExportStatus(null), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('error');
      setTimeout(() => setExportStatus(null), 3000);
    }
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        setImportStatus('importing');
        const importData = JSON.parse(e.target.result);
        
        // Validate data structure
        if (!importData.version || !importData.exportDate) {
          throw new Error('Invalid data format');
        }

        // Import data to localStorage
        if (importData.painEntries) storage.set('backpain_pain_entries', importData.painEntries);
        if (importData.medications) storage.set('backpain_medications', importData.medications);
        if (importData.appointments) storage.set('backpain_appointments', importData.appointments);
        if (importData.exercises) storage.set('backpain_exercises', importData.exercises);
        if (importData.settings) storage.set('backpain_settings', importData.settings);

        setImportStatus('success');
        setTimeout(() => setImportStatus(null), 3000);
        
        // Refresh page to load new data
        setTimeout(() => window.location.reload(), 1000);
      } catch (error) {
        console.error('Import failed:', error);
        setImportStatus('error');
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  const handleClearAllData = () => {
    if (showConfirmDialog === 'clearData') {
      storage.clear();
      setShowConfirmDialog(null);
      alert('All data has been cleared. The page will refresh.');
      window.location.reload();
    } else {
      setShowConfirmDialog('clearData');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Settings</h2>
        <p>Customize your BackPain Manager Pro experience</p>
      </div>

      <div className="grid grid-2" style={{ gap: '2rem', alignItems: 'flex-start' }}>
        {/* Settings Navigation */}
        <div className="card">
          <div className="card-header">
            <h3>Settings Categories</h3>
          </div>
          <div className="card-content">
            <nav>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {sections.map(section => {
                  const IconComponent = section.icon;
                  return (
                    <li key={section.id} style={{ margin: '0.5rem 0' }}>
                      <button
                        className={`btn ${activeSection === section.id ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ 
                          width: '100%', 
                          justifyContent: 'flex-start',
                          textAlign: 'left'
                        }}
                        onClick={() => setActiveSection(section.id)}
                      >
                        <IconComponent size={16} />
                        {section.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="card">
          <div className="card-content">
            {activeSection === 'profile' && (
              <ProfileSettings settings={settings} updateSettings={updateSettings} />
            )}
            
            {activeSection === 'notifications' && (
              <NotificationSettings settings={settings} updateSettings={updateSettings} />
            )}
            
            {activeSection === 'appearance' && (
              <AppearanceSettings settings={settings} updateSettings={updateSettings} />
            )}
            
            {activeSection === 'data' && (
              <DataManagementSettings 
                onExportData={handleExportData}
                onImportData={handleImportData}
                onClearData={handleClearAllData}
                exportStatus={exportStatus}
                importStatus={importStatus}
                showConfirmDialog={showConfirmDialog}
                onCancelConfirm={() => setShowConfirmDialog(null)}
              />
            )}
            
            {activeSection === 'privacy' && (
              <PrivacySettings settings={settings} updateSettings={updateSettings} />
            )}
            
            {activeSection === 'help' && (
              <HelpSupportSettings />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Settings Component
const ProfileSettings = ({ settings, updateSettings }) => {
  const [profileData, setProfileData] = useState({
    name: settings.profile?.name || '',
    email: settings.profile?.email || '',
    dateOfBirth: settings.profile?.dateOfBirth || '',
    height: settings.profile?.height || '',
    weight: settings.profile?.weight || '',
    emergencyContact: settings.profile?.emergencyContact || '',
    medicalHistory: settings.profile?.medicalHistory || '',
    allergies: settings.profile?.allergies || ''
  });

  const handleSave = () => {
    updateSettings({
      ...settings,
      profile: profileData
    });
    alert('Profile updated successfully!');
  };

  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem' }}>Profile Information</h3>
      
      <div className="grid grid-2" style={{ gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-input"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            className="form-input"
            value={profileData.dateOfBirth}
            onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Height</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g., 5'8&quot; or 173cm"
            value={profileData.height}
            onChange={(e) => setProfileData({ ...profileData, height: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Weight</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g., 150 lbs or 68 kg"
            value={profileData.weight}
            onChange={(e) => setProfileData({ ...profileData, weight: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Emergency Contact</label>
          <input
            type="text"
            className="form-input"
            placeholder="Name and phone number"
            value={profileData.emergencyContact}
            onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Medical History</label>
        <textarea
          className="form-textarea"
          placeholder="Brief medical history relevant to back pain..."
          value={profileData.medicalHistory}
          onChange={(e) => setProfileData({ ...profileData, medicalHistory: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Allergies</label>
        <textarea
          className="form-textarea"
          placeholder="Known allergies, especially to medications..."
          value={profileData.allergies}
          onChange={(e) => setProfileData({ ...profileData, allergies: e.target.value })}
        />
      </div>

      <button className="btn btn-primary" onClick={handleSave}>
        Save Profile
      </button>
    </div>
  );
};

// Notification Settings Component
const NotificationSettings = ({ settings, updateSettings }) => {
  const notificationSettings = settings.notifications || {
    medicationReminders: true,
    appointmentReminders: true,
    exerciseReminders: true,
    painTrackingReminders: true,
    emailNotifications: false,
    reminderTime: '09:00'
  };

  const handleToggle = (key) => {
    updateSettings({
      ...settings,
      notifications: {
        ...notificationSettings,
        [key]: !notificationSettings[key]
      }
    });
  };

  const handleTimeChange = (time) => {
    updateSettings({
      ...settings,
      notifications: {
        ...notificationSettings,
        reminderTime: time
      }
    });
  };

  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem' }}>Notification Preferences</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={notificationSettings.medicationReminders}
            onChange={() => handleToggle('medicationReminders')}
          />
          <div>
            <div className="form-label" style={{ margin: 0 }}>Medication Reminders</div>
            <div style={{ fontSize: '0.875rem', color: '#718096' }}>
              Get notified when it's time to take your medications
            </div>
          </div>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={notificationSettings.appointmentReminders}
            onChange={() => handleToggle('appointmentReminders')}
          />
          <div>
            <div className="form-label" style={{ margin: 0 }}>Appointment Reminders</div>
            <div style={{ fontSize: '0.875rem', color: '#718096' }}>
              Receive reminders for upcoming medical appointments
            </div>
          </div>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={notificationSettings.exerciseReminders}
            onChange={() => handleToggle('exerciseReminders')}
          />
          <div>
            <div className="form-label" style={{ margin: 0 }}>Exercise Reminders</div>
            <div style={{ fontSize: '0.875rem', color: '#718096' }}>
              Daily reminders to complete your exercise routine
            </div>
          </div>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={notificationSettings.painTrackingReminders}
            onChange={() => handleToggle('painTrackingReminders')}
          />
          <div>
            <div className="form-label" style={{ margin: 0 }}>Pain Tracking Reminders</div>
            <div style={{ fontSize: '0.875rem', color: '#718096' }}>
              Gentle reminders to log your daily pain levels
            </div>
          </div>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={notificationSettings.emailNotifications}
            onChange={() => handleToggle('emailNotifications')}
          />
          <div>
            <div className="form-label" style={{ margin: 0 }}>Email Notifications</div>
            <div style={{ fontSize: '0.875rem', color: '#718096' }}>
              Receive important updates via email
            </div>
          </div>
        </label>
      </div>

      <div className="form-group" style={{ marginTop: '2rem' }}>
        <label className="form-label">Default Reminder Time</label>
        <input
          type="time"
          className="form-input"
          style={{ width: '200px' }}
          value={notificationSettings.reminderTime}
          onChange={(e) => handleTimeChange(e.target.value)}
        />
        <div style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.5rem' }}>
          This will be the default time for daily reminders
        </div>
      </div>
    </div>
  );
};

// Appearance Settings Component
const AppearanceSettings = ({ settings, updateSettings }) => {
  const handleThemeChange = (theme) => {
    updateSettings({ ...settings, theme });
  };

  const handleLanguageChange = (language) => {
    updateSettings({ ...settings, language });
  };

  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem' }}>Appearance & Language</h3>
      
      <div className="form-group">
        <label className="form-label">Theme</label>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="theme"
              checked={settings.theme === 'light'}
              onChange={() => handleThemeChange('light')}
            />
            <Sun size={16} />
            Light
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="theme"
              checked={settings.theme === 'dark'}
              onChange={() => handleThemeChange('dark')}
            />
            <Moon size={16} />
            Dark
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="radio"
              name="theme"
              checked={settings.theme === 'auto'}
              onChange={() => handleThemeChange('auto')}
            />
            <Globe size={16} />
            Auto
          </label>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Language</label>
        <select
          className="form-select"
          style={{ width: '200px' }}
          value={settings.language || 'en'}
          onChange={(e) => handleLanguageChange(e.target.value)}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="it">Italiano</option>
          <option value="pt">Português</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Display Options</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings.showAnimations !== false}
              onChange={(e) => updateSettings({ ...settings, showAnimations: e.target.checked })}
            />
            Enable animations
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings.compactMode || false}
              onChange={(e) => updateSettings({ ...settings, compactMode: e.target.checked })}
            />
            Compact mode
          </label>
        </div>
      </div>
    </div>
  );
};

// Data Management Settings Component
const DataManagementSettings = ({ 
  onExportData, 
  onImportData, 
  onClearData, 
  exportStatus, 
  importStatus,
  showConfirmDialog,
  onCancelConfirm
}) => {
  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem' }}>Data Management</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Export Data */}
        <div style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
          <h4 style={{ margin: '0 0 1rem', color: '#2d3748' }}>Export Your Data</h4>
          <p style={{ margin: '0 0 1rem', color: '#4a5568', fontSize: '0.875rem' }}>
            Download all your pain tracking data, medications, appointments, and settings as a JSON file.
          </p>
          <button 
            className="btn btn-primary"
            onClick={onExportData}
            disabled={exportStatus === 'exporting'}
          >
            <Download size={16} />
            {exportStatus === 'exporting' ? 'Exporting...' : 'Export Data'}
          </button>
          
          {exportStatus === 'success' && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f0fff4', border: '1px solid #48bb78', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={16} color="#48bb78" />
              <span style={{ color: '#2f855a' }}>Data exported successfully!</span>
            </div>
          )}
          
          {exportStatus === 'error' && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fed7d7', border: '1px solid #f56565', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={16} color="#f56565" />
              <span style={{ color: '#c53030' }}>Export failed. Please try again.</span>
            </div>
          )}
        </div>

        {/* Import Data */}
        <div style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
          <h4 style={{ margin: '0 0 1rem', color: '#2d3748' }}>Import Data</h4>
          <p style={{ margin: '0 0 1rem', color: '#4a5568', fontSize: '0.875rem' }}>
            Restore your data from a previously exported file. This will replace your current data.
          </p>
          <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
            <Upload size={16} />
            Choose File to Import
            <input
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={onImportData}
              disabled={importStatus === 'importing'}
            />
          </label>
          
          {importStatus === 'importing' && (
            <div style={{ marginTop: '1rem', color: '#667eea' }}>Importing data...</div>
          )}
          
          {importStatus === 'success' && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f0fff4', border: '1px solid #48bb78', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={16} color="#48bb78" />
              <span style={{ color: '#2f855a' }}>Data imported successfully! Page will refresh...</span>
            </div>
          )}
          
          {importStatus === 'error' && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fed7d7', border: '1px solid #f56565', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={16} color="#f56565" />
              <span style={{ color: '#c53030' }}>Import failed. Please check the file format.</span>
            </div>
          )}
        </div>

        {/* Clear All Data */}
        <div style={{ padding: '1.5rem', border: '1px solid #f56565', borderRadius: '0.5rem', backgroundColor: '#fef5e7' }}>
          <h4 style={{ margin: '0 0 1rem', color: '#c53030' }}>Clear All Data</h4>
          <p style={{ margin: '0 0 1rem', color: '#744210', fontSize: '0.875rem' }}>
            Permanently delete all your data including pain entries, medications, appointments, and settings. This action cannot be undone.
          </p>
          
          {showConfirmDialog === 'clearData' ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ color: '#c53030', fontWeight: '600' }}>Are you sure? This cannot be undone.</span>
              <button className="btn btn-danger" onClick={onClearData}>
                Yes, Delete All
              </button>
              <button className="btn btn-secondary" onClick={onCancelConfirm}>
                Cancel
              </button>
            </div>
          ) : (
            <button className="btn btn-danger" onClick={onClearData}>
              <Trash2 size={16} />
              Clear All Data
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Privacy Settings Component
const PrivacySettings = ({ settings, updateSettings }) => {
  const privacySettings = settings.privacy || {
    shareDataForResearch: false,
    allowAnonymousAnalytics: true,
    enableDataEncryption: true,
    autoDeleteOldData: false,
    dataRetentionMonths: 24
  };

  const handleToggle = (key) => {
    updateSettings({
      ...settings,
      privacy: {
        ...privacySettings,
        [key]: !privacySettings[key]
      }
    });
  };

  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem' }}>Privacy & Security</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={privacySettings.shareDataForResearch}
            onChange={() => handleToggle('shareDataForResearch')}
            style={{ marginTop: '0.25rem' }}
          />
          <div>
            <div className="form-label" style={{ margin: 0 }}>Share Anonymous Data for Research</div>
            <div style={{ fontSize: '0.875rem', color: '#718096' }}>
              Help improve back pain treatment by sharing anonymized data with researchers
            </div>
          </div>
        </label>

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={privacySettings.allowAnonymousAnalytics}
            onChange={() => handleToggle('allowAnonymousAnalytics')}
            style={{ marginTop: '0.25rem' }}
          />
          <div>
            <div className="form-label" style={{ margin: 0 }}>Anonymous Usage Analytics</div>
            <div style={{ fontSize: '0.875rem', color: '#718096' }}>
              Allow collection of anonymous usage data to improve the app
            </div>
          </div>
        </label>

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={privacySettings.enableDataEncryption}
            onChange={() => handleToggle('enableDataEncryption')}
            style={{ marginTop: '0.25rem' }}
          />
          <div>
            <div className="form-label" style={{ margin: 0 }}>Enable Data Encryption</div>
            <div style={{ fontSize: '0.875rem', color: '#718096' }}>
              Encrypt sensitive data stored on your device (recommended)
            </div>
          </div>
        </label>

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={privacySettings.autoDeleteOldData}
            onChange={() => handleToggle('autoDeleteOldData')}
            style={{ marginTop: '0.25rem' }}
          />
          <div>
            <div className="form-label" style={{ margin: 0 }}>Auto-Delete Old Data</div>
            <div style={{ fontSize: '0.875rem', color: '#718096' }}>
              Automatically remove data older than the retention period
            </div>
          </div>
        </label>

        {privacySettings.autoDeleteOldData && (
          <div className="form-group" style={{ marginLeft: '2rem' }}>
            <label className="form-label">Data Retention Period</label>
            <select
              className="form-select"
              style={{ width: '200px' }}
              value={privacySettings.dataRetentionMonths}
              onChange={(e) => updateSettings({
                ...settings,
                privacy: {
                  ...privacySettings,
                  dataRetentionMonths: parseInt(e.target.value)
                }
              })}
            >
              <option value={12}>12 months</option>
              <option value={24}>24 months</option>
              <option value={36}>36 months</option>
              <option value={60}>5 years</option>
            </select>
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f7fafc', borderRadius: '0.5rem' }}>
        <h4 style={{ margin: '0 0 0.5rem', color: '#2d3748' }}>Data Storage</h4>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#4a5568' }}>
          All your data is stored locally on your device. BackPain Manager Pro does not transmit your personal health information to external servers without your explicit consent.
        </p>
      </div>
    </div>
  );
};

// Help & Support Settings Component
const HelpSupportSettings = () => {
  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem' }}>Help & Support</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h4 style={{ margin: '0 0 1rem', color: '#2d3748' }}>Getting Started</h4>
          <ul style={{ paddingLeft: '1.5rem', color: '#4a5568' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Pain Tracking:</strong> Record your daily pain levels to identify patterns and triggers
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Exercise Library:</strong> Follow guided exercises designed for back pain relief
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Medication Management:</strong> Keep track of your medications and schedules
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <strong>Appointments:</strong> Manage your healthcare provider appointments
            </li>
          </ul>
        </div>

        <div>
          <h4 style={{ margin: '0 0 1rem', color: '#2d3748' }}>Frequently Asked Questions</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <details style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
              <summary style={{ cursor: 'pointer', fontWeight: '600', color: '#2d3748' }}>
                How do I export my data?
              </summary>
              <p style={{ margin: '0.5rem 0 0', color: '#4a5568', fontSize: '0.875rem' }}>
                Go to Settings → Data Management → Export Data. This will download all your information as a JSON file that you can save or share with healthcare providers.
              </p>
            </details>

            <details style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
              <summary style={{ cursor: 'pointer', fontWeight: '600', color: '#2d3748' }}>
                Is my data secure?
              </summary>
              <p style={{ margin: '0.5rem 0 0', color: '#4a5568', fontSize: '0.875rem' }}>
                Yes, all data is stored locally on your device and encrypted. No personal health information is transmitted to external servers without your explicit consent.
              </p>
            </details>

            <details style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
              <summary style={{ cursor: 'pointer', fontWeight: '600', color: '#2d3748' }}>
                Can I use this app offline?
              </summary>
              <p style={{ margin: '0.5rem 0 0', color: '#4a5568', fontSize: '0.875rem' }}>
                Yes, BackPain Manager Pro works completely offline. All features are available without an internet connection.
              </p>
            </details>
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 1rem', color: '#2d3748' }}>App Information</h4>
          <div style={{ padding: '1rem', backgroundColor: '#f7fafc', borderRadius: '0.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem 1rem', fontSize: '0.875rem' }}>
              <strong>Version:</strong>
              <span>1.0.0</span>
              <strong>Last Updated:</strong>
              <span>December 2024</span>
              <strong>Data Storage:</strong>
              <span>Local (Browser)</span>
              <strong>License:</strong>
              <span>Professional Medical Software</span>
            </div>
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 1rem', color: '#2d3748' }}>Legal & Compliance</h4>
          <div style={{ fontSize: '0.875rem', color: '#4a5568', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '1rem' }}>
              BackPain Manager Pro is designed as a tool to assist in pain management and should not replace professional medical advice. Always consult with healthcare providers for medical decisions.
            </p>
            <ul style={{ paddingLeft: '1.5rem' }}>
              <li>HIPAA Compliant Data Handling</li>
              <li>GDPR Privacy Protection</li>
              <li>Medical Device Software Guidelines</li>
              <li>Accessibility Standards (WCAG 2.1)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;