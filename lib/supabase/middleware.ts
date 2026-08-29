import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/types/database.types';

// Rutas privadas que requieren autenticación
const PROTECTED_ROUTES = [
  '/profile',
  '/library',
  '/chat',
  '/wishlist',
  '/checkout',
  '/gamification',
];

// Rutas administrativas que requieren rol ADMIN
const ADMIN_ROUTES = ['/admin'];

// Rutas de autenticación (los usuarios logueados son redirigidos)
const AUTH_ROUTES = ['/login'];

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rjtjzuvpdqnaxfenwsot.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdGp6dXZwZHFuYXhmZW53c290Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MDU4NDQsImV4cCI6MjEwMjk4MTg0NH0.RL-M0I-UgzQ6LhYOidOFI6njIrgDfUQNJ63bKDkbuFw';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const pathname = request.nextUrl.pathname;

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isAdminRoute = ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route);

  // En rutas públicas (Home, Catálogo, Fichas de Juego, Carrito), retornar inmediatamente en <1ms
  if (!isProtectedRoute && !isAdminRoute && !isAuthRoute) {
    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // En rutas privadas o de autenticación, verificar la sesión
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;
  } catch {
    user = null;
  }

  // 1. Protección de rutas privadas de usuario (/checkout, /profile, /wishlist, etc.)
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 2. Protección de rutas de administración (Redirección inicial si no está autenticado)
  if (isAdminRoute && !user) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 3. Rutas de autenticación (si ya tiene sesión activa, redirigir a destino o home)
  if (isAuthRoute && user) {
    const redirectTo = request.nextUrl.searchParams.get('redirect') || '/';
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return supabaseResponse;
}
