import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import CarForm from './forms/CarForm'
import { apiGetCar } from '@/services/LocationService'
import { APPS_PREFIX_PATH } from '@/constants/route.constant'
import type { Car } from '@/@types/location'

const EditVehicule = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const goToDetails = () =>
        navigate(`${APPS_PREFIX_PATH}/vehicules/${id}/overview`, {
            replace: true,
        })

    const [car, setCar] = useState<Car | null>(null)
    const [loading, setLoading] = useState(true)
    const [failed, setFailed] = useState(false)

    useEffect(() => {
        if (!id) {
            setFailed(true)
            setLoading(false)
            return
        }
        let active = true
        setLoading(true)
        setFailed(false)
        apiGetCar(Number(id))
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
    }, [id])

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
            </div>
        )
    }

    return (
        <Container className="p-4">
            <Card className="rounded-xl">
                <div className="p-4">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold dark:text-gray-100">
                            Modifier un véhicule
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Update this vehicle&apos;s information
                        </p>
                    </div>
                    <CarForm
                        car={car}
                        onCancel={goToDetails}
                        onSaved={goToDetails}
                    />
                </div>
            </Card>
        </Container>
    )
}

export default EditVehicule
