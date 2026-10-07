import { useEffect, useRef } from 'react'
import Card from '@/components/ui/Card'
import CardFooter from './CardFooter'
import ReactHtmlParser from 'html-react-parser'
import { useLocation } from 'react-router'
import type { ReactNode } from 'react'
import type { CardFooterProps } from './CardFooter'
import classNames from '@/utils/classNames'

export interface DemoCardProps extends CardFooterProps {
    demoComponent?: ReactNode
    id?: string
    title?: string
    desc?: string
    hideFooter?: boolean
    cardClass?: string
}

const DemoCard = (props: DemoCardProps) => {
    const {
        demoComponent,
        id,
        title,
        desc = '',
        hideFooter,
        cardClass,
        ...rest
    } = props

    const location = useLocation()
    const lastHash = useRef('')

    useEffect(() => {
        if (location.hash) {
            lastHash.current = location.hash.slice(1)
        }

        if (lastHash.current && document.getElementById(lastHash.current)) {
            setTimeout(() => {
                document
                    .getElementById(lastHash.current)
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                lastHash.current = ''
            }, 100)
        }
    }, [location])

    return (
        <div className="demo-card py-4" id={id}>
            <div className="mb-4">
                <h4>{title}</h4>
                {desc && (
                    <div className="mt-1 demo-card-description">
                        {ReactHtmlParser(desc)}
                    </div>
                )}
            </div>
            <Card
                className="bg-gray-50 dark:bg-gray-700/60"
                bodyClass={classNames(
                    'bg-white dark:bg-gray-800 rounded-lg mt-1 mx-1',
                    cardClass,
                )}
                footer={{
                    content: !hideFooter && <CardFooter {...rest} />,
                    className:
                        'bg-gray-50 dark:bg-gray-700/60 pb-2 pt-2 rounded-b-lg border-0',
                }}
            >
                {demoComponent}
            </Card>
        </div>
    )
}

export default DemoCard
