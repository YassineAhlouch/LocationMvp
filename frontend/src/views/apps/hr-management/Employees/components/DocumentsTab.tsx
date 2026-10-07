import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import FileIcon from '@/components/shared/FileIcon'
import EmptyState from '@/components/shared/EmptyState'
import IconFrame from '@/components/shared/IconFrame'
import { LiImport, LiDocumentDownload } from '@/icons'
import { formatDate } from '@/utils/formatDate'
import type { Employee, EmployeeDocument } from '../types'

type DocumentsTabProps = {
    employee: Employee
}

const DocumentsTab = ({ employee }: DocumentsTabProps) => {
    const documents = employee.documents || []
    const handleDownload = (document: EmployeeDocument) => {
        const link = window.document.createElement('a')
        link.href = document.url
        link.download = document.name
        link.click()
    }

    const getFileIcon = (type: string) => {
        if (type.includes('pdf')) return <FileIcon type="pdf" size={25} />
        if (type.includes('image')) return <FileIcon type="jpg" size={25} />
        if (type.includes('word') || type.includes('document'))
            return <FileIcon type="docx" size={25} />
        if (type.includes('excel') || type.includes('spreadsheet'))
            return <FileIcon type="xlsx" size={25} />
        return '📎'
    }

    return (
        <div className="py-4 space-y-4">
            {documents.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center my-8">
                    <EmptyState
                        variant="dots"
                        offset={-10}
                        size={200}
                        illustration={
                            <IconFrame size={72}>
                                <LiDocumentDownload className="text-xl heading-text" />
                            </IconFrame>
                        }
                    >
                        <div className="text-center">
                            <h5>No documents uploaded</h5>
                        </div>
                    </EmptyState>
                </div>
            ) : (
                <div>
                    <Card bodyClass="p-0 divide-y divide-gray-200 dark:divide-gray-700">
                        {documents.map((document) => (
                            <div
                                key={document.id}
                                className="flex items-center justify-between px-4 py-2"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="text-2xl">
                                        {getFileIcon(document.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium heading-text truncate">
                                            {document.name}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                            <span>
                                                Uploaded{' '}
                                                {formatDate(
                                                    document.uploadedAt,
                                                )}
                                            </span>
                                            <span>
                                                by {document.uploadedBy}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDownload(document)}
                                    icon={<LiImport />}
                                />
                            </div>
                        ))}
                    </Card>
                </div>
            )}
        </div>
    )
}

export default DocumentsTab
