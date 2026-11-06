import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import ConfigProvider from "@/components/ui/ConfigProvider";
import { themeConfig } from "@/configs/theme.config";
import useDarkMode from "@/utils/hooks/useDarkMode";
import useLocale from "@/utils/hooks/useLocale";
import useThemeSchema from "@/utils/hooks/useThemeSchema";
import Landing from "@/views/others/Landing/Landing";
import Contact from "@/views/others/Landing/Contact";

/**
 * SPA routes persist the browser's scroll offset, so e.g. clicking Contact
 * from the bottom of the landing (nav pill, footer CTA) used to open the
 * contact page still scrolled down — jump to the top on every route change
 * instead. Hash links (`/#features`) only change the hash, so they keep
 * relying on the browser's own hash jump.
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

function App() {
    useThemeSchema();
    const [isEnabled] = useDarkMode();
    const { locale, direction } = useLocale();

    return (
        <ConfigProvider
            value={{
                locale,
                ...themeConfig,
                direction,
                mode: isEnabled ? "dark" : "light",
            }}
        >
            <BrowserRouter>
                <ScrollToTop />
                <Routes>
                    {/* dedicated contact page (agency onboarding lead form) */}
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/*" element={<Landing />} />
                </Routes>
            </BrowserRouter>
        </ConfigProvider>
    );
}

export default App;
