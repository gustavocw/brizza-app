import { MutationCache, QueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { getApiErrorMessage } from './api'
import { showToast } from '@/providers/toast/toast-provider'

export const queryClient = new QueryClient({
  // Any mutation that doesn't handle its own onError surfaces a toast.
  mutationCache: new MutationCache({
    onError: (error) => showToast({ message: getApiErrorMessage(error), type: 'error' }),
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
