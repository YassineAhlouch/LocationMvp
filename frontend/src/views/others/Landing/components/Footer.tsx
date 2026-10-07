import TextHoverEffect from './TextHoverEffect'
import type { LandingFooter } from '../types'

const Footer = ({ content }: { content: LandingFooter }) => (
    <div className="max-w-7xl mx-auto border-t border-r border-l border-gray-200 dark:border-gray-700">
        <div className="text-center pt-4">{content.copyright}</div>
        <div className="border-gray-200 dark:border-gray-700 relative md:h-[200px] lg:h-[300px] overflow-hidden pt-8 md:pt-20">
            <div className="flex items-center justify-center absolute md:-bottom-[130px] lg:-bottom-[200px] w-full">
                <TextHoverEffect
                    className="scale-150"
                    text={content.brandText}
                />
            </div>
        </div>
    </div>
)

export default Footer
