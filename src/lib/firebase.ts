import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDEuT-YrRoiTouezxyGHgZMMCcU5s4nTLU",
  authDomain: "nexahome-5d42f.firebaseapp.com",
  projectId: "nexahome-5d42f",
  storageBucket: "nexahome-5d42f.firebasestorage.app",
  messagingSenderId: "707682138709",
  appId: "1:707682138709:web:a2691aa6f20948abd5b2dc",
  measurementId: "G-YY2H2YG5TD"
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const auth = getAuth(app)
auth.useDeviceLanguage()

const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('email')
googleProvider.addScope('profile')
googleProvider.setCustomParameters({ prompt: 'select_account' })

export async function signInWithGoogle(): Promise<string> {
  const result = await signInWithPopup(auth, googleProvider)
  const idToken = await result.user.getIdToken()
  return idToken
}
