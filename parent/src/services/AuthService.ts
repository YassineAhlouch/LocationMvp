import ApiService from './ApiService'
import endpointConfig from '@/configs/endpoint.config'
import type { SignInCredential, SignInResponse } from '@/@types/auth'

/**
 * Platform dashboard authentication. Talks to the dedicated /v1/platform
 * area, which issues a wildcard token for a PlatformAdmin.
 */
export async function apiSignIn(data: SignInCredential) {
    return ApiService.fetchDataWithAxios<SignInResponse>({
        url: endpointConfig.signIn,
        method: 'post',
        data,
    })
}

export async function apiSignOut() {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.signOut,
        method: 'post',
    })
}
