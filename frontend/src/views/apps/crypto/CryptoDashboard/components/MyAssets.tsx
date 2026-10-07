import Card from '@/components/ui/Card'
import Carousel from '@/components/ui/Carousel'
import { ComposedChart, Line, ResponsiveContainer } from 'recharts'
import { getSparklineTrendColor } from '../utils'
import type { DashboardAssetCard } from '../types'

type MyAssetsProps = {
    assets: DashboardAssetCard[]
}

const AssetCard = ({ asset }: { asset: DashboardAssetCard }) => {
    const trendColor = getSparklineTrendColor(asset.sparklineData)
    const chartColor = trendColor === 'success' ? '#10b981' : '#ef4444'

    const chartData = asset.sparklineData.map((value, index) => ({
        index,
        value,
    }))

    const formatBalance = (balance: number, symbol: string) => {
        if (balance < 1) {
            return `${balance.toFixed(3)} ${symbol}`
        } else if (balance < 100) {
            return `${balance.toFixed(2)} ${symbol}`
        } else {
            return `${balance.toFixed(0)} ${symbol}`
        }
    }

    const formatUsdValue = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value)
    }

    return (
        <Card className="bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center gap-3 mb-6">
                <img
                    src={asset.icon}
                    alt={asset.name}
                    className="w-6 h-6 rounded-full"
                    onError={(e) => {
                        ;(e.target as HTMLImageElement).src =
                            '/img/thumbs/crypto/default.png'
                    }}
                />
                <div>
                    <div className="font-semibold heading-text">
                        {asset.name} ({asset.symbol})
                    </div>
                </div>
            </div>

            <div className="flex items-end justify-between">
                <div>
                    <h6>{formatBalance(asset.balance, asset.symbol)}</h6>
                    <div>{formatUsdValue(asset.usdValue)}</div>
                </div>

                <div className="h-12 w-20 xl:w-18 2xl:w-24 ">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData}>
                            <Line
                                type="linear"
                                dataKey="value"
                                stroke={chartColor}
                                strokeWidth={2}
                                dot={false}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Card>
    )
}

const MyAssets = ({ assets }: MyAssetsProps) => {
    return (
        <Card>
            <Carousel
                opts={{
                    align: 'start',
                    loop: false,
                }}
                className="w-full"
            >
                <div className="flex items-center justify-between mb-4">
                    <h5>My Asset</h5>
                    <div className="flex rtl:flex-row-reverse items-center gap-2">
                        <Carousel.Previous shape="round" />
                        <Carousel.Next shape="round" />
                    </div>
                </div>
                <Carousel.Content className="-ml-2 md:-ml-4">
                    {assets.map((asset) => (
                        <Carousel.Item
                            key={asset.id}
                            className="pl-2 md:pl-4 basis-full md:basis-1/2 xl:basis-1/3"
                        >
                            <AssetCard asset={asset} />
                        </Carousel.Item>
                    ))}
                </Carousel.Content>
            </Carousel>
        </Card>
    )
}

export default MyAssets
