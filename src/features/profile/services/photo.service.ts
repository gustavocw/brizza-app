import { apiPost } from '@/lib/api'

/**
 * Profile photo upload (Bunny.net presigned).
 *   POST /user/me/photo/upload-url → { upload_url, photo_id }
 *   PUT  <upload_url> (raw bytes)   → stores the file on Bunny
 *   POST /user/me/photo/confirm ({ photo_id }) → activates it
 */
export const PhotoService = {
  uploadUrl: () => apiPost<void, { upload_url: string; photo_id: string }>('/user/me/photo/upload-url'),
  confirm: (photoId: string) => apiPost<{ photo_id: string }, void>('/user/me/photo/confirm', { photo_id: photoId }),
}
