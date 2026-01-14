import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path requires authentication
  const isProtectedRoute = pathname.startsWith('/dashboard');
  const isAuthRoute = pathname === '/';
  
  const session = request.cookies.get('session');
  const userId = request.cookies.get('userId');
  
  const isAuthenticated = session && userId;

  // Redirect to login if trying to access protected route without auth
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect to dashboard if already logged in and trying to access login page
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
};
