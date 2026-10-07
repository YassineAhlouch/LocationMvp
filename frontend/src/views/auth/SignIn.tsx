import SignInBase from '@/components/auth/SignIn'

const SignIn = () => {
    return (
        <SignInBase
            signUpUrl="/auth/sign-up"
            forgetPasswordUrl="/auth/forgot-password"
        />
    )
}

export default SignIn
