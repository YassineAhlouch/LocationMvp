import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import ReservationForm from './forms/ReservationForm'
import ReservationHistory from './ReservationHistory'
import { apiGetReservation } from '@/services/LocationService'
import { APPS_PREFIX_PATH } from '@/constants/route.constant'
import type { Reservation } from '@/@types/location'

const EditReservation = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const goToListe = () => navigate(`${APPS_PREFIX_PATH}/reservations/liste`)

    const [reservation, setReservation] = useState<Reservation | null>(null)
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
        setReservation(null)
        apiGetReservation(Number(id))
            .then((res) => {
                if (active) {
                    setReservation(res)
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

    if (failed || !reservation) {
        return (
            <Container className="p-4">
                <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
                    <h5 className="dark:text-gray-100">
                        Reservation not found
                    </h5>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        It may have been deleted or you don't have access to
                        it.
                    </p>
                    <Button onClick={goToListe}>
                        Back to reservations
                    </Button>
                </div>
            </Container>
        )
    }

    return (
        <ReservationForm
            reservation={reservation}
            isOpen
            onCancel={goToListe}
            onSaved={goToListe}
            sidebar={<ReservationHistory reservationId={reservation.id} />}
        />
    )
}

export default EditReservation