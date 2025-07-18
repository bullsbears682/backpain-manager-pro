import { format, isToday, isYesterday, differenceInDays, startOfWeek, endOfWeek, subWeeks, addDays } from 'date-fns';

export const formatDate = (date) => {
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) {
    return 'Today';
  }
  
  if (isYesterday(dateObj)) {
    return 'Yesterday';
  }
  
  const daysAgo = differenceInDays(new Date(), dateObj);
  if (daysAgo < 7) {
    return `${daysAgo} days ago`;
  }
  
  return format(dateObj, 'MMM dd, yyyy');
};

export const formatTime = (date) => {
  return format(new Date(date), 'HH:mm');
};

export const formatDateTime = (date) => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

export const getWeekRange = (date = new Date()) => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(date, { weekStartsOn: 1 }); // Sunday
  return { start, end };
};

export const getLastNDays = (n = 7) => {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date);
  }
  return days;
};

export const generateDateId = () => {
  return new Date().toISOString();
};

export const isDateInRange = (date, startDate, endDate) => {
  const checkDate = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return checkDate >= start && checkDate <= end;
};