import dayjs from 'dayjs'

export const getCurrentMonth = () => {
    return dayjs().format('YYYY-MM')
}

export const formatMonthLabel = (monthStr: string) => {
    return dayjs(monthStr + '-01').format('MMM YYYY')
}

export const generateMonthOptions = () => {
    const options = []

    // Generate last 12 months including current month
    for (let i = 0; i < 12; i++) {
        const date = dayjs().subtract(i, 'month')
        const monthStr = date.format('YYYY-MM')
        const label = date.format('MMM YYYY')
        options.push({
            value: monthStr,
            label: label,
        })
    }
    return options
}
