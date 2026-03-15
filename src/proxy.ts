import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Authentication middleware.
 * Checks for session token cookie to protect routes.
 * Lightweight — no database calls, no Node.js dependencies.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for the NextAuth session token cookie
  const token =
    request.cookies.get("authjs.session-token") ??
    request.cookies.get("__Secure-authjs.session-token");

  const isLoggedIn = !!token;
  const isOnLogin = pathname.startsWith("/login");
  const isOnSignUp = pathname.startsWith("/signup");
  const isOnVerifyEmail = pathname.startsWith("/verify-email");
  const isOnBooking = pathname.startsWith("/booking");
  const isPublicRoute =
    isOnLogin || isOnSignUp || isOnVerifyEmail || isOnBooking;

  // ─── Security headers ──────────────────────────────────────────
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // If on auth pages and already authenticated, redirect to home
  if ((isOnLogin || isOnSignUp) && isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Public routes don't require auth
  if (isPublicRoute) {
    return response;
  }

  // If not on a public route and not authenticated, redirect to signup
  if (!isLoggedIn) {
    const signUpUrl = new URL("/signup", request.url);
    signUpUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(signUpUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (all API routes — they handle their own auth)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, icons, sw.js, manifest
     */
    "/((?!api|_next/static|_next/image|favicon\\.ico|icons|sw\\.js|manifest).*)",
  ],
};
