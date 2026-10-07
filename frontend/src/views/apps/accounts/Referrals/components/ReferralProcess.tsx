import Promo from '@/components/svg/icons/Promo'
import Click from '@/components/svg/icons/Click'
import MoneyBag from '@/components/svg/icons/MoneyBag'
import classNames from '@/utils/classNames'

const svgProps = {
    height: 40,
    width: 40,
}

const processSteps = [
    {
        id: 1,
        title: 'Invite Your Friends',
        description:
            'Share your unique referral link or code via social media, email, or direct message.',
        icon: (
            <Promo
                primaryColorClass="fill-gray-900 dark:fill-gray-100"
                secondaryColorClass="fill-gray-200 dark:fill-gray-700"
                {...svgProps}
            />
        ),
    },
    {
        id: 2,
        title: 'They Sign Up',
        description:
            'Your friends join Eyris through your link and start exploring our features.',
        icon: (
            <Click
                primaryColorClass="fill-gray-900 dark:fill-gray-100"
                secondaryColorClass="fill-gray-200 dark:fill-gray-700"
                {...svgProps}
            />
        ),
    },
    {
        id: 3,
        title: 'You Earn Rewards',
        description:
            'Receive cash, credits, or discounts for every successful referral.',
        icon: (
            <MoneyBag
                primaryColorClass="fill-gray-900 dark:fill-gray-100"
                secondaryColorClass="fill-gray-200 dark:fill-gray-700"
                {...svgProps}
            />
        ),
    },
]

const ReferralProcess = () => {
    return (
        <div className={classNames('my-12 max-w-[1000px] mx-auto')}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                {processSteps.map((step) => (
                    <div key={step.id} className="relative">
                        <div className="relative z-10 flex flex-col ">
                            <div>
                                <div className="relative inline-flex mb-4">
                                    <div className="flex items-center justify-center border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-lg w-16 h-16 mx-auto">
                                        {step.icon}
                                    </div>
                                </div>
                                <h3 className="h5 mb-2 heading-text">
                                    {step.title}
                                </h3>
                            </div>
                            <p className="max-w-xs">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ReferralProcess
