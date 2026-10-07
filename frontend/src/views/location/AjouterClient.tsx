import { useNavigate } from 'react-router'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import ClientForm from './forms/ClientForm'
import { APPS_PREFIX_PATH } from '@/constants/route.constant'

const AjouterClient = () => {
    const navigate = useNavigate()
    const goToListe = () => navigate(`${APPS_PREFIX_PATH}/clients/liste`)

    return (
        <Container className="p-4">
            <Card className="rounded-xl">
                <div className="p-4">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold dark:text-gray-100">
                            Ajouter un client
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Add a new client
                        </p>
                    </div>
                    <ClientForm
                        client={null}
                        onCancel={goToListe}
                        onSaved={goToListe}
                    />
                </div>
            </Card>
        </Container>
    )
}

export default AjouterClient
