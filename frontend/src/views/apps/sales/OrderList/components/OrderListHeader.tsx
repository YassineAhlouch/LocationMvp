import { useNavigate } from 'react-router'
import Button from '@/components/ui/Button'
import Dropdown from '@/components/ui/Dropdown'
import useOrderListData from '../hooks/useOrderListData'
import useQueryParamPagingState from '@/utils/hooks/useQueryParamPagingState'
import useResponsive from '@/utils/hooks/useResponsive'
import { LiDownload, LiTickCircle, LiAdd } from '@/icons'
import { CSVLink } from 'react-csv'

const rangeOptions = [
    { value: '30', label: 'Last 30 days' },
    { value: '60', label: 'Last 60 days' },
    { value: '90', label: 'Last 90 days' },
]

const OrderListHeader = () => {
    const navigate = useNavigate()

    const { data } = useOrderListData()

    const { filterState, setQueryParams } = useQueryParamPagingState()

    const { larger } = useResponsive()

    const value = filterState.range || '30'

    return (
        <div className="flex items-center justify-between gap-4 print:hidden">
            <h4>Order List</h4>
            <div className="flex items-center gap-2">
                <Dropdown
                    placement="bottom-end"
                    menuClass="min-w-[180px]"
                    onSelect={(val) => setQueryParams({ range: val })}
                    renderTitle={
                        <Button>
                            {larger.sm
                                ? rangeOptions.find(
                                      (option) => option.value === value,
                                  )?.label
                                : value + 'd'}
                        </Button>
                    }
                >
                    {rangeOptions.map((option) => (
                        <Dropdown.Item
                            key={option.value}
                            eventKey={option.value}
                        >
                            <span className="flex items-center justify-between w-full">
                                <span>{option.label}</span>
                                {value === option.value && <LiTickCircle />}
                            </span>
                        </Dropdown.Item>
                    ))}
                </Dropdown>
                <CSVLink filename="customerList.csv" data={data?.list || []}>
                    <Button icon={<LiDownload />}>
                        {larger.sm && 'Export'}
                    </Button>
                </CSVLink>
                <Button
                    variant="solid"
                    icon={!larger.sm ? <LiAdd /> : undefined}
                    onClick={() => navigate('/apps/sales/order')}
                >
                    {larger.sm ? 'Add Order' : ''}
                </Button>
            </div>
        </div>
    )
}

export default OrderListHeader
