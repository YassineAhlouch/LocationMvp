import ForgotPasswordBase from '@/components/auth/ForgotPassword'
import Logo from '@/components/template/Logo'
import { useThemeStore } from '@/store/themeStore'
import Simple from '@/components/layouts/AuthLayout/Simple'

const ForgotPasswordDemoSimple = () => {
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
                <ForgotPasswordBase signInUrl="/auth/sign-in-side" />
            </>
        </Simple>
    )
}

export default ForgotPasswordDemoSimple
