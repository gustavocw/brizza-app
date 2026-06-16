import { apiPost } from '@/lib/api'

/**
 * Profile photo upload (Bunny.net presigned).
 *   POST /user/me/photo/upload-url → { upload_url, photo_id, cdn_url }
 *   PUT  <upload_url> (raw bytes)   → stores the file on Bunny (token carries the ids)
 *   POST /user/me/photo/confirm     → { photo_url } (no body: server reads the user)
 */
export const PhotoService = {
  uploadUrl: () =>
    apiPost<void, { upload_url: string; photo_id: string; cdn_url: string }>('/user/me/photo/upload-url'),
  confirm: () => apiPost<void, { photo_url: string }>('/user/me/photo/confirm'),
}
