import { MutationCache, QueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { getApiErrorMessage } from './api'
import { showToast } from '@/providers/toast/toast-provider'

export const queryClient = new QueryClient({
  // Fallback toast ONLY for mutations that don't define their own onError —
  // otherwise a mutation with a specific message would show two toasts.
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.options.onError) return
      showToast({ message: getApiErrorMessage(error), type: 'error' })
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      // Don't retry forever on auth/not-found — stale data shouldn't hammer the API.
      retry: (failureCount, error) => {
        const status = (error as AxiosError)?.response?.status
        if (status === 401 || status === 403 || status === 404) return false
        return failureCount < 2
      },
    },
    mutations: {
      retry: false,
    },
  },
})
