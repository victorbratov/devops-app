'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { bookingsApi } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';
import PricePreview from './PricePreview';

interface BookingFormProps {
  roomId: string;
  roomName: string;
  basePrice: number;
  location: string;
}

export default function BookingForm({ roomId, roomName, basePrice, location }: BookingFormProps) {
  const router = useRouter();
  const { getToken } = useAuth();
  
  // Set default time (next hour, top of the hour)
  const getDefaultStart = () => {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1);
    nextHour.setMinutes(0);
    nextHour.setSeconds(0);
    nextHour.setMilliseconds(0);
    return format(nextHour, "yyyy-MM-dd'T'HH:mm");
  };

  // End time is always 1 hour after start time
  const getEndTime = (start: string) => {
    if (!start) return '';
    const startDate = new Date(start);
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);
    return format(endDate, "yyyy-MM-dd'T'HH:mm");
  };

  const [startTime, setStartTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  // Initialize dates only on client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    setStartTime(getDefaultStart());
  }, []);

  const endTime = getEndTime(startTime);

  // Round to top of hour when user selects a time
  const handleStartTimeChange = (value: string) => {
    if (!value) {
      setStartTime('');
      return;
    }
    const date = new Date(value);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    setStartTime(format(date, "yyyy-MM-dd'T'HH:mm"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = await getToken();
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      if (!startTime) {
        setError('Please select a start time');
        setLoading(false);
        return;
      }

      // Convert local datetime to ISO string
      const startISO = new Date(startTime).toISOString();
      const endISO = new Date(endTime).toISOString();

      await bookingsApi.create(
        {
          roomId,
          startTime: startISO,
          endTime: endISO,
        },
        token
      );

      router.push('/bookings?success=true');
    } catch (err: any) {
      const errorMessage = err.response?.data || err.message || 'Failed to create booking';
      setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  // Show loading state until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Start Time (1 hour booking)
          </label>
          <input
            type="datetime-local"
            disabled
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white opacity-50"
          />
        </div>
      </form>
    );
  }

  // Get minimum time (next hour, rounded to top of hour)
  const getMinTime = () => {
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(now.getHours() + 1);
    nextHour.setMinutes(0);
    nextHour.setSeconds(0);
    nextHour.setMilliseconds(0);
    return format(nextHour, "yyyy-MM-dd'T'HH:mm");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Start Time (1 hour booking)
        </label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => handleStartTimeChange(e.target.value)}
          required
          min={getMinTime()}
          step="3600"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Bookings are 1 hour long, starting at the top of the hour
        </p>
      </div>

      {startTime && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            End Time
          </label>
          <input
            type="datetime-local"
            value={endTime}
            disabled
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-400 opacity-75 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Automatically set to 1 hour after start time
          </p>
        </div>
      )}

      {startTime && location && (
        <PricePreview basePrice={basePrice} location={location} startTime={startTime} />
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Booking...' : 'Book Room'}
      </button>
    </form>
  );
}

