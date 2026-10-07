import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import classNames from '@/utils/classNames'

const TextHoverEffect = ({
    text,
    duration,
    className,
}: {
    text: string
    duration?: number
    automatic?: boolean
    className?: string
}) => {
    const svgRef = useRef<SVGSVGElement>(null)
    const [hovered, setHovered] = useState(false)
    const [maskPosition, setMaskPosition] = useState({ cx: '50%', cy: '50%' })

    return (
        <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox="0 0 300 100"
            xmlns="http://www.w3.org/2000/svg"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                setMaskPosition({
                    cx: `${((e.clientX - rect.left) / rect.width) * 100}%`,
                    cy: `${((e.clientY - rect.top) / rect.height) * 100}%`,
                })
            }}
            className={classNames('select-none', className)}
        >
            <defs>
                <linearGradient
                    id="textGradient"
                    gradientUnits="userSpaceOnUse"
                    cx="50%"
                    cy="50%"
                    r="25%"
                >
                    {hovered && (
                        <>
                            <stop offset="0%" stopColor="#3c5de5" />
                            <stop offset="100%" stopColor="#3c5de5" />
                        </>
                    )}
                </linearGradient>

                <motion.radialGradient
                    id="revealMask"
                    gradientUnits="userSpaceOnUse"
                    r="20%"
                    initial={{ cx: '50%', cy: '50%' }}
                    animate={maskPosition}
                    transition={{ duration: duration ?? 0, ease: 'easeOut' }}
                >
                    <stop offset="0%" stopColor="white" />
                    <stop offset="100%" stopColor="black" />
                </motion.radialGradient>
                <mask id="textMask">
                    <rect
                        x="0"
                        y="0"
                        width="100%"
                        height="100%"
                        fill="url(#revealMask)"
                    />
                </mask>
            </defs>
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                strokeWidth="0.3"
                className="fill-transparent stroke-gray-200 font-[helvetica] text-5xl font-bold dark:stroke-gray-700"
                style={{ opacity: hovered ? 0.7 : 0 }}
            >
                {text}
            </text>
            <motion.text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                strokeWidth="0.3"
                className="fill-transparent stroke-gray-200 font-[helvetica] text-5xl font-bold dark:stroke-gray-700"
                initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
                animate={{ strokeDashoffset: 0, strokeDasharray: 1000 }}
                transition={{ duration: 4, ease: 'easeInOut' }}
            >
                {text}
            </motion.text>
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                stroke="url(#textGradient)"
                strokeWidth="0.3"
                mask="url(#textMask)"
                className="fill-transparent font-[helvetica] text-5xl font-bold"
            >
                {text}
            </text>
        </svg>
    )
}

export default TextHoverEffect
