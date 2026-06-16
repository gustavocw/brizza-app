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
    forgotPassword: (): Href => ({ pathname: '/(public)/forgot-password' }),
    register: (): Href => ({ pathname: '/(public)/register' }),
    undelete: (): Href => ({ pathname: '/(public)/undelete' }),
  },

  private: {
    home: (): Href => ({ pathname: '/(private)/home' }),
    example: (): Href => ({ pathname: '/(private)/example' }),
    exampleDetail: (id: string): Href => ({ pathname: '/(private)/example/[id]', params: { id } }),
    /** Legal documents served by the API (privacy policy / terms of use). */
    legal: (kind: 'privacy' | 'terms'): Href => ({ pathname: '/(private)/legal/[kind]', params: { kind } }),
    notificationSettings: (): Href => ({ pathname: '/(private)/notification-settings' }),
    changePassword: (): Href => ({ pathname: '/(private)/change-password' }),
    editProfile: (): Href => ({ pathname: '/(private)/edit-profile' }),
    changeContact: (kind: 'email' | 'phone'): Href => ({ pathname: '/(private)/change-contact/[kind]', params: { kind } }),
    sessions: (): Href => ({ pathname: '/(private)/sessions' }),
    support: (): Href => ({ pathname: '/(private)/support' }),
    supportNew: (): Href => ({ pathname: '/(private)/support/new' }),
    supportTicket: (id: string): Href => ({ pathname: '/(private)/support/[id]', params: { id } }),
    linkBike: (): Href => ({ pathname: '/(private)/link-bike' }),
    verify: (kind: 'email' | 'phone'): Href => ({ pathname: '/(private)/verify/[kind]', params: { kind } }),
    lgpdExport: (): Href => ({ pathname: '/(private)/lgpd-export' }),
  },

  tabs: {
    home: (): Href => ({ pathname: '/(tabs)/home' }),
    bike: (): Href => ({ pathname: '/(tabs)/bike' }),
    charge: (): Href => ({ pathname: '/(tabs)/charge' }),
    alerts: (): Href => ({ pathname: '/(tabs)/alerts' }),
    profile: (): Href => ({ pathname: '/(tabs)/profile' }),
  },
}
