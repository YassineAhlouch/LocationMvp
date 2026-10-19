import { BrowserRouter } from 'react-router'
import ConfigProvider from '@/components/ui/ConfigProvider'
import { themeConfig } from '@/configs/theme.config'
import useDarkMode from '@/utils/hooks/useDarkMode'
import useLocale from '@/utils/hooks/useLocale'
import useThemeSchema from '@/utils/hooks/useThemeSchema'
import Landing from '@/views/others/Landing/Landing'

function App() {
    useThemeSchema()
    const [isEnabled] = useDarkMode()
    const { locale, direction } = useLocale()

    return (
        <ConfigProvider
            value={{
                locale,
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
