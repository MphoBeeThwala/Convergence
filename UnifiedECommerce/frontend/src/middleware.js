import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get the pathname of the request (e.g. /, /protected-route)
  const path = request.nextUrl.pathname;

  // If it's the dashboard route and there's no token, redirect to login
  if (path === '/dashboard') {
    if (!request.cookies.has('token')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Continue with the request
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*']
};
