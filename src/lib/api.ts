// HTTP layer. Every request returns a discriminated union instead of throwing,
// so services never need try/catch and callers branch on `res.success`.
//
//   const res = await apiGet<void, User>('/me')
//   if (res.success) use(res.data) else handle(res.error)
//
// When wiring into TanStack Query, unwrap inside queryFn (throw res.error) so
// Query's error state works — see references/data-layer.md.

import axios, { AxiosError, type AxiosResponse } from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ENV } from '@/shared/constants/env'

export type ApiSuccess<R> = { success: true; data: R }
export type ApiFail = { success: false; error: AxiosError }
export type ApiResponse<R> = ApiSuccess<R> | ApiFail

export const TOKEN_KEY = 'access_token'

export const api = axios.create({
  baseURL: ENV.apiUrl,
  timeout: 60_000,
})

// ── Auth token injection ─────────────────────────────────────────────────────
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── 401 bridge ───────────────────────────────────────────────────────────────
// Decouples the HTTP layer from navigation/state. Register the handler once in
// app/_layout (logout + redirect). See references/data-layer.md.
type UnauthorizedHandler = () => void
let onUnauthorized: UnauthorizedHandler | null = null
export function setOnUnauthorized(handler: UnauthorizedHandler | null) {
  onUnauthorized = handler
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem(TOKEN_KEY)
      onUnauthorized?.()
    }
    return Promise.reject(error)
  },
)

// ── Verb helpers ─────────────────────────────────────────────────────────────
export async function apiGet<P, R>(path: string, params?: P): Promise<ApiResponse<R>> {
  try {
    const res: AxiosResponse<R> = await api.get(path, { params })
    return { success: true, data: res.data }
  } catch (error) {
    return { success: false, error: error as AxiosError }
  }
}

export async function apiPost<T, R>(path: string, body?: T): Promise<ApiResponse<R>> {
  try {
    const res: AxiosResponse<R> = await api.post(path, body)
    return { success: true, data: res.data }
  } catch (error) {
    return { success: false, error: error as AxiosError }
  }
}

export async function apiPut<T, R>(path: string, body?: T): Promise<ApiResponse<R>> {
  try {
    const res: AxiosResponse<R> = await api.put(path, body)
    return { success: true, data: res.data }
  } catch (error) {
    return { success: false, error: error as AxiosError }
  }
}

export async function apiPatch<T, R>(path: string, body?: T): Promise<ApiResponse<R>> {
  try {
    const res: AxiosResponse<R> = await api.patch(path, body)
    return { success: true, data: res.data }
  } catch (error) {
    return { success: false, error: error as AxiosError }
  }
}

export async function apiDelete<T, R>(path: string, body?: T): Promise<ApiResponse<R>> {
  try {
    const res: AxiosResponse<R> = await api.delete(path, { data: body })
    return { success: true, data: res.data }
  } catch (error) {
    return { success: false, error: error as AxiosError }
  }
}

/** Best-effort human message from an API/Axios error (NestJS-style payloads supported). */
export function getApiErrorMessage(error: unknown, fallback = 'Algo deu errado. Tente novamente.'): string {
  const axiosError = error as AxiosError<{ message?: string | string[]; error?: string }>
  const data = axiosError?.response?.data
  if (data) {
    if (typeof data === 'string') return data
    if (Array.isArray(data.message)) return data.message.join('\n')
    if (typeof data.message === 'string') return data.message
    if (typeof data.error === 'string') return data.error
  }
  if (axiosError?.message) return axiosError.message
  return fallback
}

/**
 * Multipart upload. Uses fetch instead of axios: axios + FormData is flaky on
 * the New Architecture, while fetch builds the multipart boundary reliably.
 */
export async function apiUpload<R>(path: string, form: FormData): Promise<ApiResponse<R>> {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY)
    const res = await fetch(`${ENV.apiUrl}${path}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    })
    const data = (await res.json().catch(() => null)) as R
    if (!res.ok) {
      return {
        success: false,
        error: { message: `Upload failed (${res.status})`, response: { status: res.status, data } } as AxiosError,
      }
    }
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error as AxiosError }
  }
}
