import SignUpBase from '@/components/auth/SignUp'
import Centred from '@/components/layouts/AuthLayout/Centred'

const SignUpDemoCentred = () => {
    return (
        <Centred>
            <SignUpBase
                disableSubmit={true}
                signInUrl="/auth/sign-in-centred"
            />
        </Centred>
    )
}

export default SignUpDemoCentred
