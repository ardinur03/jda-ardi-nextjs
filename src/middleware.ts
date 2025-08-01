
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    const { token } = request.nextauth;
    const { pathname } = request.nextUrl;

    const isAdminRoute = pathname.startsWith('/admin');
    const isDashboardRoute = pathname.startsWith('/dashboard');

    // If user is not logged in, redirect to login
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // If user is ADMIN and tries to access member dashboard, redirect to admin dashboard
    if (isDashboardRoute && token.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // If user is MEMBER and tries to access admin routes, redirect to member dashboard
    if (isAdminRoute && token.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
