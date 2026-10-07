import { useState } from 'react'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import SelectOptionWithPrefix from '@/components/shared/SelectOptionWithPrefix'
import classNames from '@/utils/classNames'
import sleep from '@/utils/sleep'
import { useForecastStore } from '../store/forecastStore'
import { LiRefresh, LiDownload } from '@/icons'
import type { Scenario } from '../types'

const scenarioOptions = [
    { value: 'best-case' as Scenario, label: 'Best Case', color: 'bg-success' },
    { value: 'expected' as Scenario, label: 'Expected', color: 'bg-primary' },
    { value: 'worst-case' as Scenario, label: 'Worst Case', color: 'bg-error' },
]

const dateRangeOptions = [
    { value: 'next-3-month', label: 'Next 3 Months' },
    { value: 'next-6-month', label: 'Next 6 Months' },
    { value: 'next-12-month', label: 'Next 12 Months' },
]

const ForecastHeader = () => {
    const [isRefreshing, setIsRefreshing] = useState(false)

    const dateRange = useForecastStore((state) => state.dateRange)
    const scenario = useForecastStore((state) => state.scenario)
    const setDateRange = useForecastStore((state) => state.setDateRange)
    const setScenario = useForecastStore((state) => state.setScenario)

    const handleDateRangeChange = (dates: string) => {
        setDateRange(dates)
    }

    const handleRefresh = async () => {
        setIsRefreshing(true)
        setDateRange(dateRange)
        await sleep(1000)
        setIsRefreshing(false)
    }

    const handleExport = () => {
        console.log('Export forecast data')
    }

    return (
        <header className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-6">
            <div>
                <h4>Forecast</h4>
                <p>
                    Predictive insights across revenue, growth, and retention
                    metrics
                </p>
            </div>
            <div
                className="flex flex-col sm:flex-row gap-3"
                role="toolbar"
                aria-label="Forecast controls"
            >
                <div className="flex flex-col sm:flex-row gap-3">
                    <label className="sr-only" htmlFor="date-range-picker">
                        Select date range for forecast
                    </label>
                    <Select
                        className="w-40"
                        options={dateRangeOptions}
                        value={dateRangeOptions.find(
                            (opt) => opt.value === dateRange,
                        )}
                        onChange={(selected) =>
                            handleDateRangeChange(selected.value)
                        }
                    />
                </div>
                <Select
                    className="w-40"
                    options={scenarioOptions}
                    value={scenarioOptions.find(
                        (opt) => opt.value === scenario,
                    )}
                    onChange={(selected) => setScenario(selected.value)}
                    customInputDisplay={(selectedItem) => (
                        <SelectInputWithPrefix
                            label={selectedItem?.label}
                            prefix={
                                selectedItem && (
                                    <span
                                        className={classNames(
                                            'h-2.5 w-2.5 rounded-full',
                                            selectedItem.color,
                                        )}
                                    ></span>
                                )
                            }
                        />
                    )}
                    customOption={({ option, selected, CheckIcon }) => (
                        <SelectOptionWithPrefix
                            label={option.label}
                            prefix={
                                <span
                                    className={classNames(
                                        'h-2 w-2 rounded-full',
                                        option.color,
                                    )}
                                ></span>
                            }
                            selected={selected}
                            checkIcon={CheckIcon}
                        />
                    )}
                />
                <div className="flex gap-2">
                    <Button
                        onClick={handleRefresh}
                        loading={isRefreshing}
                        icon={<LiRefresh />}
                        aria-label="Refresh forecast data"
                    >
                        Refresh
                    </Button>
                    <Button
                        onClick={handleExport}
                        icon={<LiDownload />}
                        aria-label="Export forecast data"
                    >
                        Export
                    </Button>
                </div>
            </div>
        </header>
    )
}

export default ForecastHeader
