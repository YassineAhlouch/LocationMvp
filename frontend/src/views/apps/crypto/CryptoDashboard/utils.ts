export const getSparklineTrendColor = (
    sparklineData: number[],
): 'success' | 'error' => {
    if (sparklineData.length < 2) return 'success'
    const first = sparklineData[0]
    const last = sparklineData[sparklineData.length - 1]
    return last >= first ? 'success' : 'error'
}
