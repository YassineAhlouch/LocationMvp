import { useContext } from 'react'
import AuthContext from './AuthContext'
import type { Auth } from './AuthContext'
import type { AuthResult, OauthSignInCallbackPayload } from '@/@types/auth'

const defaultFunctionPlaceHolder = async (): AuthResult => {
    await new Promise((resolve) => setTimeout(resolve, 0))
    return {
        status: '',
        message: '',
    }
}

const defaultOAuthSignInPlaceHolder = (
    callback: (payload: OauthSignInCallbackPayload) => void,
): void => {
    callback({
        onSignIn: () => {},
        redirect: () => {},
    })
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
    signUp: defaultFunctionPlaceHolder,
    signOut: () => {},
    oAuthSignIn: defaultOAuthSignInPlaceHolder,
}

const useAuth = (): Auth => {
    const context = useContext(AuthContext)

    if (!context) {
        return defaultAuthContext
    }

    return context
}

export default useAuth
