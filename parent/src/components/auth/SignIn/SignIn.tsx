import Alert from '@/components/ui/Alert'
import SignInForm from './components/SignInForm'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'

type SignInBaseProps = {
    disableSubmit?: boolean
}

const SignInBase = ({ disableSubmit }: SignInBaseProps) => {
    const [message, setMessage] = useTimeOutMessage()

    return (
        <>
            <div className="mb-10">
                <h3 className="mb-2">Welcome back!</h3>
                <p className="heading-text">
                    Sign in to manage agencies and the shared catalog.
                </p>
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            <SignInForm disableSubmit={disableSubmit} setMessage={setMessage} />
        </>
    )
}

export default SignInBase
