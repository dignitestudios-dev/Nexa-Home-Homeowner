import { initializeApp, getApps } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { getMessaging, getToken, isSupported } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
}

const app =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApps()[0]

export const auth = getAuth(app)

auth.useDeviceLanguage()

// ====================
// Google Provider
// ====================

const googleProvider = new GoogleAuthProvider()

googleProvider.addScope('email')
googleProvider.addScope('profile')
googleProvider.setCustomParameters({
  prompt: 'select_account',
})

export async function signInWithGoogle(): Promise<string> {
  const result = await signInWithPopup(auth, googleProvider)

  const idToken = await result.user.getIdToken()

  return idToken
}

// ====================
// Apple Provider
// ====================

const appleProvider = new OAuthProvider('apple.com')

appleProvider.addScope('email')
appleProvider.addScope('name')

export async function signInWithApple(): Promise<string> {
  const result = await signInWithPopup(auth, appleProvider)

  const idToken = await result.user.getIdToken()

  return idToken
}

// ====================
// Firebase Messaging
// ====================

export async function getFirebaseMessaging() {
  const supported = await isSupported()

  if (!supported) return null

  return getMessaging(app)
}

export async function getFcmToken(): Promise<string | null> {
  try {
    const supported = await isSupported()

    if (!supported) return null

    const permission = await Notification.requestPermission()

    if (permission !== 'granted') return null

    const messaging = getMessaging(app)

    const registration = await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js'
    )

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
      serviceWorkerRegistration: registration,
    })

    return token ?? null
  } catch (error) {
    console.error('FCM Error:', error)
    return null
  }
}