import { TbCheck, TbSparkles } from 'react-icons/tb'
import Button from '@/components/ui/Button'
import classNames from '@/utils/classNames'
import type { LandingPricing } from '../types'

const PricingCard = ({
    plan,
    index,
    features,
}: {
    plan: LandingPricing['plans'][number]
    index: number
    features: string[]
}) => (
    <div
        className={classNames(
            'flex h-full flex-col rounded-2xl border p-6 transition-colors',
            plan.highlighted
                ? 'border-primary bg-primary-subtle'
                : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900',
        )}
    >
        <div className="flex items-start justify-between gap-3">
            <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {`0${index + 1}`}
                </p>
                <h5 className="mt-1">{plan.name}</h5>
            </div>
            {plan.badge ? (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-white">
                    <TbSparkles size={13} />
                    {plan.badge}
                </span>
            ) : null}
        </div>

        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            {plan.description}
        </p>

        <div className="mt-6">
            <span className="text-sm text-gray-500 line-through dark:text-gray-400">
                {plan.originalPrice} MAD
            </span>
            <div className="mt-1 flex flex-wrap items-end gap-x-2 gap-y-1">
                <span className="text-3xl font-semibold heading-text">
                    {plan.price} MAD
                </span>
                <span className="pb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                    {plan.period}
                </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                    {plan.saving}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-300">
                    {plan.note}
                </span>
            </div>
        </div>

        <div className="mt-6">
            <Button
                asElement="a"
                href="#cta"
                block
                variant={plan.highlighted ? 'solid' : 'subtle'}
            >
                {plan.ctaLabel}
            </Button>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
            {features.map((feature, featureIndex) => (
                <div
                    key={`${plan.id}-${featureIndex}`}
                    className="flex items-start gap-3 text-sm"
                >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                        <TbCheck size={14} />
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">
                        {feature}
                    </span>
                </div>
            ))}
        </div>
    </div>
)

const Pricing = ({ content }: { content: LandingPricing }) => (
    <section
        id="pricing"
        className="border-t border-gray-200 dark:border-gray-700"
    >
        <div className="max-w-7xl mx-auto border-r border-l border-gray-200 dark:border-gray-700">
            <div className="px-4 lg:px-0 py-12 lg:py-24">
                <div className="grid grid-cols-12">
                    <div className="col-span-1" />
                    <div className="col-span-10">
                        <div className="flex flex-col items-center text-center">
                            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
                                <TbSparkles size={14} className="text-primary" />
                                {content.promo}
                            </span>
                            <h3 className="mt-5 max-w-2xl leading-snug">
                                {content.heading}
                            </h3>
                            <p className="mt-3 max-w-2xl text-gray-500 dark:text-gray-400 font-medium">
                                {content.subheading}
                            </p>
                        </div>
                    </div>
                    <div className="col-span-1" />
                </div>

                <div className="grid grid-cols-12 mt-12">
                    <div className="col-span-1" />
                    <div className="col-span-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {content.plans.map((plan, index) => (
                            <PricingCard
                                key={plan.id}
                                plan={plan}
                                index={index}
                                features={content.features}
                            />
                        ))}
                    </div>
                    <div className="col-span-1" />
                </div>

                <div className="grid grid-cols-12 mt-12">
                    <div className="col-span-1" />
                    <div className="col-span-10">
                        <div className="mx-auto max-w-2xl px-6 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {content.note}
                            </p>
                            <p className="mt-2 text-sm text-slate-400">
                                {content.footnote}
                            </p>
                        </div>
                    </div>
                    <div className="col-span-1" />
                </div>
            </div>
        </div>
    </section>
)

export default Pricing
