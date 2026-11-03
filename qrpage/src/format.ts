/** Small presentational helpers shared by the landing pieces. */

/** French day price: currency comes from the car's own agency. */
export const formatDailyPrice = (
    price: number,
    currencyCode: string,
): string =>
    new Intl.NumberFormat('fr-MA', {
        style: 'currency',
        currency: currencyCode || 'MAD',
        maximumFractionDigits: 0,
    }).format(price)

/** datetime-local value helpers — the API accepts ISO-local datetimes. */
export const nowLocal = (): string => {
    const now = new Date()
    now.setSeconds(0, 0)

    return toLocalInput(now)
}

export const toLocalInput = (date: Date): string => {
    const pad = (value: number) => String(value).padStart(2, '0')

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate(),
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}
