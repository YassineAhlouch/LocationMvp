import { useState } from 'react'
import MultiValueInput from '@/components/ui/MultiValueInput'

const WithValidation = () => {
    const [error, setError] = useState<string>('')

    const validateEmail = (tag: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const isValid = emailRegex.test(tag)
        if (!isValid) {
            setError('Please enter a valid email address')
            setTimeout(() => setError(''), 2000)
        }
        return isValid
    }

    return (
        <div className="max-w-md mx-auto">
            <MultiValueInput
                placeholder="Enter email addresses..."
                validate={validateEmail}
                defaultValue={['user@example.com']}
            />
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
    )
}

export default WithValidation
