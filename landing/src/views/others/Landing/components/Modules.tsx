import type { IconType } from 'react-icons'
import {
    TbCalendarEvent,
    TbCarSuv,
    TbChartBar,
    TbCreditCard,
    TbFileText,
    TbReceipt,
    TbShieldCheck,
    TbUsers,
} from 'react-icons/tb'
import type { LandingModules } from '../types'

const iconMap: Record<string, IconType> = {
    calendar: TbCalendarEvent,
    car: TbCarSuv,
    users: TbUsers,
    contract: TbFileText,
    payments: TbCreditCard,
    invoice: TbReceipt,
    reports: TbChartBar,
    team: TbShieldCheck,
}

const Modules = ({ content }: { content: LandingModules }) => (
    <section
        id="modules"
        className="border-t border-gray-200 dark:border-gray-700"
    >
        <div className="max-w-7xl mx-auto border-r border-l border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-12 py-12 lg:py-24 px-4 lg:px-0">
                <div className="col-span-1" />
                <div className="col-span-10">
                    <h3 className="max-w-2xl mx-auto lg:mx-0 leading-snug">
                        <span>{content.heading}</span>
                    </h3>
                    <p className="text-slate-400 font-medium mt-3 max-w-2xl mx-auto lg:mx-0">
                        {content.subheading}
                    </p>
                </div>
                <div className="col-span-1" />
            </div>
            <div className="grid grid-cols-12 pb-24">
                <div className="col-span-1" />
                <div className="col-span-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {content.items.map((item) => {
                        const Icon = iconMap[item.icon]
                        return (
                            <div
                                key={item.id}
                                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 transition-colors hover:border-gray-300 dark:hover:border-gray-600"
                            >
                                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-subtle text-primary">
                                    {Icon ? <Icon size={22} /> : null}
                                </div>
                                <h5 className="mt-5">{item.title}</h5>
                                <p className="mt-2 text-sm">{item.description}</p>
                            </div>
                        )
                    })}
                </div>
                <div className="col-span-1" />
            </div>
        </div>
    </section>
)

export default Modules
