import ResetPasswordBase from '@/components/auth/ResetPassword'
import Centred from '@/components/layouts/AuthLayout/Centred'

const ResetPasswordDemoCentred = () => {
    return (
        <Centred>
            <ResetPasswordBase signInUrl="/auth/sign-in-centred" />
        </Centred>
    )
}

export default ResetPasswordDemoCentred
