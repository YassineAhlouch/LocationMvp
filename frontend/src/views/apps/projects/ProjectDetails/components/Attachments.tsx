import Button from '@/components/ui/Button'
import EmptyState from '@/components/shared/EmptyState'
import IconFrame from '@/components/shared/IconFrame'
import FileIcon from '@/components/shared/FileIcon'
import { LiPaperclip, LiDownload } from '@/icons'
import type { Attachment } from '../types'

type AttachmentsProps = {
    data: Array<Attachment>
}

const Attachments = ({ data }: AttachmentsProps) => {
    return (
        <div>
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-800">
                {data.map((attachment) => (
                    <div
                        key={attachment.id}
                        className="flex justify-between items-center px-4 py-2"
                    >
                        <div className="flex items-center gap-2">
                            <FileIcon type={attachment.type} size={25} />
                            <div className="heading-text font-medium">
                                {attachment.name}
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                icon={<LiDownload />}
                            />
                        </div>
                    </div>
                ))}
            </div>
            {data.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center mb-6">
                    <EmptyState
                        variant="dots"
                        size={180}
                        offset={-40}
                        illustration={
                            <IconFrame>
                                <LiPaperclip className="text-xl heading-text" />
                            </IconFrame>
                        }
                    >
                        <div className="text-center">
                            <h5>No attachments</h5>
                        </div>
                    </EmptyState>
                </div>
            )}
        </div>
    )
}

export default Attachments
