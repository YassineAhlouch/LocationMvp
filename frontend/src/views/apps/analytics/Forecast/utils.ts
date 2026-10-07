import dayjs from 'dayjs'

export const dateRangeValues: Record<
    string,
    { startDate: string; endDate: string }
> = {
    'next-3-month': {
        startDate: dayjs().add(1, 'month').toDate().toISOString(),
        endDate: dayjs().add(3, 'month').toDate().toISOString(),
    },
    'next-6-month': {
        startDate: dayjs().add(1, 'month').toDate().toISOString(),
        endDate: dayjs().add(6, 'month').toDate().toISOString(),
    },
    'next-12-month': {
        startDate: dayjs().add(1, 'month').toDate().toISOString(),
        endDate: dayjs().add(12, 'month').toDate().toISOString(),
    },
}
