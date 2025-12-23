'use client';

import { UserButton, SignInButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              Room Booking
            </Link>
            {isSignedIn && (
              <>
                <Link
                  href="/"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Rooms
                </Link>
                <Link
                  href="/bookings"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  My Bookings
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center">
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

