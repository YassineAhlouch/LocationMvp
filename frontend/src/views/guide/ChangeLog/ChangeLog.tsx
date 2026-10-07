import Container from '@/components/shared/Container'
import type { ReactNode } from 'react'

type Log = {
    version: string
    date: string
    updateContent: string[]
}

type LogProps = Omit<Log, 'updateContent'> & {
    border?: boolean
    children?: ReactNode
}

const logData: Log[] = [
    {
        version: '1.1.2',
        date: '19 Apr 2026',
        updateContent: [
            '[Add] Landing page.',
            '[Fix] Missing ai-init npm script.',
            '[Fix] Dependencies vulnerability.'
        ],
    },
    {
        version: '1.1.1',
        date: '10 Apr 2026',
        updateContent: ['[Fix] Dependencies vulnerability.'],
    },
    {
        version: '1.1.0',
        date: '09 Apr 2026',
        updateContent: [
            '[Update] Dependencies version.',
            '[Fix] Menu css class name typo.',
            '[Fix] Redudant directory in ui components.',
            '[Fix] pwned default demo password.',
        ],
    },
    {
        version: '1.0.0',
        date: '01 Apr 2026',
        updateContent: ['[Release] Initial Release.'],
    },
]

const Log = (props: LogProps) => {
    return (
        <div className={`py-4 ${props.border && 'border-bottom'}`}>
            <div className="flex items-center">
                <h5 className="font-weight-normal mb-0 mr-3">
                    {props.version}
                </h5>
                <code>{props.date}</code>
            </div>
            <div className="api-container p-0 border-0 mt-3">
                {props.children}
            </div>
        </div>
    )
}

const Changelog = () => {
    return (
        <Container>
            <div>
                <h4>Changelog</h4>
                {logData.map((elm) => (
                    <Log
                        key={elm.version}
                        version={`v${elm.version}`}
                        date={elm.date}
                    >
                        {elm.updateContent.length > 0 ? (
                            <ul>
                                {elm.updateContent.map((item, i) => (
                                    <li key={i}>- {item}</li>
                                ))}
                            </ul>
                        ) : null}
                    </Log>
                ))}
            </div>
        </Container>
    )
}

export default Changelog
