/**
 * Hero dot-grid backdrop, same visual as the marketing landing hero.
 */
const DottedBackdrop = () => (
    <svg
        width="100%"
        height="100%"
        className="absolute inset-0 text-gray-300 mask-b-from-80% mask-t-from-50%"
        aria-hidden="true"
    >
        <defs>
            <pattern
                id="qrpage-hero-dots"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
            >
                <rect
                    x="5.5"
                    y="5.5"
                    width="1"
                    height="1"
                    fill="currentColor"
                />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#qrpage-hero-dots)" />
    </svg>
)

export default DottedBackdrop
