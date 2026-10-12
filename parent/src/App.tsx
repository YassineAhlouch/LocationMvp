import { BrowserRouter } from 'react-router'
import Theme from '@/components/template/Theme'
import Layouts from '@/components/layouts'
import { AuthProvider } from '@/auth'
import Views from '@/views'
import './locales'

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
