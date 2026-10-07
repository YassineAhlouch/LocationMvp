import { CohortChart } from '@/components/shared/Chart'
import type { CohortChartData } from '@/components/shared/Chart/CohortChart'

const cohortData: CohortChartData = {
    'Week 1': {
        size: 1200,
        periods: [
            { percentage: 100, value: 1200 },
            { percentage: 45, value: 540 },
            { percentage: 32, value: 384 },
            { percentage: 28, value: 336 },
            { percentage: 25, value: 300 },
            { percentage: 22, value: 264 },
        ],
    },
    'Week 2': {
        size: 980,
        periods: [
            { percentage: 100, value: 980 },
            { percentage: 48, value: 470 },
            { percentage: 35, value: 343 },
            { percentage: 30, value: 294 },
            { percentage: 27, value: 265 },
            null,
        ],
    },
    'Week 3': {
        size: 850,
        periods: [
            { percentage: 100, value: 850 },
            { percentage: 52, value: 442 },
            { percentage: 38, value: 323 },
            { percentage: 33, value: 281 },
            null,
            null,
        ],
    },
    'Week 4': {
        size: 720,
        periods: [
            { percentage: 100, value: 720 },
            { percentage: 55, value: 396 },
            { percentage: 40, value: 288 },
            null,
            null,
            null,
        ],
    },
    'Week 5': {
        size: 650,
        periods: [
            { percentage: 100, value: 650 },
            { percentage: 58, value: 377 },
            null,
            null,
            null,
            null,
        ],
    },
    'Week 6': {
        size: 580,
        periods: [
            { percentage: 100, value: 580 },
            null,
            null,
            null,
            null,
            null,
        ],
    },
}

const CohortChartBasic = () => {
    return (
        <CohortChart
            data={cohortData}
            timeUnits={[
                'Week 1',
                'Week 2',
                'Week 3',
                'Week 4',
                'Week 5',
                'Week 6',
            ]}
            legendTitle="Retention Rate"
            cohortHeaderText="Cohort"
            sizeLabelText="Users"
        />
    )
}

export default CohortChartBasic
