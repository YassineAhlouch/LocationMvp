import PaymentCycleToggle from './PaymentCycleToggle'
const PricingHeader = () => {
    return (
        <div className="py-4 sm:px-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h4>Pricing</h4>
                    <p>Choose the best plan for your needs and budget.</p>
                </div>
                <div className="flex items-center justify-between gap-2">
                    <span className="heading-text font-medium">
                        Billing period:
                    </span>
                    <PaymentCycleToggle />
                </div>
            </div>
        </div>
    )
}

export default PricingHeader
