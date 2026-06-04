import { router, type Href } from 'expo-router'
import { routes } from '@/shared/constants/routes'

/**
 * Thin, typed wrapper over expo-router. Keeps navigation calls uniform and the
 * route table discoverable.
 *
 *   const nav = useNavigation()
 *   nav.push(routes.private.example())
 *   nav.replace(routes.public.signIn())
 *   nav.back()
 */
export function useNavigation() {
  return {
    routes,
    push: (href: Href) => router.push(href),
    replace: (href: Href) => router.replace(href),
    back: () => router.back(),
    canGoBack: () => router.canGoBack(),
    dismissAll: () => router.dismissAll(),
  }
}
