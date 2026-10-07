import SignInBase from '@/components/auth/SignIn'
import Centred from '@/components/layouts/AuthLayout/Centred'

const SignInDemoCentred = () => {
    return (
        <Centred>
            <SignInBase
                disableSubmit={true}
                signUpUrl="/auth/sign-up-centred"
                forgetPasswordUrl="/auth/forgot-password-centred"
            />
        </Centred>
    )
}

export default SignInDemoCentred
