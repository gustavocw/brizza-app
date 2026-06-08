import type { Href } from 'expo-router'

/**
 * Single source for every navigable destination — no magic strings at call
 * sites, params fully typed. Pair with useNavigation():
 *
 *   const nav = useNavigation()
 *   nav.push(routes.private.exampleDetail(id))
 */
export const routes = {
  splash: (): Href => ({ pathname: '/splash' }),

  public: {
    signIn: (): Href => ({ pathname: '/(public)/sign-in' }),
  },

  private: {
    home: (): Href => ({ pathname: '/(private)/home' }),
    example: (): Href => ({ pathname: '/(private)/example' }),
    exampleDetail: (id: string): Href => ({ pathname: '/(private)/example/[id]', params: { id } }),
    /** Legal documents served by the API (privacy policy / terms of use). */
    legal: (kind: 'privacy' | 'terms'): Href => ({ pathname: '/(private)/legal/[kind]', params: { kind } }),
  },

  tabs: {
    home: (): Href => ({ pathname: '/(tabs)/home' }),
    bike: (): Href => ({ pathname: '/(tabs)/bike' }),
    charge: (): Href => ({ pathname: '/(tabs)/charge' }),
    alerts: (): Href => ({ pathname: '/(tabs)/alerts' }),
    profile: (): Href => ({ pathname: '/(tabs)/profile' }),
  },
}
