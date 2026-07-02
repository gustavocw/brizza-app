// HTTP layer. Every request returns a discriminated union instead of throwing,
// so services never need try/catch and callers branch on `res.success`.
//
//   const res = await apiGet<void, User>('/me')
//   if (res.success) use(res.data) else handle(res.error)
//
// When wiring into TanStack Query, unwrap inside queryFn (throw res.error) so
// Query's error state works — see references/data-layer.md.

import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ENV } from '@/shared/constants/env'

export type ApiSuccess<R> = { success: true; data: R }
export type ApiFail = { success: false; error: AxiosError }
export type ApiResponse<R> = ApiSuccess<R> | ApiFail

export const TOKEN_KEY = 'access_token'
export const REFRESH_TOKEN_KEY = 'refresh_token'

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

// ── Single-flight access-token refresh ───────────────────────────────────────
// The backend ROTATES the refresh token on every /auth/refresh and revokes the
// whole chain if one is reused, so refresh must be one-at-a-time: concurrent 401s
// all await the SAME in-flight refresh instead of each spending the token.
let refreshing: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  refreshing ??= (async () => {
    try {
      const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY)
      if (!refreshToken) return null
      // Bare axios (no interceptors) so a 401 here never recurses into a refresh.
      const res = await axios.post<{ access_token: string; refresh_token: string }>(
        `${ENV.apiUrl}/auth/refresh`,
        { refresh_token: refreshToken },
        { timeout: 30_000 },
      )
      await AsyncStorage.multiSet([
        [TOKEN_KEY, res.data.access_token],
        [REFRESH_TOKEN_KEY, res.data.refresh_token],
      ])
      return res.data.access_token
    } catch {
      return null
    } finally {
      refreshing = null
    }
  })()
  return refreshing
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined
    // A 401 on /auth/* is a credential/token result for the caller (e.g. wrong
    // password), not an expired session — never refresh or trip the bridge there.
    const isAuthCall = original?.url?.includes('/auth/') ?? false

    if (error.response?.status === 401 && !isAuthCall && original && !original._retry) {
      original._retry = true
      const token = await refreshAccessToken()
      if (token) return api(original) // the request interceptor re-attaches the fresh token
      // No/expired/revoked refresh token → the session is really gone.
      await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY])
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

/** Error payload the Brizze API renders: { code, message, details?, request_id? }. */
type ApiErrorBody = {
  code?: string
  message?: string | string[]
  error?: string
  details?: { field?: string; message?: string }[]
  request_id?: string
}

/** Machine-readable error code from an API error (e.g. "INVALID_CREDENTIALS"), if any. */
export function getApiErrorCode(error: unknown): string | undefined {
  const data = (error as AxiosError<ApiErrorBody>)?.response?.data
  return typeof data === 'object' && data ? data.code : undefined
}

/** Best-effort human message from an API/Axios error (the API sends pt-BR messages). */
export function getApiErrorMessage(error: unknown, fallback = 'Algo deu errado. Tente novamente.'): string {
  const axiosError = error as AxiosError<ApiErrorBody>
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
