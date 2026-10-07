import { useMemo } from 'react'
import Card from '@/components/ui/Card'
import VectorMap from '@/components/shared/VectorMap'
import worldJson from '@/assets/data/maps/world.json'
import { convertCurrency, formatCurrency } from '../utils/dataTransformers'
import type { GeographicMapProps } from '../types'

const blueScale = [
    '#1d4ed8',
    '#2563eb',
    '#3b82f6',
    '#60a5fa',
    '#93c5fd',
    '#bfdbfe',
]

const regionToCountries: Record<string, { countries: string[] }> = {
    'North America': {
        countries: ['us', 'ca', 'mx'],
    },
    Europe: {
        countries: [
            'gb',
            'fr',
            'de',
            'it',
            'es',
            'nl',
            'be',
            'ch',
            'at',
            'se',
            'no',
            'dk',
            'fi',
            'pl',
            'cz',
            'pt',
            'gr',
            'ie',
        ],
    },
    'Asia Pacific': {
        countries: [
            'cn',
            'jp',
            'in',
            'au',
            'kr',
            'sg',
            'th',
            'my',
            'id',
            'ph',
            'vn',
            'nz',
        ],
    },
    'Latin America': {
        countries: ['br', 'ar', 'cl', 'co', 'pe', 've', 'ec', 'uy', 'py'],
    },
    'Middle East': {
        countries: ['sa', 'ae', 'il', 'eg', 'qa', 'kw', 'om', 'bh'],
    },
    Africa: {
        countries: ['za', 'ng', 'eg', 'ke', 'gh', 'dz', 'ma', 'tn'],
    },
}

const GeographicDistribution = ({
    data,
    currency,
    highlightStalledDeals,
}: GeographicMapProps) => {
    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => b.revenue - a.revenue)
    }, [data])

    const regionColorMap = useMemo(() => {
        const STALLED_THRESHOLD = 30
        const map: Record<string, string> = {}
        sortedData.forEach((region, index) => {
            if (
                highlightStalledDeals &&
                region.averageAge &&
                region.averageAge > STALLED_THRESHOLD
            ) {
                if (region.averageAge > 45) {
                    map[region.region] = '#dc2626'
                } else {
                    map[region.region] = '#ea580c'
                }
            } else {
                map[region.region] = blueScale[index % blueScale.length]
            }
        })
        return map
    }, [sortedData, highlightStalledDeals])

    const countryDataMap = useMemo(() => {
        const map: Record<
            string,
            { region: string; color: string; revenue: number }
        > = {}
        data.forEach((regionData) => {
            const regionConfig = regionToCountries[regionData.region]
            if (regionConfig) {
                const color = regionColorMap[regionData.region]
                regionConfig.countries.forEach((countryCode) => {
                    map[countryCode] = {
                        region: regionData.region,
                        color: color,
                        revenue: regionData.revenue,
                    }
                })
            }
        })
        return map
    }, [data, regionColorMap])

    const countryColorMap = useMemo(() => {
        const colors: Record<string, string> = {}
        Object.entries(countryDataMap).forEach(([countryCode, data]) => {
            colors[countryCode] = data.color
        })
        return colors
    }, [countryDataMap])

    const getLayerProps = (layer: { id: string; name: string; d: string }) => {
        const countryData = countryDataMap[layer.id]
        if (countryData) {
            const patternId = `map-dots-${layer.id}`
            return {
                fill: `url(#${patternId})`,
                strokeWidth: 0.5,
                className: `transition-all duration-200 fill-[url(#${patternId})]`,
                hover: {
                    tooltipContent: (
                        <div className="space-y-1">
                            <div className="font-semibold">{layer.name}</div>
                            <div className="text-xs opacity-90">
                                {countryData.region}
                            </div>
                            <div className="text-xs font-medium">
                                {formatCurrency(
                                    convertCurrency(
                                        countryData.revenue,
                                        currency,
                                    ),
                                    currency,
                                )}
                            </div>
                        </div>
                    ),
                },
            }
        }
        return {
            className:
                'fill-[url(#map-dots-default)] dark:fill-[url(#map-dots-default)]',
        }
    }

    return (
        <Card>
            <div className="mb-4">
                <h5>Geographic Distribution</h5>
            </div>
            <div className="flex justify-center">
                <VectorMap
                    layerProps={(layer) => getLayerProps(layer)}
                    className="h-[230px]"
                    {...worldJson}
                >
                    <defs>
                        <style>
                            {Object.entries(countryColorMap)
                                .map(
                                    ([countryCode, color]) =>
                                        `.fill-${countryCode} { fill: ${color}; }`,
                                )
                                .join('\n')}
                        </style>

                        <pattern
                            id="map-dots-default"
                            width="12"
                            height="12"
                            patternUnits="userSpaceOnUse"
                        >
                            <rect
                                width="12"
                                height="12"
                                fill="transparent"
                            ></rect>
                            <circle
                                className="fill-gray-400 dark:fill-gray-600"
                                cx="3"
                                cy="3"
                                r="4"
                            ></circle>
                        </pattern>
                        {Object.entries(countryColorMap).map(
                            ([countryCode, color]) => (
                                <pattern
                                    key={countryCode}
                                    id={`map-dots-${countryCode}`}
                                    width="12"
                                    height="12"
                                    patternUnits="userSpaceOnUse"
                                >
                                    <rect
                                        width="12"
                                        height="12"
                                        fill="transparent"
                                    ></rect>
                                    <circle
                                        fill={color}
                                        cx="3"
                                        cy="3"
                                        r="4"
                                    ></circle>
                                </pattern>
                            ),
                        )}
                    </defs>
                </VectorMap>
            </div>
            <div className="mt-6">
                <div className="flex items-center justify-between mb-4 px-1">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Region
                    </span>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Revenue
                    </span>
                </div>
                <div className="space-y-0 divide-y divide-gray-200 dark:divide-gray-700">
                    {sortedData.map((region) => (
                        <div
                            key={region.region}
                            className="flex items-center justify-between py-2"
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded flex-shrink-0 py-1"
                                    style={{
                                        backgroundColor:
                                            regionColorMap[region.region],
                                    }}
                                />
                                <span className="heading-text">
                                    {region.region}
                                </span>
                            </div>
                            <span className="font-medium heading-text">
                                {formatCurrency(
                                    convertCurrency(region.revenue, currency),
                                    currency,
                                )}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    )
}

export default GeographicDistribution
