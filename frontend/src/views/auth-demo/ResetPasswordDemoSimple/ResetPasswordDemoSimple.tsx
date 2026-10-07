import ResetPasswordBase from '@/components/auth/ResetPassword'
import Logo from '@/components/template/Logo'
import { useThemeStore } from '@/store/themeStore'
import Simple from '@/components/layouts/AuthLayout/Simple'

const ResetPasswordDemoSimple = () => {
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
                <ResetPasswordBase signInUrl="/auth/sign-in-simple" />
            </>
        </Simple>
    )
}

export default ResetPasswordDemoSimple
