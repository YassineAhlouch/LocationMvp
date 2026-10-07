export const getStockLevel = (stockCount: number) => {
    if (stockCount > 80) return 'high'
    if (stockCount > 25) return 'medium'
    if (stockCount === 0) return 'empty'
    return 'low'
}

export const stockLevelMap = {
    high: {
        label: 'High',
        color: 'bg-success',
    },
    medium: {
        label: 'Medium',
        color: 'bg-primary',
    },
    low: {
        label: 'Low',
        color: 'bg-error',
    },
    empty: {
        label: 'Out of Stock',
        color: '',
    },
}

export const categoryMap = {
    clothing: {
        label: 'Clothing',
    },
    electronics: {
        label: 'Electronics',
    },
    shoes: {
        label: 'Shoes',
    },
    accessories: {
        label: 'Accessories',
    },
    watches: {
        label: 'Watches',
    },
    beauty: {
        label: 'Beauty',
    },
    bags: {
        label: 'Bags',
    },
    music: {
        label: 'Music Instruments',
    },
}
