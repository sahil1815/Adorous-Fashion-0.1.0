import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/account", "/checkout"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const requiresAuth = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!requiresAuth) {
    return NextResponse.next();
  }

  const session = request.cookies.get("session")?.value;
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account", "/checkout"],
};
