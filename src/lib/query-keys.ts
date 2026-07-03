// Centralized query-key factory. ONE place that owns the cache namespace so
// invalidation is precise and typo-free.
//
//   useQuery({ queryKey: qk.support.detail(id), ... })
//   queryClient.invalidateQueries({ queryKey: qk.support.all })
//
// Convention: `all` is the broad prefix; narrower keys spread it so invalidating
// `all` also clears lists/details. Add a block per domain.

export const qk = {
  dashboard: {
    all: ['dashboard'] as const,
    summary: () => [...qk.dashboard.all, 'summary'] as const,
  },

  me: {
    all: ['me'] as const,
    profile: () => [...qk.me.all, 'profile'] as const,
    location: (cep: string) => [...qk.me.all, 'location', cep] as const,
  },

  legal: {
    all: ['legal'] as const,
    doc: (kind: 'privacy' | 'terms') => [...qk.legal.all, kind] as const,
    status: () => [...qk.legal.all, 'status'] as const,
  },

  notifications: {
    all: ['notifications'] as const,
    list: () => [...qk.notifications.all, 'list'] as const,
    unread: () => [...qk.notifications.all, 'unread'] as const,
  },

  charge: {
    all: ['charge'] as const,
    stations: (params?: Record<string, unknown>) => [...qk.charge.all, 'stations', params ?? {}] as const,
  },

  bike: {
    all: ['bike'] as const,
    detail: () => [...qk.bike.all, 'detail'] as const,
  },

  notificationPrefs: {
    all: ['notification-prefs'] as const,
  },

  sessions: {
    all: ['sessions'] as const,
  },

  support: {
    all: ['support'] as const,
    list: () => [...qk.support.all, 'list'] as const,
    detail: (id: string) => [...qk.support.all, 'detail', id] as const,
  },
}
