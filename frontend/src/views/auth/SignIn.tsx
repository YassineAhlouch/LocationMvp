import SignInBase from '@/components/auth/SignIn'
import Logo from '@/components/template/Logo'
import { useThemeStore } from '@/store/themeStore'

const SignIn = () => {
    const mode = useThemeStore((state) => state.mode)

    return (
        <>
            <div className="mb-8">
                <Logo type="streamline" logoWidth={50} mode={mode} />
            </div>
            <SignInBase
                signUpUrl="/sign-up"
                forgetPasswordUrl="/forgot-password"
            />
        </>
    )
}

export default SignIn
