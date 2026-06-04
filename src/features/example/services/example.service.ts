import { apiDelete, apiGet, apiPost } from '@/lib/api'
import type { CreateExampleDto, Example, ListExamplesDto } from './example.dto'

/**
 * Plain service object. Functions return ApiResponse<R> — they never throw.
 * Unwrapping happens in the query hooks (use-example-query.ts).
 */
export const ExampleService = {
  list: (params?: ListExamplesDto) => apiGet<ListExamplesDto, Example[]>('/examples', params),
  get: (id: string) => apiGet<void, Example>(`/examples/${id}`),
  create: (data: CreateExampleDto) => apiPost<CreateExampleDto, Example>('/examples', data),
  remove: (id: string) => apiDelete<void, void>(`/examples/${id}`),
}
