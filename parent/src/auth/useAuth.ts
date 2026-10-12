import { useContext } from 'react'
import AuthContext from './AuthContext'
import type { Auth } from './AuthContext'
import type { AuthResult } from '@/@types/auth'

const defaultFunctionPlaceHolder = async (): AuthResult => {
    await new Promise((resolve) => setTimeout(resolve, 0))
    return {
        status: '',
        message: '',
    }
}

export const defaultAuthContext: Auth = {
    authenticated: true,
    user: {
        userId: null,
        avatar: null,
        userName: null,
        email: null,
        authority: [],
    },
    signIn: defaultFunctionPlaceHolder,
    signOut: () => {},
}

const useAuth = (): Auth => {
    const context = useContext(AuthContext)

    if (!context) {
        return defaultAuthContext
    }

    return context
}

export default useAuth
