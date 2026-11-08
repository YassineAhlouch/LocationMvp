import SignInBase from '@/components/auth/SignIn'
import Logo from '@/components/template/Logo'
import { useThemeStore } from '@/store/themeStore'

const SignIn = () => {
    const mode = useThemeStore((state) => state.mode)

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
            <div className="w-full max-w-lg">
                <div className="mb-8 flex justify-center">
                    <Logo type="streamline" logoWidth={50} mode={mode} />
                </div>
                <SignInBase
                    signUpUrl="/sign-up"
                    forgetPasswordUrl="/forgot-password"
                />
            </div>
        </div>
    )
}

export default SignIn
