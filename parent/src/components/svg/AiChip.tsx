import { SvgProps } from '@/@types/common'
const AiChip = ({ height = 100, width = 100, ...rest }: SvgProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 132 132"
            width={width}
            height={height}
            {...rest}
        >
            <path
                d="M103.556 103.556C97.1129 110 86.7416 110 66 110C45.2582 110 34.8873 110 28.4436 103.556C22 97.1129 22 86.7416 22 66C22 45.2582 22 34.8873 28.4436 28.4436C34.8873 22 45.2582 22 66 22C86.7416 22 97.1129 22 103.556 28.4436C110 34.8873 110 45.2582 110 66C110 86.7416 110 97.1129 103.556 103.556Z"
                className="stroke-6 stroke-gray-900 dark:stroke-gray-100 fill-transparent"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M44 11V22M88 11V22M66 11V22M44 110V121M66 110V121M88 110V121M121 88H110M22 44H11M22 88H11M22 66H11M121 44H110M121 66H110"
                className="stroke-6 stroke-gray-900 dark:stroke-gray-100 fill-transparent"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M41.25 79.7494L51.3804 49.3582C51.8997 47.8002 53.3577 46.7493 55 46.7493C56.6423 46.7493 58.1004 47.8002 58.6196 49.3582L68.75 79.7494M85.25 46.7493V79.7494M46.75 68.7494H63.25"
                className="stroke-6 stroke-gray-900 dark:stroke-gray-100 fill-transparent"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}
export default AiChip
