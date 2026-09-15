import Constants, { ExecutionEnvironment } from 'expo-constants'
import type * as GoogleSignInModule from '@react-native-google-signin/google-signin'
import { ENV } from '@/shared/constants/env'

// Expo Go ships without the RNGoogleSignin native module: a top-level import
// throws at boot and takes the whole sign-in route down with it. The module is
// required on demand, and only outside Expo Go.
export const isGoogleSignInAvailable =
  Constants.executionEnvironment !== ExecutionEnvironment.StoreClient

// Configured once, lazily, so importing this module never touches the native
// layer at app boot (and stays safe under tests). webClientId is the audience the
// backend checks; iosClientId is required by the native flow on iOS.
let googleSignIn: typeof GoogleSignInModule | null = null
function loadGoogleSignIn(): typeof GoogleSignInModule {
  if (!isGoogleSignInAvailable) {
    throw new Error('Login com Google não funciona no Expo Go. Entre com e-mail ou telefone e senha.')
  }
  if (!googleSignIn) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('@react-native-google-signin/google-signin') as typeof GoogleSignInModule
    mod.GoogleSignin.configure({
      webClientId: ENV.googleWebClientId,
      iosClientId: ENV.googleIosClientId || undefined,
    })
    googleSignIn = mod
  }
  return googleSignIn
}

/**
 * Runs the native Google Sign-In and returns the Google `idToken` to POST to
 * `/auth/google`. Returns null when the user cancels. Throws with a readable
 * message for known native failures (Play Services missing, Expo Go).
 */
export async function googleSignInIdToken(): Promise<string | null> {
  const { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes } = loadGoogleSignIn()
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
