import { useNavigate } from 'react-router'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import CarForm from './forms/CarForm'
import useTranslation from '@/utils/hooks/useTranslation'
import { APPS_PREFIX_PATH } from '@/constants/route.constant'

const AjouterVehicule = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const goToListe = () => navigate(`${APPS_PREFIX_PATH}/vehicules/liste`)

    return (
        <Container className="p-4">
            <Card className="rounded-xl">
                <div className="p-4">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold dark:text-gray-100">
                            {t('cars.addPage.title', 'Add a vehicle')}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t(
                                'cars.addPage.subtitle',
                                'Add a new vehicle to the fleet',
                            )}
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
