import SignInBase from '@/components/auth/SignIn'
import Side from '@/components/layouts/AuthLayout/Side'

const SignInDemoSide = () => {
    return (
        <Side>
            <SignInBase
                disableSubmit={true}
                signUpUrl="/auth/sign-up-side"
                forgetPasswordUrl="/auth/forgot-password-side"
            />
        </Side>
    )
}

export default SignInDemoSide
