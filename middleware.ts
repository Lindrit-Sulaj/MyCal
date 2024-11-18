import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // const token = request.cookies.get("next-auth.session-token")
  // const isAuthPage = request.nextUrl.pathname.startsWith('/log-in') || request.nextUrl.pathname.startsWith('/sign-up')

  // if (!token && !isAuthPage) {
  //   return NextResponse.redirect(new URL("/log-in", request.url));
  // }

  // if (token && isAuthPage) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url))
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/getting-started", "/log-in", "/sign-up"]
}