/* eslint-disable @typescript-eslint/no-explicit-any */
import wildCardSearch from '@/utils/wildCardSearch'
import sortBy, { Primer } from '@/utils/sortBy'
import paginate from '@/utils/paginate'
import { mock } from '../MockAdapter'
import {
    productsData,
    rangeData,
    productDetailsData,
    ordersData,
    orderDetailsData,
    orderStatisticsData,
    generateCompleteDashboardData,
} from '../data/salesData'

mock.onGet(`/api/products`).reply((config) => {
    const {
        pageIndex = 1,
        pageSize = 10,
        sortOrder,
        sortKey,
        query,
    } = config.params

    let data = productsData as any[]
    let total = data.length

    const prices = data.map((product) => product.price)

    const lowestPrice = Math.min(...prices)
    const highestPrice = Math.max(...prices)

    if (sortKey && sortOrder) {
        if (sortKey === 'category' || sortKey === 'name') {
            data.sort(
                sortBy(sortKey, sortOrder === 'desc', (a) =>
                    (a as string).toUpperCase(),
                ),
            )
        } else {
            data.sort(sortBy(sortKey, sortOrder === 'desc', parseInt as Primer))
        }
    }

    if (query) {
        data = wildCardSearch(data, query, 'name')
        total = data.length
    }

    data = paginate(data, pageSize, pageIndex)

    const responseData = {
        list: data,
        total: total,
        meta: {
            lowestPrice,
            highestPrice,
            rangeData,
        },
    }

    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([200, responseData])
        }, 500)
    })
})

mock.onGet(`/api/order-list`).reply((config) => {
    const { pageIndex, pageSize, query, sortKey, sortOrder, paymentStatus } =
        config.params

    const orders = ordersData as any[]
    let data = orders
    let total = data.length

    if (paymentStatus) {
        data = data.filter((order) => order.paymentStatus === paymentStatus)
        total = data.length
    }

    if (sortKey && sortOrder) {
        if (
            sortKey === 'status' ||
            sortKey === 'orderId' ||
            sortKey === 'customer' ||
            sortKey === 'paymentStatus'
        ) {
            data.sort(
                sortBy(sortKey, sortOrder === 'desc', (a) =>
                    (a as string).toUpperCase(),
                ),
            )
        } else {
            data.sort(sortBy(sortKey, sortOrder === 'desc', parseInt as Primer))
        }
    }

    if (query) {
        data = wildCardSearch(data, query, 'id')
        total = data.length
    }

    data = paginate(data, pageSize, pageIndex)

    const responseData = {
        list: data,
        total: total,
    }

    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([200, responseData])
        }, 500)
    })
})

mock.onGet(new RegExp(`/api/orders/*`)).reply((config) => {
    const segement = config.url?.split('/')
    const id = segement?.[segement.length - 1]

    const order = ordersData.find((order) => order.id === id)

    if (!order) {
        return [
            200,
            {
                ...ordersData[0],
                ...orderDetailsData,
                products: productsData.slice(0, 1),
            },
        ]
    }

    const getOrderDetailsExtra = () => {
        const products = productsData.slice(0, order.productCount)
        const subTotal = products.reduce(
            (sum, product) => sum + product.price,
            0,
        )
        const total = subTotal + 105.72 + 15
        return {
            ...orderDetailsData,
            products: products.map((product) => ({
                ...product,
                quantity: 1,
                total: product.price,
            })),
            paymentSummary: {
                subTotal,
                tax: 105.72,
                deliveryFees: 15,
                total,
                customerPayment: total,
            },
        }
    }

    return [
        200,
        {
            ...order,
            ...getOrderDetailsExtra(),
        },
    ]
})

mock.onGet(`/api/order-statistics`).reply(() => {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([200, orderStatisticsData])
        }, 500)
    })
})

mock.onGet(/\/api\/products\/\d+/).reply(function (config) {
    const id = config.url?.split('/')[2]
    const product = productsData.find((product) => product.id === id)

    if (!product) {
        return [404, {}]
    }

    return [200, { ...product, ...productDetailsData }]
})

mock.onGet('/api/sales/dashboard-data').reply((config) => {
    const {
        timeRange = 'thisMonth',
        comparisonPeriod = 'lastMonth',
        startDate,
        endDate,
        comparisonStartDate,
        comparisonEndDate,
    } = config.params

    const dynamicDashboardData = generateCompleteDashboardData(
        startDate,
        endDate,
        comparisonStartDate,
        comparisonEndDate,
        timeRange,
        comparisonPeriod,
    )

    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve([
                200,
                {
                    success: true,
                    data: dynamicDashboardData,
                    meta: {
                        timeRange,
                        comparisonPeriod,
                        startDate,
                        endDate,
                        comparisonStartDate,
                        comparisonEndDate,
                        generatedAt: new Date().toISOString(),
                    },
                },
            ])
        }, 800)
    })
})
