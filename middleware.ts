import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/', // Home page with room listing
  '/rooms(.*)', // Room detail pages
  '/api/rooms(.*)', // Public rooms proxy
  '/api/forecast(.*)', // Public forecast proxy
]);

export default clerkMiddleware(async (auth, req) => {
  // Only protect routes that are not public
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

