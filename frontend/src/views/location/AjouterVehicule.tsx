import { useNavigate } from 'react-router'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import CarForm from './forms/CarForm'
import { APPS_PREFIX_PATH } from '@/constants/route.constant'

const AjouterVehicule = () => {
    const navigate = useNavigate()
    const goToListe = () => navigate(`${APPS_PREFIX_PATH}/vehicules/liste`)

    return (
        <Container className="p-4">
            <Card className="rounded-xl">
                <div className="p-4">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold dark:text-gray-100">
                            Ajouter un véhicule
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Add a new vehicle to the fleet
                        </p>
                    </div>
                    <CarForm
                        car={null}
                        onCancel={goToListe}
                        onSaved={goToListe}
                    />
                </div>
            </Card>
        </Container>
    )
}

export default AjouterVehicule
