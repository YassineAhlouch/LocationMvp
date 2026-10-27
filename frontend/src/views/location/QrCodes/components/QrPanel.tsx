import Button from '@/components/ui/Button'
import { Notification } from '@/components/ui/Notification'
import { toast } from '@/components/ui/toast'
import Tag from '@/components/ui/Tag'
import { LiBarcode, LiCopy, LiDownload } from '@/icons'
import useTranslation from '@/utils/hooks/useTranslation'
import { useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

type QrPanelProps = {
    /** Encoded link; null renders the empty state. */
    value: string | null
    title: string
    /** Hint under the title, e.g. the vehicle count or the poster name. */
    subtitle?: string
    /** Not-yet-saved URL preview; the real link fills in after saving. */
    preview?: boolean
    fileName: string
    emptyText: string
}

/** Size of the rendered QR in px — the same canvas is exported as PNG. */
const QR_SIZE = 288

/**
 * The QR code plus the link it encodes. Download reuses the on-screen canvas
 * so what you see is exactly what lands in the PNG.
 */
const QrPanel = ({
    value,
    title,
    subtitle,
    preview = false,
    fileName,
    emptyText,
}: QrPanelProps) => {
    const { t } = useTranslation()

    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    const handleCopy = async () => {
        if (!value) {
            return
        }

        try {
            await navigator.clipboard.writeText(value)
            toast.push(
                <Notification
                    type="success"
                    title={t('qrCodes.qr.copied', 'Landing link copied')}
                />,
            )
        } catch {
            toast.push(
                <Notification
                    type="danger"
                    title={t('qrCodes.qr.copyFailed', 'Could not copy the link')}
                />,
            )
        }
    }

    const handleDownload = () => {
        const canvas = canvasRef.current

        if (!canvas) {
            return
        }

        const link = document.createElement('a')
        link.download = `${fileName}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
    }

    if (!value) {
        return (
            <div className="flex flex-col items-center gap-3 py-16 text-center text-gray-400 dark:text-gray-500">
                <LiBarcode className="text-4xl" />
                <p className="max-w-[280px]">{emptyText}</p>
            </div>
        )
    }

    return (
        <>
            <div className="flex items-center justify-between gap-3">
                <h5>{title}</h5>
                <Tag
                    className="capitalize"
                    prefix
                    prefixClass={
                        preview ? 'bg-amber-500' : 'bg-emerald-500'
                    }
                >
                    {preview
                        ? t('qrCodes.qr.preview', 'Preview')
                        : t('qrCodes.qr.printed', 'Printed link')}
                </Tag>
            </div>
            {subtitle && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {subtitle}
                </p>
            )}
            <div className="flex flex-col items-center gap-4 py-6">
                <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
                    <QRCodeCanvas
                        ref={canvasRef}
                        value={value}
                        size={QR_SIZE}
                        level="M"
                        marginSize={2}
                        title={title}
                    />
                </div>
                <p className="max-w-full break-all text-center text-sm text-gray-500 dark:text-gray-400">
                    {value}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                    <Button
                        variant="solid"
                        size="sm"
                        icon={<LiDownload />}
                        onClick={handleDownload}
                    >
                        {t('qrCodes.qr.download', 'Download PNG')}
                    </Button>
                    <Button
                        variant="subtle"
                        size="sm"
                        icon={<LiCopy />}
                        onClick={handleCopy}
                    >
                        {t('qrCodes.qr.copyLink', 'Copy link')}
                    </Button>
                </div>
            </div>
        </>
    )
}

export default QrPanel
