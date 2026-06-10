import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/sign-up', '/verification']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value
  const profileIncompleteCookie =
    request.cookies.get('isProfileCompleted')?.value;
  const hasAddress = request.cookies.get('hasAddress')?.value;
  const isProfileRoute = pathname.startsWith('/profile')
  // console.log("first", profileCompleted)

  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route))

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token && isPublic) {
    if (pathname.startsWith('/verification') && request.nextUrl.searchParams.get('flow') === 'social-phone') {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (token && profileIncompleteCookie && !isProfileRoute) {
    return NextResponse.redirect(
      new URL('/profile', request.url)
    )
  }

  if (
    token &&
    hasAddress &&
    pathname !== '/profile/add-address'
  ) {
    return NextResponse.redirect(
      new URL('/profile/add-address', request.url)
    );
  }


  if (token && !profileIncompleteCookie && !hasAddress && isProfileRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  if (token && !profileIncompleteCookie && !hasAddress && pathname == '/profile/add-address') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  const response = NextResponse.next()

  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  response.headers.set('Pragma', 'no-cache')

  return response
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|images|.*\\..*).*)'],
}
