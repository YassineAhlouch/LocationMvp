import ForgotPasswordBase from '@/components/auth/ForgotPassword'
import Centred from '@/components/layouts/AuthLayout/Centred'

const ForgotPasswordDemoCentred = () => {
    return (
        <Centred>
            <ForgotPasswordBase signInUrl="/auth/sign-in-centred" />
        </Centred>
    )
}

export default ForgotPasswordDemoCentred
