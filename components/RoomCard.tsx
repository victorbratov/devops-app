'use client';

import { Room } from '@/types';
import Link from 'next/link';

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <Link href={`/rooms/${room.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {room.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          📍 {room.location}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-500">
            Capacity: {room.capacity} people
          </span>
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
            ${room.basePrice.toFixed(2)}/hr
          </span>
        </div>
      </div>
    </Link>
  );
}

