import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { qk } from '@/lib/query-keys'
import { extractList } from '@/shared/utils/api.utils'
import { ExampleService } from '../services/example.service'
import type { Example, ListExamplesDto } from '../services/example.dto'

// READ → useQuery. Unwrap the ApiResponse inside queryFn (throw on failure) so
// React Query's error/loading state works.
export function useExamplesQuery(params?: ListExamplesDto) {
  return useQuery({
    queryKey: qk.example.list(params),
    queryFn: async () => {
      const res = await ExampleService.list(params)
      if (!res.success) throw res.error
      return extractList<Example>(res.data)
    },
  })
}

// WRITE → useMutation. Invalidate the affected queries on success.
export function useCreateExample() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: { title: string }) => {
      const res = await ExampleService.create(data)
      if (!res.success) throw res.error
      return res.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.example.lists() }),
  })
}

export function useDeleteExample() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await ExampleService.remove(id)
      if (!res.success) throw res.error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.example.lists() }),
  })
}
