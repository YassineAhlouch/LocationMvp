import { lazy, useEffect, useState } from 'react'
import { Route, Routes, useNavigate, useParams } from 'react-router'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import OverflowTabs from '@/components/shared/OverflowTabs'
import CarDetailsInfo from './CarDetailsInfo'
import { apiGetCar } from '@/services/LocationService'
import { APPS_PREFIX_PATH } from '@/constants/route.constant'
import { LiChevronLeft } from '@/icons'
import type { Car } from '@/@types/location'

const CarOverview = lazy(() => import('./CarOverview'))
const CarReservations = lazy(() => import('./CarReservations'))
const CarExpenses = lazy(() => import('./CarExpenses'))
const CarHistory = lazy(() => import('./CarHistory'))

const tabList = [
    { label: 'Overview', value: 'overview' },
    { label: 'Reservations', value: 'reservations' },
    { label: 'Expenses', value: 'expenses' },
    { label: 'History', value: 'history' },
]

const CarDetails = () => {
    const params = useParams()
    const navigate = useNavigate()
    const carId = params.id
    const rawSegment = params['*'] || ''
    const activeTab = rawSegment || 'overview'

    const [car, setCar] = useState<Car | null>(null)
    const [loading, setLoading] = useState(true)
    const [failed, setFailed] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)

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
    }, [carId, refreshKey])

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
                <h5 className="dark:text-gray-100">Vehicle not found</h5>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                    It may have been deleted or you don&apos;t have access to
                    it.
                </p>
                <Button onClick={goToListe}>Back to vehicles</Button>
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
                Back to vehicles
            </Button>

            <div className="flex flex-col xl:flex-row gap-4 h-full">
                <div className="w-full xl:w-[300px] xl:min-w-[300px]">
                    <CarDetailsInfo
                        car={car}
                        onUpdated={() => setRefreshKey((key) => key + 1)}
                    />
                </div>

                <div className="w-full flex-1 min-w-0">
                    <OverflowTabs
                        tabList={tabList}
                        value={activeTab}
                        onChange={(tab) =>
                            navigate(
                                `${APPS_PREFIX_PATH}/vehicules/${carId}/${tab}`,
                            )
                        }
                    />
                    <div className="mt-4 h-full">
                        <Routes>
                            <Route
                                path="/overview"
                                element={<CarOverview carId={car.id} />}
                            />
                            <Route
                                path="/reservations"
                                element={<CarReservations carId={car.id} />}
                            />
                            <Route
                                path="/expenses"
                                element={<CarExpenses carId={car.id} />}
                            />
                            <Route
                                path="/history"
                                element={<CarHistory carId={car.id} />}
                            />
                            <Route
                                path="*"
                                element={<CarOverview carId={car.id} />}
                            />
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CarDetails
