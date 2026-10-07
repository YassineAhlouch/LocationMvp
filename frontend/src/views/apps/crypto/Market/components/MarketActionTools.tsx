import Button from '@/components/ui/Button'
import DebounceInput from '@/components/shared/DebouceInput'
import PopoverFilter from '@/components/shared/PopoverFilter'
import Select from '@/components/ui/Select'
import useMarketData from '../hooks/useMarketData'
import { LiBarChartUpDown, LiCoin, LiSearch } from '@/icons'

const MarketActionTools = () => {
    const { filters, setFilters } = useMarketData()

    const changeFilterOptions = [
        { label: 'All Changes', value: 'all' },
        { label: 'Gainers Only', value: 'gainers' },
        { label: 'Losers Only', value: 'losers' },
    ]

    const volumeRangeOptions = [
        { label: 'All Volumes', value: 'all' },
        { label: '$1M - $10M', value: '1mto10m' },
        { label: '$10m - $50M', value: '10mto50m' },
        { label: '$50M - $100M', value: '50mto100m' },
        { label: '> $100M', value: '100mAbove' },
    ]

    const priceRangeOptions = [
        { label: 'All Prices', value: 'all' },
        { label: '< $1', value: 'under1' },
        { label: '$1 - $100', value: '1to100' },
        { label: '$100 - $1000', value: '100to1000' },
        { label: '> $1000', value: 'over1000' },
    ]

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setFilters({ search: value })
    }

    const handleChangeFilterChange = (option: { value: string }) => {
        setFilters({ changeFilter: option.value })
    }

    const handleVolumeFilterChange = (
        selectedData: { value: string; label: string }[],
    ) => {
        const selectedValues = selectedData.map((item) => item.value)
        setFilters({ volumeFilter: selectedValues })
    }

    const handlePriceFilterChange = (
        selectedData: { value: string; label: string }[],
    ) => {
        const selectedValues = selectedData.map((item) => item.value)
        setFilters({ priceFilter: selectedValues })
    }

    return (
        <div className="">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* Search Input */}
                <div className="w-full lg:flex-1 lg:max-w-[250px]">
                    <DebounceInput
                        placeholder="Search cryptocurrencies..."
                        onChange={handleSearchChange}
                        prefix={<LiSearch className="text-base" />}
                        wait={300}
                    />
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto justify-start lg:justify-end">
                    {/* Change Filter */}
                    <Select
                        options={changeFilterOptions}
                        value={changeFilterOptions.find(
                            (option) => option.value === filters.changeFilter,
                        )}
                        onChange={handleChangeFilterChange}
                        placeholder="Filter by change"
                        className="min-w-[140px]"
                    />
                    <PopoverFilter
                        data={volumeRangeOptions}
                        onChange={handleVolumeFilterChange}
                        title="Volume Range"
                        inputPlaceholder="Search volume ranges..."
                        placement="bottom-end"
                        value={filters.volumeFilter || []}
                        renderTrigger={
                            <Button
                                icon={
                                    <LiBarChartUpDown className="text-base" />
                                }
                            >
                                <span className="flex items-center gap-1">
                                    <span>Volume </span>
                                    {filters.volumeFilter &&
                                        filters.volumeFilter.length > 0 && (
                                            <span className="bg-primary text-white text-xs rounded h-4 w-4 flex items-center justify-center font-medium">
                                                {filters.volumeFilter.length}
                                            </span>
                                        )}
                                </span>
                            </Button>
                        }
                    />
                    <PopoverFilter
                        data={priceRangeOptions}
                        onChange={handlePriceFilterChange}
                        title="Price Range"
                        inputPlaceholder="Search price ranges..."
                        placement="bottom-end"
                        value={filters.priceFilter || []}
                        renderTrigger={
                            <Button
                                icon={<LiCoin className="text-base" />}
                                className={
                                    filters.priceFilter &&
                                    filters.priceFilter.length > 0
                                        ? 'bg-primary-subtle text-primary'
                                        : ''
                                }
                            >
                                Price{' '}
                                {filters.priceFilter &&
                                    filters.priceFilter.length > 0 &&
                                    `(${filters.priceFilter.length})`}
                            </Button>
                        }
                    />
                </div>
            </div>
        </div>
    )
}

export default MarketActionTools
