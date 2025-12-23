'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { roomsApi } from '@/lib/api';
import { Room } from '@/types';
import Navbar from '@/components/Navbar';
import BookingForm from '@/components/BookingForm';
import { useAuth } from '@clerk/nextjs';

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      loadRoom(params.id as string);
    }
  }, [params.id]);

  const loadRoom = async (id: string) => {
    try {
      setLoading(true);
      const rooms = await roomsApi.getAll();
      const foundRoom = rooms.find((r) => r.id === id);
      if (!foundRoom) {
        setError('Room not found');
      } else {
        setRoom(foundRoom);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load room');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-600 dark:text-gray-400">Loading room details...</p>
        </main>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            {error || 'Room not found'}
          </div>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Rooms
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.push('/')}
          className="mb-6 text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to Rooms
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {room.name}
          </h1>
          <div className="space-y-4">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Location: </span>
              <span className="text-gray-900 dark:text-white font-medium">
                {room.location}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Capacity: </span>
              <span className="text-gray-900 dark:text-white font-medium">
                {room.capacity} people
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Base Price: </span>
              <span className="text-gray-900 dark:text-white font-medium text-xl">
                ${room.basePrice.toFixed(2)}/hour
              </span>
            </div>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                💡 <strong>Dynamic Pricing:</strong> The final price includes a surcharge based on
                the forecasted temperature deviation from 21°C. Prices are calculated at booking
                time.
              </p>
            </div>
          </div>
        </div>

        {isSignedIn ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Book This Room
            </h2>
            <BookingForm
              roomId={room.id}
              roomName={room.name}
              basePrice={room.basePrice}
              location={room.location}
            />
          </div>
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300 px-4 py-3 rounded-lg">
            Please sign in to book a room.
          </div>
        )}
      </main>
    </div>
  );
}

