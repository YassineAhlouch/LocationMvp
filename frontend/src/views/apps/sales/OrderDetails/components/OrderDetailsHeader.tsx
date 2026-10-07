import { useNavigate } from 'react-router'
import Button from '@/components/ui/Button'
import Container from '@/components/shared/Container'
import IconFrame from '@/components/shared/IconFrame'
import useResponsive from '@/utils/hooks/useResponsive'
import { LiBoxAdd, LiAdd } from '@/icons'

import type { FormMode } from '../types'
type OrderDetailsHeaderProps = {
    data?: {
        id: string
    }
    mode: FormMode
}

const OrderDetailsHeader = ({ mode, data }: OrderDetailsHeaderProps) => {
    const navigate = useNavigate()

    const { larger } = useResponsive()

    return (
        <div className="py-4 border-b border-gray-200 dark:border-gray-800">
            <Container size="md" className="px-4">
                <div className="flex items-center justify-between gap-4">
                    {mode === 'create' && (
                        <div className="flex items-center gap-4">
                            <IconFrame variant="layered">
                                <LiBoxAdd className="text-xl heading-text" />
                            </IconFrame>
                            <div>
                                <h5 className="font-semibold">Add new order</h5>
                                <span>Add new order to the system</span>
                            </div>
                        </div>
                    )}

                    {mode === 'edit' && (
                        <div className="flex items-center gap-4">
                            <IconFrame variant="layered">
                                <LiBoxAdd className="text-xl heading-text" />
                            </IconFrame>
                            <div>
                                <h5 className="font-semibold">
                                    Edit Order{' '}
                                    {data?.id
                                        ? `#${data.id.slice(-8).toUpperCase()}`
                                        : ''}
                                </h5>
                                <span>Modify existing order details</span>
                            </div>
                        </div>
                    )}
                    <Button
                        icon={<LiAdd />}
                        onClick={() => navigate('/apps/accounts/invoice')}
                    >
                        {larger.sm ? 'Create Invoice' : ''}
                    </Button>
                </div>
            </Container>
        </div>
    )
}

export default OrderDetailsHeader
