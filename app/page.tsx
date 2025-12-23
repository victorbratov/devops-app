'use client';

import { useEffect, useState } from 'react';
import { roomsApi } from '@/lib/api';
import { Room } from '@/types';
import RoomCard from '@/components/RoomCard';
import Navbar from '@/components/Navbar';

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await roomsApi.getAll();
      setRooms(data);
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to load rooms';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = searchLocation
    ? rooms.filter((room) =>
        room.location.toLowerCase().includes(searchLocation.toLowerCase())
      )
    : rooms;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Conference Rooms
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Book a conference room with dynamic weather-based pricing
          </p>
          <div className="max-w-md">
            <input
              type="text"
              placeholder="Search by location..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading rooms...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {filteredRooms.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  {searchLocation ? 'No rooms found for this location' : 'No rooms available'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
