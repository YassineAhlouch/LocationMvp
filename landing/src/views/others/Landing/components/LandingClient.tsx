import { useThemeStore } from "@/store/themeStore";
import useLocale from "@/utils/hooks/useLocale";
import Navigation from "./NavigationBar";
import HeroContent from "./HeroContent";
import Modules from "./Modules";
import Statistics from "./Statistics";
import ClearView from "./ClearView";
import Profitability from "./Profitability";
import ImpactTracking from "./ImpactTracking";
import Workflow from "./Workflow";
import Integration from "./Integration";
import Pricing from "./Pricing";
import Testimonials from "./Testimonials";
import Faq from "./Faq";
import Transparency from "./Transparency";
import Footer from "./Footer";
import type { Tab } from "./NavList";
import type { LandingPageContent } from "../types";

type Props = { content: LandingPageContent };

/**
 * Section order mirrors the Colonia template:
 * hero → features → values/statistics → benefits → resources →
 * works → integration → plans → testimonials → faq → footer,
 * with the app-specific clear-view module pile right after the values area.
 */ export default function LandingClient({ content }: Props) {
    const mode = useThemeStore((t) => t.mode);
    const setMode = useThemeStore((t) => t.setMode);
    const { direction } = useLocale();

    const resolvedMode =
        mode === "system"
            ? ((window.matchMedia("(prefers-color-scheme: dark)").matches
                  ? "dark"
                  : "light") as "dark" | "light")
            : (mode as "dark" | "light");

    const navMenu: Tab[] = content.nav.items.map((item) =>
        item.route
            ? { title: item.title, value: item.value, route: item.route }
            : {
                  title: item.title,
                  value: item.value,
                  to: item.anchor ?? item.value,
              },
    );

    return (
        <main className="colonia-root bg-white dark:bg-gray-900">
            <Navigation
                toggleMode={() =>
                    setMode(resolvedMode === "light" ? "dark" : "light")
                }
                mode={resolvedMode}
                navMenu={navMenu}
                direction={direction}
                /* every home-page CTA funnels to the dedicated contact page */
                ctaRoute="/contact"
            />
            <HeroContent content={content.hero} />
            {/* features-v1 */}
            <Modules content={content.modules} />
            {/* values (statistics) */}
            <Statistics content={content} />
            {/* clear view (app-specific): module showcase pile */}
            <ClearView content={content.clearView} />
            {/* benefits */}
            <Profitability content={content.profitability} />
            {/* resources: sustainable resources / impact tracking */}
            <ImpactTracking content={content.impactTracking} />
            {/* works: dark-orange stacked step cards */}
            <Workflow content={content.workflow} />
            {/* integration: seamless integrations (template's partner diagram) */}
            <Integration content={content.integration} />
            {/* transparency: full transparency / data visibility banner
                (the template places it directly after integration) */}
            <Transparency content={content.transparency} />
            {/* plans-v1: pick your perfect plan
                (the template places plans directly after transparency) */}
            <Pricing content={content.pricing} />
            {/* testimonials */}
            <Testimonials content={content.testimonials} />
            {/* faq */}
            <Faq content={content} />
            {/* the footer's CTA pill funnels to the contact page too */}
            <Footer content={content.footer} ctaRoute="/contact" />
        </main>
    );
}
