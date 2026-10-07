import { BrowserRouter } from 'react-router'
import Theme from '@/components/template/Theme'
import Layouts from '@/components/layouts'
import { AuthProvider } from '@/auth'
import Views from '@/views'
import appConfig from './configs/app.config'
import './locales'

if (appConfig.enableMock) {
    import('./mock')
}

function App() {
    return (
        <Theme>
            <BrowserRouter>
                <AuthProvider>
                    <Layouts>
                        <Views />
                    </Layouts>
                </AuthProvider>
            </BrowserRouter>
        </Theme>
    )
}

export default App
