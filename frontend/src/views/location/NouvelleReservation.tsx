import { useNavigate } from 'react-router'
import ReservationForm from './forms/ReservationForm'
import { APPS_PREFIX_PATH } from '@/constants/route.constant'

const NouvelleReservation = () => {
    const navigate = useNavigate()
    const goToListe = () => navigate(`${APPS_PREFIX_PATH}/reservations/liste`)

    return (
        <ReservationForm
            reservation={null}
            onCancel={goToListe}
            onSaved={goToListe}
        />
    )
}

export default NouvelleReservation