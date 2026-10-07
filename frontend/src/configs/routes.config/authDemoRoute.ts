import { lazy } from 'react'
import { AUTH_PREFIX_PATH } from '@/constants/route.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const authDemoRoute: Routes = [
    {
        key: 'authentication.signInSide',
        path: `${AUTH_PREFIX_PATH}/sign-in-side`,
        component: lazy(() => import('@/views/auth-demo/SignInDemoSide')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.signInSimple',
        path: `${AUTH_PREFIX_PATH}/sign-in-simple`,
        component: lazy(() => import('@/views/auth-demo/SignInDemoSimple')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.signInCentred',
        path: `${AUTH_PREFIX_PATH}/sign-in-centred`,
        component: lazy(() => import('@/views/auth-demo/SignInDemoCentred')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.signUpSimple',
        path: `${AUTH_PREFIX_PATH}/sign-up-simple`,
        component: lazy(() => import('@/views/auth-demo/SignUpDemoSimple')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.signUpSide',
        path: `${AUTH_PREFIX_PATH}/sign-up-side`,
        component: lazy(() => import('@/views/auth-demo/SignUpDemoSide')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.signUpCentred',
        path: `${AUTH_PREFIX_PATH}/sign-up-centred`,
        component: lazy(() => import('@/views/auth-demo/SignUpDemoCentred')),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.resetPasswordSimple',
        path: `${AUTH_PREFIX_PATH}/reset-password-simple`,
        component: lazy(
            () => import('@/views/auth-demo/ResetPasswordDemoSimple'),
        ),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.resetPasswordSide',
        path: `${AUTH_PREFIX_PATH}/reset-password-side`,
        component: lazy(
            () => import('@/views/auth-demo/ResetPasswordDemoSide'),
        ),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.resetPasswordCentred',
        path: `${AUTH_PREFIX_PATH}/reset-password-centred`,
        component: lazy(
            () => import('@/views/auth-demo/ResetPasswordDemoCentred'),
        ),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.forgotPasswordSimple',
        path: `${AUTH_PREFIX_PATH}/forgot-password-simple`,
        component: lazy(
            () => import('@/views/auth-demo/ForgotPasswordDemoSimple'),
        ),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.forgotPasswordSide',
        path: `${AUTH_PREFIX_PATH}/forgot-password-side`,
        component: lazy(
            () => import('@/views/auth-demo/ForgotPasswordDemoSide'),
        ),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.forgotPasswordCentred',
        path: `${AUTH_PREFIX_PATH}/forgot-password-centred`,
        component: lazy(
            () => import('@/views/auth-demo/ForgotPasswordDemoCentred'),
        ),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.otpVerificationCentred',
        path: `${AUTH_PREFIX_PATH}/otp-verification-centred`,
        component: lazy(
            () => import('@/views/auth-demo/OtpVerificationDemoCentred'),
        ),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.otpVerificationSide',
        path: `${AUTH_PREFIX_PATH}/otp-verification-side`,
        component: lazy(
            () => import('@/views/auth-demo/OtpVerificationDemoSide'),
        ),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'authentication.otpVerificationSimple',
        path: `${AUTH_PREFIX_PATH}/otp-verification-simple`,
        component: lazy(
            () => import('@/views/auth-demo/OtpVerificationDemoSimple'),
        ),
        authority: [ADMIN, USER],
        access: 'protected',
        meta: {
            layout: 'blank',
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
]

export default authDemoRoute
