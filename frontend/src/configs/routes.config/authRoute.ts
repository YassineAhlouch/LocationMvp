import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const authRoute: Routes = [
    {
        key: 'signIn',
        path: `/sign-in`,
        component: lazy(() => import('@/views/auth/SignIn')),
        access: 'auth-only',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'signUp',
        path: `/sign-up`,
        component: lazy(() => import('@/views/auth/SignUp')),
        access: 'auth-only',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'forgotPassword',
        path: `/forgot-password`,
        component: lazy(() => import('@/views/auth/ForgotPassword')),
        access: 'auth-only',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'resetPassword',
        path: `/reset-password`,
        component: lazy(() => import('@/views/auth/ResetPassword')),
        access: 'auth-only',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'otpVerification',
        path: `/otp-verification`,
        component: lazy(() => import('@/views/auth/OtpVerification')),
        access: 'auth-only',
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
]

export default authRoute
