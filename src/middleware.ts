import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "stockflow_session";

const publicPaths = ["/login", "/signup"];
const authApiPaths = ["/api/auth/login", "/api/auth/signup"];

function getSecret() {
  return new TextEncoder().encode(
    process.env.JWT_SECRET || "dev-secret-change-in-production"
  );
}

async function hasValidSession(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const isPublic =
    publicPaths.includes(pathname) || authApiPaths.some((p) => pathname.startsWith(p));
  const loggedIn = await hasValidSession(request);

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(loggedIn ? "/dashboard" : "/login", request.url)
    );
  }

  if (!loggedIn && !isPublic && !pathname.startsWith("/_next")) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (loggedIn && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
