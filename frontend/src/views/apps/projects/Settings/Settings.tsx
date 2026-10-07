import Container from '@/components/shared/Container'
import SettingsContent from './components/SettingsContent'
import SettingsMenu from './components/SettingsMenu'

const Settings = () => {
    return (
        <Container size="md">
            <div className="flex gap-2">
                <div className="hidden lg:block">
                    <SettingsMenu />
                </div>
                <SettingsContent />
            </div>
        </Container>
    )
}

export default Settings
