import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Checkbox from '@/components/ui/Checkbox'
import Radio from '@/components/ui/Radio'
import Button from '@/components/ui/Button'
import FormFieldWrapper from './FormFieldWrapper'
import { apiGetAccountNotificationSettings } from '@/services/AccountService'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useSWR from 'swr'
import sleep from '@/utils/sleep'
import type { GetSettingsNotificationConfigResponse } from '../types'

const validationSchema = z.object({
    notificationsFromUs: z.object({
        newsAndUpdates: z.boolean(),
        tipsAndTutorials: z.boolean(),
        userResearch: z.boolean(),
    }),
    comments: z.enum(['none', 'mentions', 'all']),
    reminders: z.enum(['none', 'important', 'all']),
    moreActivityAboutYou: z.boolean(),
    marketingNotifications: z.object({
        specialOffers: z.boolean(),
        eventInvitations: z.boolean(),
        partnerPromotions: z.boolean(),
    }),
})

type FormSchema = z.infer<typeof validationSchema>

// Static data for notification settings
const NOTIFICATION_DATA = {
    header: {
        title: 'Email notifications',
        description:
            "Stay informed with email updates about what's happening while you're away. You have full control to disable them whenever you want.",
    },
    sections: [
        {
            type: 'checkbox' as const,
            fieldName: 'notificationsFromUs',
            label: 'Updates from our team',
            description:
                'Stay up-to-date with the latest announcements and helpful resources from our team.',
            options: [
                {
                    key: 'newsAndUpdates',
                    title: 'Product announcements',
                    description:
                        'Be the first to know about new features and product improvements.',
                },
                {
                    key: 'tipsAndTutorials',
                    title: 'Learning resources',
                    description:
                        'Discover helpful tips and tutorials to maximize your experience with our platform.',
                },
                {
                    key: 'userResearch',
                    title: 'Research opportunities',
                    description:
                        'Join our beta testing programs and contribute to product development through paid research studies.',
                },
            ],
        },
        {
            type: 'radio' as const,
            fieldName: 'comments',
            label: 'Comment notifications',
            description:
                'Choose how you want to be notified about comments on your posts & replies.',
            options: [
                {
                    value: 'none',
                    title: 'No notifications',
                },
                {
                    value: 'mentions',
                    title: 'Only when mentioned',
                    description:
                        'Receive notifications only when someone specifically mentions you in a comment.',
                },
                {
                    value: 'all',
                    title: 'All comment activity',
                    description:
                        'Get notified about every comment and reply on your posts.',
                },
            ],
        },
        {
            type: 'radio' as const,
            fieldName: 'reminders',
            label: 'Reminder notifications',
            description:
                'Set your preference for reminder notifications to help you stay on top of important updates.',
            options: [
                {
                    value: 'none',
                    title: 'No reminders',
                },
                {
                    value: 'important',
                    title: 'Priority reminders only',
                    description:
                        'Receive notifications only for reminders marked as high priority or urgent.',
                },
                {
                    value: 'all',
                    title: 'All reminder notifications',
                    description:
                        'Stay informed with notifications for all reminders and follow-ups.',
                },
            ],
        },
        {
            type: 'radio' as const,
            fieldName: 'moreActivityAboutYou',
            label: 'Profile activity alerts',
            description:
                'Control notifications for activity related to your profile, including likes, reactions, and other interactions with your content.',
            isBoolean: true,
            options: [
                {
                    value: 'none',
                    title: 'Disable activity alerts',
                },
                {
                    value: 'all',
                    title: 'Enable activity alerts',
                    description:
                        'Get notified about likes, reactions, and other interactions with your profile and content.',
                },
            ],
        },
        {
            type: 'checkbox' as const,
            fieldName: 'marketingNotifications',
            label: 'Marketing & promotions',
            description:
                'Choose what promotional content and marketing communications you want to receive.',
            options: [
                {
                    key: 'specialOffers',
                    title: 'Special offers & discounts',
                    description:
                        'Get notified about exclusive deals, promotions, and limited-time offers.',
                },
                {
                    key: 'eventInvitations',
                    title: 'Events & webinars',
                    description:
                        'Receive invitations to webinars, workshops, and other educational events.',
                },
                {
                    key: 'partnerPromotions',
                    title: 'Partner recommendations',
                    description:
                        'Learn about recommended tools, integrations, and partner services that might interest you.',
                },
            ],
        },
    ],
}

const Notification = () => {
    const { data } = useSWR(
        '/api/account/notification-settings',
        () =>
            apiGetAccountNotificationSettings<GetSettingsNotificationConfigResponse>(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<FormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            notificationsFromUs: {
                newsAndUpdates: true,
                tipsAndTutorials: true,
                userResearch: false,
            },
            comments: 'all',
            reminders: 'all',
            moreActivityAboutYou: false,
            marketingNotifications: {
                specialOffers: false,
                eventInvitations: false,
                partnerPromotions: false,
            },
        },
    })

    useEffect(() => {
        if (data) {
            reset(data)
        }
    }, [data, reset])

    const handleFormSubmit = async (values: FormSchema) => {
        await sleep(1000)
        console.log('Notification settings updated:', values)
    }

    const renderCheckboxSection = (
        section: (typeof NOTIFICATION_DATA.sections)[0],
        isLast: boolean,
    ) => {
        if (section.type !== 'checkbox') return null

        return (
            <FormFieldWrapper
                key={section.fieldName}
                label={section.label}
                description={section.description}
                labelClass="max-w-[350px]"
                border={!isLast}
            >
                <div className="space-y-4">
                    {section.options.map((option) => (
                        <Controller
                            key={option.key}
                            name={
                                `${section.fieldName}.${option.key}` as keyof FormSchema
                            }
                            control={control}
                            render={({ field }) => (
                                <div>
                                    <Checkbox
                                        checked={field.value as boolean}
                                        onChange={field.onChange}
                                        className="items-start"
                                    >
                                        <div className="-mt-0.25">
                                            <div className="font-medium heading-text">
                                                {option.title}
                                            </div>
                                            {option.description && (
                                                <div className="font-normal">
                                                    {option.description}
                                                </div>
                                            )}
                                        </div>
                                    </Checkbox>
                                </div>
                            )}
                        />
                    ))}
                </div>
            </FormFieldWrapper>
        )
    }

    const renderRadioSection = (
        section: (typeof NOTIFICATION_DATA.sections)[1],
        isLast: boolean,
    ) => {
        if (section.type !== 'radio') return null

        return (
            <FormFieldWrapper
                key={section.fieldName}
                label={section.label}
                description={section.description}
                labelClass="max-w-[350px]"
                border={!isLast}
            >
                <Controller
                    name={section.fieldName as keyof FormSchema}
                    control={control}
                    render={({ field }) => (
                        <Radio.Group
                            vertical
                            value={
                                section.isBoolean
                                    ? field.value
                                        ? 'all'
                                        : 'none'
                                    : field.value
                            }
                            onChange={(value) => {
                                if (section.isBoolean) {
                                    field.onChange(value === 'all')
                                } else {
                                    field.onChange(value)
                                }
                            }}
                        >
                            {section.options.map((option) => (
                                <Radio
                                    key={option.value}
                                    value={option.value}
                                    className="items-start"
                                >
                                    <div className="-mt-0.5">
                                        <div className="font-medium heading-text">
                                            {option.title}
                                        </div>
                                        {option.description && (
                                            <div className="font-normal">
                                                {option.description}
                                            </div>
                                        )}
                                    </div>
                                </Radio>
                            ))}
                        </Radio.Group>
                    )}
                />
            </FormFieldWrapper>
        )
    }

    return (
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="space-y-4">
                <div className="py-4">
                    <div className="mb-4">
                        <h5>{NOTIFICATION_DATA.header.title}</h5>
                        <p>{NOTIFICATION_DATA.header.description}</p>
                    </div>
                    <div>
                        {NOTIFICATION_DATA.sections.map((section, index) => {
                            const isLast =
                                index === NOTIFICATION_DATA.sections.length - 1

                            if (section.type === 'checkbox') {
                                return renderCheckboxSection(section, isLast)
                            } else {
                                return renderRadioSection(section, isLast)
                            }
                        })}
                    </div>
                </div>
                <div className="py-4 flex items-center justify-end gap-2">
                    <Button type="reset" onClick={() => reset()}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="solid"
                        loading={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </div>
        </Form>
    )
}

export default Notification
