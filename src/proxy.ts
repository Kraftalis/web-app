import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Authentication middleware with subdomain-based routing.
 *
 * Subdomain strategy:
 *   vendor.kraftalis.com/{path}  →  internally rewrites to /vendor/{path}
 *   client.kraftalis.com/{path}  →  internally rewrites to /client/{path}
 *   kraftalis.com/{path}         →  served as-is (landing page + public routes)
 *
 * The rewrite is transparent — the browser URL stays at the clean path
 * (e.g. vendor.kraftalis.com/event, not vendor.kraftalis.com/vendor/event).
 *
 * Also enforces onboarding: if a logged-in vendor user hasn't set up their
 * business profile (indicated by the `bp` cookie), redirect them to /onboarding.
 */
export function proxy(request: NextRequest) {
  const { pathname, origin, search } = request.nextUrl;
  const host = request.headers.get("host") ?? "";

  // ─── Detect subdomain ──────────────────────────────────────────
  // Matches production (vendor.kraftalis.com) and local dev (vendor.localhost).
  const isVendorDomain =
    host.startsWith("vendor.") || host.startsWith("vendor-");
  const isClientDomain =
    host.startsWith("client.") || host.startsWith("client-");

  if (isClientDomain) {
    return handleClientDomain(request, pathname, origin, search);
  }

  if (isVendorDomain) {
    return handleVendorDomain(request, pathname, origin, search);
  }

  // ─── Main domain (kraftalis.com) ──────────────────────────────
  // Only landing page and public pages. Just add security headers.
  const response = NextResponse.next();
  applySecurityHeaders(response);
  return response;
}

// ─── Security headers ─────────────────────────────────────────────
function applySecurityHeaders(response: NextResponse) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
}

// ─── Client domain ─────────────────────────────────────────────────
// client.kraftalis.com/{path} → rewrite to /client/{path}
// All client booking routes are public — no auth required.
function handleClientDomain(
  request: NextRequest,
  pathname: string,
  origin: string,
  search: string,
) {
  const rewriteUrl = new URL(`/client${pathname}${search}`, origin);
  const response = NextResponse.rewrite(rewriteUrl);
  applySecurityHeaders(response);
  return response;
}

// ─── Vendor domain ─────────────────────────────────────────────────
// vendor.kraftalis.com/{path} → rewrite to /vendor/{path}
// Enforces authentication and onboarding flow.
// `pathname` is the clean browser path (e.g. /event, /login).
function handleVendorDomain(
  request: NextRequest,
  pathname: string,
  origin: string,
  search: string,
) {
  const token =
    request.cookies.get("authjs.session-token") ??
    request.cookies.get("__Secure-authjs.session-token");
  const isLoggedIn = !!token;

  // Build the internal rewrite URL (/vendor/{path})
  const internalPath = pathname === "/" ? "/vendor" : `/vendor${pathname}`;
  const rewriteUrl = new URL(`${internalPath}${search}`, origin);

  const rewrite = () => {
    const res = NextResponse.rewrite(rewriteUrl);
    applySecurityHeaders(res);
    return res;
  };

  const redirect = (cleanPath: string) => {
    const res = NextResponse.redirect(new URL(cleanPath, request.url));
    applySecurityHeaders(res);
    return res;
  };

  // ─── Classify the clean browser path ──────────────────────────
  const isOnLogin = pathname.startsWith("/login");
  const isOnSignUp = pathname.startsWith("/signup");
  const isOnVerifyEmail = pathname.startsWith("/verify-email");
  const isOnOnboarding = pathname.startsWith("/onboarding");
  const isRoot = pathname === "/";
  const isPublicRoute = isOnLogin || isOnSignUp || isOnVerifyEmail || isRoot;

  // Authenticated user hitting login/signup → redirect home (or onboarding)
  if ((isOnLogin || isOnSignUp) && isLoggedIn) {
    const hasBp = request.cookies.get("bp");
    return redirect(hasBp ? "/" : "/onboarding");
  }

  // Public routes → just rewrite to internal path
  if (isPublicRoute) {
    return rewrite();
  }

  // Unauthenticated on a protected route → signup
  if (!isLoggedIn) {
    const signUpUrl = new URL("/signup", request.url);
    signUpUrl.searchParams.set("callbackUrl", request.url);
    const res = NextResponse.redirect(signUpUrl);
    applySecurityHeaders(res);
    return res;
  }

  // ─── Onboarding enforcement ────────────────────────────────────
  // The "bp" cookie is set when the business profile is saved.
  const hasBp = request.cookies.get("bp");
  if (!hasBp && !isOnOnboarding) {
    return redirect("/onboarding");
  }
  if (hasBp && isOnOnboarding) {
    return redirect("/");
  }

  return rewrite();
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
