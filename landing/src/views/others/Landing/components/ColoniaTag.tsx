import classNames from '@/utils/classNames'

/**
 * Tag icons extracted from the Colonia template (public/img/landing/tag-*.svg).
 * Each section of the template carries its own 16px glyph; "works" and
 * "transparency" are white variants meant for the orange banners.
 */
export const TAG_ICONS = {
    hero: '/img/landing/tag-hero.svg',
    features: '/img/landing/tag-features.svg',
    values: '/img/landing/tag-values.svg',
    benefits: '/img/landing/tag-benefits.svg',
    resources: '/img/landing/tag-resources.svg',
    works: '/img/landing/tag-works.svg',
    integration: '/img/landing/tag-integration.svg',
    plans: '/img/landing/tag-plans.svg',
    testimonials: '/img/landing/tag-testimonials.svg',
    faq: '/img/landing/tag-faq.svg',
    transparency: '/img/landing/tag-transparency.svg',
    contact: '/img/landing/tag-contact.svg',
} as const

/** Small orange tag icon used in Colonia section/hero tags. */
export const ColoniaTagIcon = ({
    className,
}: {
    className?: string
}) => (
    <svg
        className={classNames('h-4 w-4 shrink-0', className)}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path
            d="M8 0.5L10 5.2L15.5 6L11.8 9.4L13 15L8 12L3 15L4.2 9.4L0.5 6L6 5.2L8 0.5Z"
            fill="#fa7319"
        />
    </svg>
)

export const ColoniaTag = ({
    text,
    className,
    icon,
    iconInvert = true,
}: {
    text: string
    className?: string
    /** Optional template glyph (public/img/landing/tag-*.svg) instead of the star. */
    icon?: string
    /** Grey glyphs need invert() in dark mode; white banner glyphs don't. */
    iconInvert?: boolean
}) => (
    <div className={classNames('col-tag', className)}>
        {icon ? (
            <img
                src={icon}
                alt=""
                aria-hidden="true"
                className={classNames(
                    'h-4 w-4 shrink-0',
                    iconInvert && 'dark:invert dark:opacity-80',
                )}
            />
        ) : (
            <ColoniaTagIcon />
        )}
        <span>{text}</span>
    </div>
)

export const ColoniaSectionHeader = ({
    headings,
    subtext,
    tag,
    tagIcon,
    tagIconInvert,
    className,
    tagClassName,
    headingClassName,
    subtextClassName,
}: {
    headings: string[]
    subtext?: string
    /** Optional small colonia tag row above the heading (template "tag-wrap"). */
    tag?: string
    /** Optional template glyph for the tag (default keeps the orange star). */
    tagIcon?: string
    /** Set false for white glyphs on the orange banners. */
    tagIconInvert?: boolean
    className?: string
    /** Extra classes for the tag text (use to force light text on dark sections). */
    tagClassName?: string
    /** Extra classes for the heading element (use to force light text on dark sections). */
    headingClassName?: string
    /** Extra classes for the subtext paragraph (use to force light text on dark sections). */
    subtextClassName?: string
}) => (
    <div
        className={classNames(
            'flex flex-col items-center text-center gap-3',
            className,
        )}
    >
        {tag ? (
            <ColoniaTag
                text={tag}
                className={tagClassName ?? undefined}
                icon={tagIcon}
                iconInvert={tagIconInvert ?? true}
            />
        ) : null}
        <h3
            className={classNames(
                'col-heading col-h3',
                headingClassName,
            )}
        >
            {headings.map((part, idx) => (
                <span
                    key={idx}
                    className={
                        idx > 0
                            ? 'font-medium text-[#9c9c9c] dark:text-[#8a8a8a]'
                            : undefined
                    }
                >
                    {idx > 0 ? ' ' : undefined}
                    {part}
                </span>
            ))}
        </h3>
        {subtext ? (
            <p
                className={classNames(
                    'col-p2 text-[#5c5c5c] dark:text-[#b3b3b3] max-w-[536px]',
                    subtextClassName,
                )}
            >
                {subtext}
            </p>
        ) : null}
    </div>
)

