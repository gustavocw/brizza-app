// Centralized query-key factory. ONE place that owns the cache namespace so
// invalidation is precise and typo-free.
//
//   useQuery({ queryKey: qk.example.detail(id), ... })
//   queryClient.invalidateQueries({ queryKey: qk.example.all })
//
// Convention: `all` is the broad prefix; narrower keys spread it so invalidating
// `all` also clears lists/details. Add a block per domain.

export const qk = {
  example: {
    all: ['example'] as const,
    lists: () => [...qk.example.all, 'list'] as const,
    list: (params?: Record<string, unknown>) => [...qk.example.lists(), params ?? {}] as const,
    details: () => [...qk.example.all, 'detail'] as const,
    detail: (id: string) => [...qk.example.details(), id] as const,
  },

  dashboard: {
    all: ['dashboard'] as const,
    summary: () => [...qk.dashboard.all, 'summary'] as const,
  },

  me: {
    all: ['me'] as const,
    profile: () => [...qk.me.all, 'profile'] as const,
  },

  legal: {
    all: ['legal'] as const,
    doc: (kind: 'privacy' | 'terms') => [...qk.legal.all, kind] as const,
  },
}
