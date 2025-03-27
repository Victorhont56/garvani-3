// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired
  await supabase.auth.getSession()

  const { data: { session } } = await supabase.auth.getSession()
  const { pathname } = req.nextUrl

  // Define public routes
  const isPublicRoute = [
    '/',
    '/login',
    '/signup',
    '/forgot-password',
    '/api/trpc/(.*)',
  ].some(route => {
    if (route.endsWith('/(.*)')) {
      const baseRoute = route.replace('/(.*)', '')
      return pathname.startsWith(baseRoute)
    }
    return pathname === route || pathname.startsWith(`${route}/`)
  })

  // Allow public routes and _next static files
  if (isPublicRoute || pathname.startsWith('/_next')) {
    return res
  }

  // Redirect unauthenticated users to login
  if (!session) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
   /*
     * Match all request paths except for:
     * - API routes
     * - Static files (images, fonts, etc.)
     * - Auth routes
     * - Next.js internals
     */
   '/((?!api|_next/static|_next/image|images|img|assets|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}