import { lazy, useEffect, useState } from 'react'
import { Route, Routes, useNavigate, useParams } from 'react-router'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import OverflowTabs from '@/components/shared/OverflowTabs'
import PeriodPicker, {
    currentMonthRange,
} from '@/components/shared/PeriodPicker'
import type { DateRange } from '@/components/shared/PeriodPicker'
import CarDetailsInfo from './CarDetailsInfo'
import { apiGetCar } from '@/services/LocationService'
import { APPS_PREFIX_PATH } from '@/constants/route.constant'
import { useSessionUser } from '@/store/authStore'
import { LiChevronLeft, LiChevronRight } from '@/icons'
import { isVerbGranted } from './PermissionChecklist'
import useTranslation from '@/utils/hooks/useTranslation'
import type { Car } from '@/@types/location'

const CarOverview = lazy(() => import('./CarOverview'))
const CarReservations = lazy(() => import('./CarReservations'))
const CarExpenses = lazy(() => import('./CarExpenses'))
const CarHistory = lazy(() => import('./CarHistory'))
const CarStatistics = lazy(() => import('./CarStatistics'))

const CarDetails = () => {
    const params = useParams()
    const navigate = useNavigate()
    const carId = params.id
    const rawSegment = params['*'] || ''
    const activeTab = rawSegment || 'overview'
    const { t } = useTranslation()

    const { user } = useSessionUser()
    const canViewFinancing = isVerbGranted(
        user?.role?.permissions ?? [],
        'financing',
        'view',
    )

    const baseTabList = [
        {
            label: t('cars.overview.tabs.overview', 'Overview'),
            value: 'overview',
        },
        {
            label: t('cars.overview.tabs.reservations', 'Reservations'),
            value: 'reservations',
        },
        {
            label: t('cars.overview.tabs.expenses', 'Expenses'),
            value: 'expenses',
        },
        { label: t('cars.overview.tabs.history', 'History'), value: 'history' },
    ]

    const tabList = canViewFinancing
        ? [
              baseTabList[0],
              baseTabList[1],
              baseTabList[2],
              {
                  label: t('cars.overview.tabs.statistics', 'Statistics'),
                  value: 'statistics',
              },
              baseTabList[3],
          ]
        : baseTabList

    const [car, setCar] = useState<Car | null>(null)
    const [loading, setLoading] = useState(true)
    const [failed, setFailed] = useState(false)
    // One period for the whole vehicle dossier: every tab scopes its data to
    // it (defaulting to the current month).
    const [range, setRange] = useState<DateRange>(currentMonthRange)
    // The specs panel (image + characteristics) can be tucked away so the
    // tabs take the full width.
    const [specsOpen, setSpecsOpen] = useState(true)

    const goToListe = () => navigate(`${APPS_PREFIX_PATH}/vehicules/liste`)

    useEffect(() => {
        if (!carId) {
            setFailed(true)
            setLoading(false)
            return
        }
        let active = true
        setLoading(true)
        setFailed(false)
        apiGetCar(Number(carId))
            .then((res) => {
                if (active) {
                    setCar(res)
                }
            })
            .catch(() => {
                if (active) {
                    setFailed(true)
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false)
                }
            })
        return () => {
            active = false
        }
    }, [carId])

    // Keep a bare /vehicules/:id URL in sync with the default tab.
    useEffect(() => {
        if (carId && !rawSegment) {
            navigate(`${APPS_PREFIX_PATH}/vehicules/${carId}/overview`, {
                replace: true,
            })
        }
    }, [carId, rawSegment, navigate])

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Spinner />
            </div>
        )
    }

    if (failed || !car) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
                <h5 className="dark:text-gray-100">
                    {t('cars.notFound.title', 'Vehicle not found')}
                </h5>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                    {t(
                        'cars.notFound.description',
                        "It may have been deleted or you don't have access to it.",
                    )}
                </p>
                <Button onClick={goToListe}>
                    {t('cars.notFound.back', 'Back to vehicles')}
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <Button
                size="sm"
                variant="ghost"
                icon={<LiChevronLeft />}
                onClick={goToListe}
            >
                {t('cars.notFound.back', 'Back to vehicles')}
            </Button>

            <div className="flex flex-col xl:flex-row gap-4 h-full">
                {specsOpen && (
                    <div className="flex w-full xl:w-[300px] xl:min-w-[300px]">
                        <CarDetailsInfo car={car} />
                    </div>
                )}

                <div className="w-full flex-1 min-w-0 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <Button
                            size="sm"
                            variant="ghost"
                            icon={specsOpen ? <LiChevronLeft /> : <LiChevronRight />}
                            onClick={() => setSpecsOpen((open) => !open)}
                        >
                            {specsOpen
                                ? t('cars.overview.hideSpecs', 'Hide specs')
                                : t('cars.overview.showSpecs', 'Show specs')}
                        </Button>
                        <PeriodPicker value={range} onChange={setRange} />
                    </div>
                    <OverflowTabs
                        tabList={tabList}
                        value={activeTab}
                        onChange={(tab) =>
                            navigate(
                                `${APPS_PREFIX_PATH}/vehicules/${carId}/${tab}`,
                            )
                        }
                    />
                    <div className="h-full">
                        <Routes>
                            <Route
                                path="/overview"
                                element={
                                    <CarOverview
                                        carId={car.id}
                                        range={range}
                                    />
                                }
                            />
                            <Route
                                path="/reservations"
                                element={
                                    <CarReservations
                                        carId={car.id}
                                        range={range}
                                    />
                                }
                            />
                            <Route
                                path="/expenses"
                                element={
                                    <CarExpenses
                                        carId={car.id}
                                        carLabel={`${car.registration_number} · ${
                                            [car.brand?.name, car.model?.name]
                                                .filter(Boolean)
                                                .join(' ') ||
                                            car.registration_number
                                        }`}
                                        range={range}
                                    />
                                }
                            />
                            <Route
                                path="/history"
                                element={
                                    <CarHistory carId={car.id} range={range} />
                                }
                            />
                            <Route
                                path="/statistics"
                                element={
                                    <CarStatistics
                                        carId={car.id}
                                        range={range}
                                    />
                                }
                            />
                            <Route
                                path="*"
                                element={
                                    <CarOverview
                                        carId={car.id}
                                        range={range}
                                    />
                                }
                            />
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CarDetails
