export interface Room {
  id: string;
  name: string;
  location: string;
  basePrice: number;
  capacity: number;
}

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  startTime: string;
  endTime: string;
  price: number;
  location: string;
}

export interface CreateBookingRequest {
  roomId: string;
  startTime: string;
  endTime: string;
}

