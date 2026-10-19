import { BrowserRouter } from 'react-router'
import ConfigProvider from '@/components/ui/ConfigProvider'
import { themeConfig } from '@/configs/theme.config'
import useDarkMode from '@/utils/hooks/useDarkMode'
import useDirection from '@/utils/hooks/useDirection'
import useThemeSchema from '@/utils/hooks/useThemeSchema'
import Landing from '@/views/others/Landing/Landing'

function App() {
    useThemeSchema()
    const [isEnabled] = useDarkMode()
    const [direction] = useDirection()

    return (
        <ConfigProvider
            value={{
                locale: 'en',
                ...themeConfig,
                direction,
                mode: isEnabled ? 'dark' : 'light',
            }}
        >
            <BrowserRouter>
                <Landing />
            </BrowserRouter>
        </ConfigProvider>
    )
}

export default App
