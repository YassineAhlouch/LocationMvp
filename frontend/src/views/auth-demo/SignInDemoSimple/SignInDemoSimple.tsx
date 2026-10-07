import SignInBase from '@/components/auth/SignIn'
import Logo from '@/components/template/Logo'
import { useThemeStore } from '@/store/themeStore'
import Simple from '@/components/layouts/AuthLayout/Simple'

const SignInDemoSimple = () => {
    const mode = useThemeStore((state) => state.mode)

    return (
        <Simple>
            <>
                <div className="mb-8">
                    <Logo
                        type="streamline"
                        logoWidth={50}
                        mode={mode as 'light' | 'dark'}
                    />
                </div>
                <SignInBase
                    disableSubmit={true}
                    signUpUrl="/auth/sign-up-simple"
                    forgetPasswordUrl="/auth/forgot-password-simple"
                />
            </>
        </Simple>
    )
}

export default SignInDemoSimple
