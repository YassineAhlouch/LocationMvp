import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import { usePricingStore } from '../store/pricingStore'
import { featuresList } from '../constants'
import classNames from '@/utils/classNames'
import ImposibleCube from '@/components/svg/icons/ImposibleCube'
import ImposibleSphere from '@/components/svg/icons/ImposibleSphere'
import ImposibleTriangle from '@/components/svg/icons/ImposibleTriangle'
import { useLocation } from 'react-router'
import { NumericFormat } from 'react-number-format'
import { TbCheck } from 'react-icons/tb'
import type { Plan } from '../types'

const PlanIcon = ({ planid }: { planid: string }) => {
    const entity = (() => {
        switch (planid) {
            case 'basic':
                return {
                    icon: <ImposibleSphere pathClass="stroke-16" />,
                    className: 'bg-primary',
                }
            case 'standard':
                return {
                    icon: <ImposibleTriangle pathClass="stroke-16" />,
                    className: 'bg-yellow-500',
                }
            case 'pro':
                return {
                    icon: <ImposibleCube pathClass="stroke-16" />,
                    className: 'bg-purple-500',
                }
            default:
                return
        }
    })()

    if (!entity) {
        return null
    }

    return (
        <div
            className={classNames(
                'flex items-center justify-center text-white h-10 w-10 p-1.5 rounded-lg',
                entity.className,
            )}
        >
            {entity.icon}
        </div>
    )
}

const Plans = ({ data }: { data?: Plan[] }) => {
    const { paymentCycle, setPaymentDialog, setSelectedPlan } =
        usePricingStore()

    const { search } = useLocation()
    const query = new URLSearchParams(search)
    const subcription = query.get('subcription')
    const cycle = query.get('cycle')

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-4">
            {data &&
                data?.map((plan) => (
                    <div
                        key={plan.id}
                        className="border border-gray-200 dark:border-gray-800 p-1 rounded-lg bg-gray-100 dark:bg-gray-800"
                    >
                        <div
                            className={classNames(
                                'p-4 flex flex-col justify-between rounded-lg border border-gray-200 dark:border-gray-700 h-full bg-white dark:bg-gray-900',
                            )}
                        >
                            <div>
                                <PlanIcon planid={plan.id} />
                                <h5 className="my-2 flex items-center gap-2">
                                    <span>{plan.name}</span>
                                    {plan.recommended && (
                                        <Tag className="border-0 rounded-full bg-green-200 font-semibold">
                                            ✦ Most Popular
                                        </Tag>
                                    )}
                                </h5>
                                <div className="mt-6">
                                    <NumericFormat
                                        className="h2"
                                        displayType="text"
                                        value={plan.price[paymentCycle]}
                                        prefix={'$'}
                                        thousandSeparator={true}
                                    />
                                    <span className="text-lg font-medium">
                                        {' '}
                                        /{' '}
                                        {paymentCycle === 'monthly'
                                            ? 'month'
                                            : 'year'}
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <Button
                                        block
                                        disabled={
                                            subcription === plan.id &&
                                            cycle === paymentCycle
                                        }
                                        onClick={() => {
                                            setSelectedPlan({
                                                paymentCycle,
                                                planName: plan.name,
                                                price: plan.price,
                                            })
                                            setPaymentDialog(true)
                                        }}
                                    >
                                        {subcription === plan.id &&
                                        cycle === paymentCycle
                                            ? 'Current plan'
                                            : 'Select plan'}
                                    </Button>
                                </div>
                                <div className="flex flex-col gap-4 py-4">
                                    {featuresList.map((feature) => (
                                        <div
                                            key={feature.id}
                                            className="flex items-center gap-4 font-medium heading-text"
                                        >
                                            {plan.features.includes(
                                                feature.id,
                                            ) && (
                                                <>
                                                    <div
                                                        className={classNames(
                                                            'flex items-center p-1 rounded-md',
                                                            plan.features.includes(
                                                                feature.id,
                                                            )
                                                                ? 'bg-gray-100 dark:bg-gray-800'
                                                                : 'bg-primary-subtle',
                                                        )}
                                                    >
                                                        <TbCheck
                                                            className={classNames(
                                                                'text-gl',
                                                                plan.features.includes(
                                                                    feature.id,
                                                                )
                                                                    ? 'text-gray-500 dark:text-gray-400'
                                                                    : 'text-primary',
                                                            )}
                                                        />
                                                    </div>
                                                    <span>
                                                        {
                                                            feature.description[
                                                                plan.id as string
                                                            ]
                                                        }
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    )
}

export default Plans
