import { useNavigate } from 'react-router'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import ReservationForm from './forms/ReservationForm'
import { APPS_PREFIX_PATH } from '@/constants/route.constant'

const NouvelleReservation = () => {
    const navigate = useNavigate()
    const goToListe = () => navigate(`${APPS_PREFIX_PATH}/reservations/liste`)

    return (
        <Container className="p-4">
            <Card className="rounded-xl">
                <div className="p-4">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold dark:text-gray-100">
                            Nouvelle réservation
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Create a new reservation
                        </p>
                    </div>
                    <ReservationForm
                        reservation={null}
                        onCancel={goToListe}
                        onSaved={goToListe}
                    />
                </div>
            </Card>
        </Container>
    )
}

export default NouvelleReservation
