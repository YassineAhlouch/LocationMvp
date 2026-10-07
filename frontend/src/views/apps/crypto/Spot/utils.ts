import uniqueId from 'lodash/uniqueId'
import type { TradingSide, OrderType } from './types'

export const sanitizeNumericValue = (value: string | number): number => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    return isNaN(numValue) ? 0 : Math.max(0, numValue)
}

export const createNewOrder = (orderData: {
    pair: string
    side: TradingSide
    type: OrderType
    amount: number
    price: number
    currentPrice: number
}) => {
    const finalPrice =
        orderData.type === 'market' ? orderData.currentPrice : orderData.price

    return {
        id: uniqueId('order-'),
        date: new Date(),
        pair: orderData.pair,
        type: orderData.type,
        side: orderData.side,
        price: finalPrice,
        amount: sanitizeNumericValue(orderData.amount),
        filled: 0,
        total: finalPrice * sanitizeNumericValue(orderData.amount),
        status: 'pending',
        sor: false,
    }
}

export const formatVolume = (volume: number): string => {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`
    return volume.toFixed(2)
}

export const converActivePairDisplay = (pair: string): string => {
    return pair.replace('-', '/')
}

export const sideTagClasses = {
    buy: 'bg-success-subtle text-success',
    sell: 'bg-error-subtle text-error',
}

export const statusTagClasses: Record<string, string> = {
    partial: 'bg-warning',
    filled: 'bg-success',
    cancelled: 'bg-error',
}
