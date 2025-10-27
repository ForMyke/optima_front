import { NextResponse } from 'next/server'

/**
 * Middleware de Next.js para proteger rutas
 * Se ejecuta en TODAS las peticiones antes de renderizar
 */
export function middleware(request) {
  const { pathname } = request.nextUrl
  
  // Obtener el token de las cookies
  const token = request.cookies.get('token')?.value
  
  // Si está intentando acceder al dashboard sin token, redirigir a login
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      // No hay sesión, redirigir a login
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    // Aquí podríamos decodificar el token y verificar permisos
    // Por ahora, si tiene token, permitir acceso
    // La verificación de permisos la haremos en el cliente
  }
  
  // Si está en la página de login y ya tiene token, redirigir al dashboard
  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

/**
 * Configurar en qué rutas se ejecuta el middleware
 */
export const config = {
  matcher: [
    /*
     * Match todas las rutas excepto:
     * - api (API routes)
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
