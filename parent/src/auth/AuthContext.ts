import { createContext } from 'react'
import type { SignInCredential, AuthResult, User } from '@/@types/auth'

export type Auth = {
    authenticated: boolean
    user: User
    signIn: (values: SignInCredential) => AuthResult
    signOut: () => void
}

const AuthContext = createContext<Auth | null>(null)

export default AuthContext
