import classNames from 'classnames'
import { APP_NAME } from '@/constants/app.constant'
import type { CommonProps } from '@/@types/common'

interface LogoProps extends CommonProps {
    type?: 'full' | 'streamline'
    mode?: 'light' | 'dark' | 'system'
    imgClass?: string
    logoWidth?: number | string
}

const LOGO_SRC_PATH = '/img/logo/'

/**
 * Light mode logos are vector (.svg); dark mode logos are still raster (.png).
 */
const LOGO_EXTENSION: Record<'light' | 'dark', 'svg' | 'png'> = {
    light: 'svg',
    dark: 'png',
}

const Logo = (props: LogoProps) => {
    const {
        type = 'full',
        mode = 'light',
        className,
        imgClass,
        style,
        logoWidth = 'auto',
    } = props

    const normalizedMode =
        mode === 'system'
            ? window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light'
            : mode

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
                src={`${LOGO_SRC_PATH}logo-${normalizedMode}-${type}.${LOGO_EXTENSION[normalizedMode]}`}
                alt={`${APP_NAME} logo`}
            />
        </div>
    )
}

export default Logo
