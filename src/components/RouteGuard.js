'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authService } from '@/app/services/authService'
import { hasPermission } from '@/config/permissions'

/**
 * Componente HOC para proteger rutas según permisos del usuario
 * Uso: Envolver el contenido de cada página del dashboard
 */
export function RouteGuard({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    // Verificar autenticación y permisos
    const checkAuth = () => {
      // 1. Verificar si está autenticado
      if (!authService.isAuthenticated()) {
        router.push('/')
        return
      }

      // 2. Verificar permisos del rol para esta ruta
      const user = authService.getUser()
      
      if (!user || !user.rol) {
        console.error('Usuario sin rol definido')
        router.push('/')
        return
      }

      // 3. Verificar si tiene permiso para acceder a esta ruta
      const hasAccess = hasPermission(user.rol, pathname)
      
      if (!hasAccess) {
        console.warn(`Usuario ${user.email} sin permisos para ${pathname}`)
        // Redirigir al dashboard principal (todos tienen acceso)
        router.push('/dashboard')
        return
      }

      // Todo OK, autorizar acceso
      setAuthorized(true)
    }

    checkAuth()
  }, [pathname, router])

  // Mientras verifica permisos, mostrar loading
  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Verificando permisos...</p>
        </div>
      </div>
    )
  }

  // Usuario autorizado, mostrar contenido
  return <>{children}</>
}
