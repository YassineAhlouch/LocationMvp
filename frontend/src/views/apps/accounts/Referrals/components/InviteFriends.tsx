import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '@/components/ui/Input'
import InputGrup from '@/components/ui/InputGroup'
import Button from '@/components/ui/Button'
import { Form, FormItem } from '@/components/ui/Form'
import { LiUserAdd, LiMail } from '@/icons'
import { useReferralData } from '../hooks/useReferralData'

const inviteSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
})

type InviteFormData = z.infer<typeof inviteSchema>

const InviteFriends = () => {
    const { sendInvitation } = useReferralData()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<InviteFormData>({
        defaultValues: {
            email: '',
        },
        resolver: zodResolver(inviteSchema),
    })

    const handleInviteSubmit = async (data: InviteFormData) => {
        try {
            await sendInvitation(data.email)
            reset()
        } catch (error) {
            console.error('Failed to send invitation:', error)
        }
    }

    return (
        <div className="space-y-6 px-4">
            <div>
                <h5 className="mb-1 flex items-center gap-2">
                    <LiUserAdd className="text-lg" />
                    Invite Friends
                </h5>
                <p>
                    Your friend will receive an email with your referral link
                    and information about Eyris.
                </p>
            </div>

            <Form onSubmit={handleSubmit(handleInviteSubmit)}>
                <InputGrup className="space-y-4">
                    <FormItem
                        invalid={Boolean(errors.email)}
                        errorMessage={errors.email?.message}
                        className="mb-0 w-full"
                    >
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="email"
                                    placeholder="Enter your friend's email"
                                    prefix={<LiMail className="text-lg" />}
                                    disabled={isSubmitting}
                                />
                            )}
                        />
                    </FormItem>

                    <Button
                        type="submit"
                        loading={isSubmitting}
                        icon={<LiMail className="text-base" />}
                    >
                        {isSubmitting
                            ? 'Sending Invitation...'
                            : 'Send Invitation'}
                    </Button>
                </InputGrup>
            </Form>
        </div>
    )
}

export default InviteFriends
