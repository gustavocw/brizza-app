import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import { ENV } from '@/shared/constants/env'

// Configured once, lazily, so importing this module never touches the native
// layer at app boot (and stays safe under tests). webClientId is the audience the
// backend checks; iosClientId is required by the native flow on iOS.
let configured = false
function ensureConfigured() {
  if (configured) return
  GoogleSignin.configure({
    webClientId: ENV.googleWebClientId,
    iosClientId: ENV.googleIosClientId || undefined,
  })
  configured = true
}

/**
 * Runs the native Google Sign-In and returns the Google `idToken` to POST to
 * `/auth/google`. Returns null when the user cancels. Throws with a readable
 * message for known native failures (Play Services missing).
 */
export async function googleSignInIdToken(): Promise<string | null> {
  ensureConfigured()
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
    const response = await GoogleSignin.signIn()
    if (!isSuccessResponse(response)) return null // user dismissed the sheet
    return response.data.idToken ?? null
  } catch (err) {
    if (isErrorWithCode(err)) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED || err.code === statusCodes.IN_PROGRESS) return null
      if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error('Google Play Services indisponível neste aparelho.')
      }
    }
    throw err
  }
}
