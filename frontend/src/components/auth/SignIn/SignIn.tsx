import Alert from '@/components/ui/Alert'
import SignInForm from './components/SignInForm'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'

type SignInBaseProps = {
    signUpUrl?: string
    forgetPasswordUrl?: string
    disableSubmit?: boolean
}

const SignInBase = ({
    signUpUrl = '/sign-up',
    forgetPasswordUrl = '/forgot-password',
    disableSubmit,
}: SignInBaseProps) => {
    const [message, setMessage] = useTimeOutMessage()

    return (
        <>
            <div className="mb-10">
                <h3 className="mb-2">Welcome back!</h3>
                <p className="heading-text">
                    Please enter your credentials to sign in!
                </p>
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            <SignInForm
                disableSubmit={disableSubmit}
                setMessage={setMessage}
                passwordHint={
                    <div className="mb-7 mt-2">
                        <ActionLink
                            to={forgetPasswordUrl}
                            className="font-medium heading-text mt-2 underline"
                            themeColor={false}
                        >
                            Forgot password
                        </ActionLink>
                    </div>
                }
            />
            <div className="mt-6 text-center">
                    <span>{`Don't have an account yet?`} </span>
                    <ActionLink
                        to={signUpUrl}
                        className="heading-text font-medium"
                        themeColor={false}
                    >
                        Sign up
                    </ActionLink>
                </div>
        </>
    )
}

export default SignInBase
