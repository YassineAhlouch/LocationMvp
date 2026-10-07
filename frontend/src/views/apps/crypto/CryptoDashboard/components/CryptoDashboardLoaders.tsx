import CryptoDashboardContainer from './CryptoDashboardContainer'
import Button from '@/components/ui/Button'
import InputGroup from '@/components/ui/InputGroup'
import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import { Table } from '@/components/ui/Table'

const { Tr, Th, Td, THead, TBody } = Table

const CryptoDashboardLoaders = () => {
    return (
        <CryptoDashboardContainer
            totalPortfolio={
                <Card>
                    <div className="space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <Skeleton height={12} width={120} />
                                <Skeleton height={12} width={200} />
                                <div className="flex items-center gap-2">
                                    <Skeleton height={12} width={100} />
                                    <Skeleton height={12} width={60} />
                                </div>
                            </div>
                            <InputGroup>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <Button
                                        key={index}
                                        className="hover:bg-transparent cursor-auto"
                                    >
                                        <Skeleton
                                            key={index}
                                            height={12}
                                            width={24}
                                        />
                                    </Button>
                                ))}
                            </InputGroup>
                        </div>

                        <Skeleton height={300} />
                    </div>
                </Card>
            }
            assetCards={
                <Card bodyClass="space-y-4">
                    <Skeleton height={12} width={120} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <Card key={index}>
                                <div className="space-y-8">
                                    <div className="flex items-center gap-3">
                                        <Skeleton
                                            variant="circle"
                                            height={40}
                                            width={40}
                                        />
                                        <div className="space-y-1">
                                            <Skeleton height={12} width={80} />
                                            <Skeleton height={12} width={60} />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-2">
                                            <Skeleton height={12} width={80} />
                                            <Skeleton height={12} width={40} />
                                        </div>
                                        <Skeleton height={36} width={120} />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </Card>
            }
            watchlistTable={
                <Card bodyClass="p-0">
                    <div className="flex items-center justify-between py-6 px-4">
                        <Skeleton height={12} width={80} />
                        <Skeleton height={12} width={80} />
                    </div>
                    <Table hoverable>
                        <THead>
                            <Tr>
                                <Th>
                                    <Skeleton height={12} width={40} />
                                </Th>
                                <Th>
                                    <Skeleton height={12} width={40} />
                                </Th>
                                <Th>
                                    <Skeleton height={12} width={60} />
                                </Th>
                                <Th>
                                    <Skeleton height={12} width={50} />
                                </Th>
                                <Th>
                                    <Skeleton height={12} width={70} />
                                </Th>
                                <Th className="w-20"></Th>
                            </Tr>
                        </THead>
                        <TBody>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Tr key={index}>
                                    <Td>
                                        <div className="flex items-center gap-3">
                                            <Skeleton
                                                variant="circle"
                                                height={24}
                                                width={24}
                                            />
                                            <div className="space-y-1">
                                                <Skeleton
                                                    height={12}
                                                    width={80}
                                                />
                                                <Skeleton
                                                    height={12}
                                                    width={60}
                                                />
                                            </div>
                                        </div>
                                    </Td>
                                    <Td>
                                        <Skeleton height={12} width={80} />
                                    </Td>
                                    <Td>
                                        <Skeleton height={36} width={80} />
                                    </Td>
                                    <Td>
                                        <Skeleton height={12} width={60} />
                                    </Td>
                                    <Td>
                                        <Skeleton height={12} width={70} />
                                    </Td>
                                    <Td>
                                        <Skeleton height={32} width={60} />
                                    </Td>
                                </Tr>
                            ))}
                        </TBody>
                    </Table>
                </Card>
            }
            buySellPanel={
                <Card>
                    <div className="space-y-4">
                        <Skeleton height={12} width={100} />
                        <div className="flex items-center gap-2">
                            <Skeleton height={32} />
                            <Skeleton height={32} />
                        </div>
                        <div className="space-y-4">
                            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                                <Skeleton
                                    height={12}
                                    width={60}
                                    className="mb-8"
                                />
                                <div className="flex items-center justify-between gap-2">
                                    <Skeleton height={32} width={100} />
                                    <Skeleton height={32} width={80} />
                                </div>
                            </div>
                            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                                <Skeleton
                                    height={12}
                                    width={60}
                                    className="mb-8"
                                />
                                <div className="flex items-center justify-between gap-2">
                                    <Skeleton height={32} width={100} />
                                    <Skeleton height={32} width={80} />
                                </div>
                            </div>
                            <div>
                                <Skeleton
                                    height={12}
                                    width={60}
                                    className="mb-2"
                                />
                                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                                    <div className="flex items-center gap-2">
                                        <Skeleton
                                            variant="circle"
                                            height={40}
                                            width={40}
                                        />
                                        <div className="space-y-1">
                                            <Skeleton height={12} width={100} />
                                            <Skeleton height={12} width={80} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Skeleton height={12} width={200} />
                            <Skeleton height={40} />
                        </div>
                    </div>
                </Card>
            }
            transactionHistory={
                <Card>
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <Skeleton height={12} width={140} />
                            <Skeleton height={12} width={60} />
                        </div>
                        <div className="space-y-3">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between py-2"
                                >
                                    <div className="flex items-center gap-3">
                                        <Skeleton height={32} width={32} />
                                        <div className="space-y-1">
                                            <Skeleton height={12} width={100} />
                                            <Skeleton height={12} width={80} />
                                        </div>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <Skeleton height={12} width={80} />
                                        <Skeleton height={12} width={60} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            }
        />
    )
}

export default CryptoDashboardLoaders
