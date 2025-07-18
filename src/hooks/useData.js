import { useState, useEffect, useCallback } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { generateDateId } from '../utils/dateUtils';

// Hook for managing pain entries
export const usePainEntries = () => {
  const [painEntries, setPainEntries] = useState([]);

  useEffect(() => {
    const entries = storage.get(STORAGE_KEYS.PAIN_ENTRIES) || [];
    setPainEntries(entries);
  }, []);

  const addPainEntry = useCallback((entry) => {
    const newEntry = {
      id: generateDateId(),
      timestamp: new Date().toISOString(),
      ...entry
    };
    
    const updated = [...painEntries, newEntry];
    setPainEntries(updated);
    storage.set(STORAGE_KEYS.PAIN_ENTRIES, updated);
    return newEntry;
  }, [painEntries]);

  const updatePainEntry = useCallback((id, updates) => {
    const updated = painEntries.map(entry => 
      entry.id === id ? { ...entry, ...updates } : entry
    );
    setPainEntries(updated);
    storage.set(STORAGE_KEYS.PAIN_ENTRIES, updated);
  }, [painEntries]);

  const deletePainEntry = useCallback((id) => {
    const updated = painEntries.filter(entry => entry.id !== id);
    setPainEntries(updated);
    storage.set(STORAGE_KEYS.PAIN_ENTRIES, updated);
  }, [painEntries]);

  return {
    painEntries,
    addPainEntry,
    updatePainEntry,
    deletePainEntry
  };
};

// Hook for managing exercises
export const useExercises = () => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const savedExercises = storage.get(STORAGE_KEYS.EXERCISES) || [];
    setExercises(savedExercises);
  }, []);

  const addExercise = useCallback((exercise) => {
    const newExercise = {
      id: generateDateId(),
      ...exercise
    };
    
    const updated = [...exercises, newExercise];
    setExercises(updated);
    storage.set(STORAGE_KEYS.EXERCISES, updated);
    return newExercise;
  }, [exercises]);

  const updateExercise = useCallback((id, updates) => {
    const updated = exercises.map(exercise => 
      exercise.id === id ? { ...exercise, ...updates } : exercise
    );
    setExercises(updated);
    storage.set(STORAGE_KEYS.EXERCISES, updated);
  }, [exercises]);

  const deleteExercise = useCallback((id) => {
    const updated = exercises.filter(exercise => exercise.id !== id);
    setExercises(updated);
    storage.set(STORAGE_KEYS.EXERCISES, updated);
  }, [exercises]);

  return {
    exercises,
    addExercise,
    updateExercise,
    deleteExercise
  };
};

// Hook for managing appointments
export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const savedAppointments = storage.get(STORAGE_KEYS.APPOINTMENTS) || [];
    setAppointments(savedAppointments);
  }, []);

  const addAppointment = useCallback((appointment) => {
    const newAppointment = {
      id: generateDateId(),
      ...appointment
    };
    
    const updated = [...appointments, newAppointment];
    setAppointments(updated);
    storage.set(STORAGE_KEYS.APPOINTMENTS, updated);
    return newAppointment;
  }, [appointments]);

  const updateAppointment = useCallback((id, updates) => {
    const updated = appointments.map(appointment => 
      appointment.id === id ? { ...appointment, ...updates } : appointment
    );
    setAppointments(updated);
    storage.set(STORAGE_KEYS.APPOINTMENTS, updated);
  }, [appointments]);

  const deleteAppointment = useCallback((id) => {
    const updated = appointments.filter(appointment => appointment.id !== id);
    setAppointments(updated);
    storage.set(STORAGE_KEYS.APPOINTMENTS, updated);
  }, [appointments]);

  return {
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment
  };
};

// Hook for managing medications
export const useMedications = () => {
  const [medications, setMedications] = useState([]);

  useEffect(() => {
    const savedMedications = storage.get(STORAGE_KEYS.MEDICATIONS) || [];
    setMedications(savedMedications);
  }, []);

  const addMedication = useCallback((medication) => {
    const newMedication = {
      id: generateDateId(),
      ...medication
    };
    
    const updated = [...medications, newMedication];
    setMedications(updated);
    storage.set(STORAGE_KEYS.MEDICATIONS, updated);
    return newMedication;
  }, [medications]);

  const updateMedication = useCallback((id, updates) => {
    const updated = medications.map(medication => 
      medication.id === id ? { ...medication, ...updates } : medication
    );
    setMedications(updated);
    storage.set(STORAGE_KEYS.MEDICATIONS, updated);
  }, [medications]);

  const deleteMedication = useCallback((id) => {
    const updated = medications.filter(medication => medication.id !== id);
    setMedications(updated);
    storage.set(STORAGE_KEYS.MEDICATIONS, updated);
  }, [medications]);

  return {
    medications,
    addMedication,
    updateMedication,
    deleteMedication
  };
};

// Hook for app settings
export const useSettings = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    language: 'en'
  });

  useEffect(() => {
    const savedSettings = storage.get(STORAGE_KEYS.SETTINGS);
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, []);

  const updateSettings = useCallback((updates) => {
    const updated = { ...settings, ...updates };
    setSettings(updated);
    storage.set(STORAGE_KEYS.SETTINGS, updated);
  }, [settings]);

  return {
    settings,
    updateSettings
  };
};