# Conference Room Booking System - Frontend

A Next.js frontend application for booking conference rooms with dynamic weather-based pricing.

## Features

- 🔐 **Authentication**: Clerk-powered user authentication
- 🏢 **Room Search**: Browse and search conference rooms by location
- 📅 **Booking Management**: Create and view your bookings
- 💰 **Dynamic Pricing**: Prices adjust based on weather forecast
- 🎨 **Modern UI**: Responsive design with dark mode support

## Prerequisites

- Node.js 18+ and pnpm (or npm/yarn)
- Clerk account and API keys
- Backend services running (see `../devops-server/README.md`)

## Setup

1. **Install dependencies:**

```bash
pnpm install
```

2. **Configure environment variables:**

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
- `CLERK_SECRET_KEY`: Your Clerk secret key
- `NEXT_PUBLIC_API_BASE_URL`: Backend API URL (default: `http://localhost:8080`)
- `NEXT_PUBLIC_USE_API_PROXY`: Set to `true` to route API calls through Next.js (avoids CORS)

3. **Set up Clerk:**

- Create a Clerk account at https://clerk.com
- Create a new application
- Copy your publishable key and secret key to `.env.local`
- Configure Clerk to allow your frontend domain

## Development

1. **Start the backend services** (see `../devops-server/README.md`):

```bash
cd ../devops-server
docker compose up --build
```

2. **Seed test rooms** (optional):

```bash
./scripts/seed-rooms.sh http://localhost:8080
```

3. **Run the development server**:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  ├── page.tsx              # Home page with room listing
  ├── layout.tsx            # Root layout with Clerk provider
  ├── rooms/
  │   └── [id]/
  │       └── page.tsx      # Room detail and booking page
  └── bookings/
      └── page.tsx          # User bookings page

components/
  ├── Navbar.tsx            # Navigation bar
  ├── RoomCard.tsx          # Room card component
  └── BookingForm.tsx       # Booking form component

lib/
  └── api.ts                # API client utilities

types/
  └── index.ts              # TypeScript type definitions
```

## Deployment

This app is configured for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

The app will automatically deploy on every push to the main branch.

## API Integration

The frontend communicates with the backend services:

- **Booking Service** (`http://localhost:8080`): Handles rooms and bookings
- **Forecast Service** (`http://localhost:8081`): Provides weather forecasts (used by booking service)

Make sure both backend services are running before using the frontend.
