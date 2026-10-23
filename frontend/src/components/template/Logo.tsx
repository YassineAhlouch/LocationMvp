import classNames from 'classnames'
import { APP_NAME } from '@/constants/app.constant'
import type { CommonProps } from '@/@types/common'
import { useThemeStore } from '@/store/themeStore'
import { useMemo } from 'react'

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

    const useColored = Boolean(themeSchema && themeSchema !== 'default' && themeSchema !== '')

    if (useColored && type === 'streamline') {
        return (
            <div
                className={classNames('logo flex items-center justify-center', className)}
                style={{
                    ...style,
                    width: logoWidth,
                    height: '32px',
                }}
            >
                <div
                    className={classNames(imgClass)}
                    style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: 'var(--primary)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <img
                        src={logoSrc}
                        alt={`${APP_NAME} logo`}
                        style={{ width: '32px', height: '32px' }}
                    />
                </div>
            </div>
        )
    }

    if (useColored) {
        return (
            <div
                className={classNames('logo', className)}
                style={{
                    ...style,
                    width: logoWidth,
                }}
            >
                <div
                    className={classNames(imgClass)}
                    style={{
                        width: '100%',
                        height: type === 'streamline' ? '32px' : 'auto',
                        minHeight: type === 'streamline' ? '32px' : '32px',
                        aspectRatio: type === 'streamline' ? '1 / 1' : undefined,
                        backgroundColor: 'var(--primary)',
                        WebkitMaskImage: `url(${logoSrc})`,
                        maskImage: `url(${logoSrc})`,
                        WebkitMaskSize: 'contain',
                        maskSize: 'contain',
                        WebkitMaskRepeat: 'no-repeat',
                        maskRepeat: 'no-repeat',
                        WebkitMaskPosition: type === 'streamline' ? 'center' : 'left center',
                        maskPosition: type === 'streamline' ? 'center' : 'left center',
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
