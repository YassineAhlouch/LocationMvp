import classNames from 'classnames'
import { APP_NAME } from '@/constants/app.constant'
import type { CommonProps } from '@/@types/common'
import { useThemeStore } from '@/store/themeStore'
import { useEffect, useMemo, useState } from 'react'

interface LogoProps extends CommonProps {
    type?: 'full' | 'streamline'
    mode?: 'light' | 'dark' | 'system'
    imgClass?: string
    logoWidth?: number | string
}

const LOGO_SRC_PATH = '/img/logo/'

const Logo = (props: LogoProps) => {
    const {
        type = 'full',
        mode = 'light',
        className,
        imgClass,
        style,
        logoWidth = 'auto',
    } = props

    const themeSchema = useThemeStore((state) => state.themeSchema)
    const [svgContent, setSvgContent] = useState<string | null>(null)

    const normalizedMode =
        mode === 'system'
            ? window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light'
            : mode

    const logoSrc = useMemo(
        () => `${LOGO_SRC_PATH}logo-${normalizedMode}-${type}.svg`,
        [normalizedMode, type],
    )

    useEffect(() => {
        let cancelled = false
        fetch(logoSrc)
            .then((res) => res.text())
            .then((text) => {
                if (!cancelled) {
                    setSvgContent(text)
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setSvgContent(null)
                }
            })
        return () => {
            cancelled = true
        }
    }, [logoSrc])

    if (svgContent && themeSchema) {
        return (
            <div
                className={classNames('logo', className)}
                style={{
                    ...style,
                    ...{ width: logoWidth },
                }}
            >
                <div
                    className={classNames('logo-colored', imgClass)}
                    style={{
                        width: logoWidth === 'auto' ? '100%' : logoWidth,
                        height: logoWidth === 'auto' ? '100%' : 'auto',
                        backgroundColor: 'var(--primary)',
                        WebkitMaskImage: `url(${logoSrc})`,
                        maskImage: `url(${logoSrc})`,
                        WebkitMaskSize: 'contain',
                        maskSize: 'contain',
                        WebkitMaskRepeat: 'no-repeat',
                        maskRepeat: 'no-repeat',
                        WebkitMaskPosition: 'center',
                        maskPosition: 'center',
                    }}
                    aria-label={`${APP_NAME} logo`}
                />
            </div>
        )
    }

    return (
        <div
            className={classNames('logo', className)}
            style={{
                ...style,
                ...{ width: logoWidth },
            }}
        >
            <img
                className={imgClass}
                src={logoSrc}
                alt={`${APP_NAME} logo`}
            />
        </div>
    )
}

export default Logo
