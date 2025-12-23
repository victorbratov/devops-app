import axios from 'axios';
import { Booking, CreateBookingRequest, Room } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
const USE_PROXY = process.env.NEXT_PUBLIC_USE_API_PROXY === 'true';

const apiClient = axios.create({
  // When proxy is enabled, go through Next.js API routes to avoid CORS.
  baseURL: USE_PROXY ? '/api' : API_BASE_URL,
});

// Handle errors - backend returns plain text error messages
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Backend returns plain text error messages
      const errorMessage = error.response.data || error.response.statusText || 'An error occurred';
      const enhancedError = new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
      (enhancedError as any).response = error.response;
      return Promise.reject(enhancedError);
    }
    // Network errors (connection refused, CORS, etc.)
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      const networkError = new Error('Cannot connect to backend service. Make sure the booking service is running on ' + API_BASE_URL);
      (networkError as any).response = error.response;
      return Promise.reject(networkError);
    }
    return Promise.reject(error);
  }
);

export const roomsApi = {
  getAll: async (): Promise<Room[]> => {
    const response = await apiClient.get<Room[]>('/rooms');
    return response.data;
  },
};

export const bookingsApi = {
  getAll: async (token: string): Promise<Booking[]> => {
    const response = await apiClient.get<Booking[]>('/bookings', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
  create: async (data: CreateBookingRequest, token: string): Promise<Booking> => {
    const response = await apiClient.post<Booking>('/bookings', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export interface ForecastResponse {
  location: string;
  date: string;
  temperature: number;
  cached: boolean;
}

export const forecastApi = {
  getForecast: async (location: string, date: string): Promise<ForecastResponse> => {
    // Use proxy API route to avoid CORS issues
    const response = await apiClient.post<ForecastResponse>('/forecast', {
      location,
      date,
    });
    return response.data;
  },
};

export function calculateDynamicPrice(basePrice: number, temperature: number): number {
  const diff = Math.abs(temperature - 21);
  return basePrice + diff;
}

