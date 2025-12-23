# Quick Setup Guide

## 1. Install Dependencies

```bash
pnpm install
```

## 2. Create Environment File

Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_USE_API_PROXY=true
```

## 3. Get Clerk Keys

1. Go to https://clerk.com and sign up/login
2. Create a new application
3. Copy the Publishable Key and Secret Key
4. Paste them into `.env.local`

## 4. Start Backend Services

In the `devops-server` directory:

```bash
cd ../devops-server
docker compose up --build
```

Wait for services to be ready (MongoDB, Redis, booking-service, forecast-service).

## 5. Seed Test Rooms (Optional)

```bash
./scripts/seed-rooms.sh http://localhost:8080
```

## 6. Start Frontend

```bash
pnpm dev
```

Visit http://localhost:3000

## Testing the App

1. **Browse Rooms**: The home page shows all available rooms (no login required)
2. **View Room Details**: Click on any room to see details
3. **Sign In**: Click "Sign In" to create an account or login
4. **Book a Room**: After signing in, you can book rooms from the room detail page
5. **View Bookings**: Navigate to "My Bookings" to see all your reservations

## Troubleshooting

- **"Failed to load rooms"**: Make sure the backend services are running
- **"Authentication required"**: Make sure your Clerk keys are correct in `.env.local`
- **CORS errors**: Check that `NEXT_PUBLIC_API_BASE_URL` matches your backend URL

