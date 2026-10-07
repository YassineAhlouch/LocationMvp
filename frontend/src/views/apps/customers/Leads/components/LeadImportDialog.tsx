import { useState } from 'react'
import Button from '@/components/ui/Button'
import Upload from '@/components/ui/Upload'
import Dialog from '@/components/ui/Dialog'
import UploadMedia from '@/components/svg/UploadMedia'
import { LiAlertCircle, LiDocumentForward } from '@/icons'
import useResponsive from '@/utils/hooks/useResponsive'
import sleep from '@/utils/sleep'

const LeadImportDialog = () => {
    const { larger } = useResponsive()
    const [importDialogOpen, setImportDialogOpen] = useState(false)
    const [uploading, setUploading] = useState(false)

    const handleBeforeUpload = (files: FileList | null) => {
        let valid: string | boolean = true
        const allowedFileType = [
            'text/csv',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]

        if (files) {
            for (const f of files) {
                if (!allowedFileType.includes(f.type)) {
                    valid = 'Please upload a csv or excel file!'
                }
            }
        }

        return valid
    }

    const handleImport = async () => {
        setUploading(true)
        await sleep(1000)
        setImportDialogOpen(false)
        setUploading(false)
    }

    return (
        <>
            <Button
                icon={<LiDocumentForward />}
                onClick={() => setImportDialogOpen(true)}
            >
                {larger.lg && 'Import Leads'}
            </Button>
            <Dialog
                isOpen={importDialogOpen}
                onClose={() => setImportDialogOpen(false)}
            >
                <h5 className="mb-4">Import Leads</h5>
                <Upload
                    draggable
                    className="mt-6 bg-gray-100 dark:bg-transparent"
                    beforeUpload={handleBeforeUpload}
                    tip={
                        <div className="flex items-center justify-between gap-2 text-xs mt-4">
                            <span className="flex items-center gap-1">
                                <LiAlertCircle />
                                <span>Allowed file types: .csv, .xlsx</span>
                            </span>
                            <span>Max file size: 5MB</span>
                        </div>
                    }
                    accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                >
                    <div className="my-4 text-center">
                        <div className="text-6xl mb-4 flex justify-center">
                            <UploadMedia height={120} width={200} />
                        </div>
                        <p className="font-semibold">
                            <span className="text-gray-800 dark:text-white">
                                Drop your files here, or{' '}
                            </span>
                            <span className="text-blue-500">browse</span>
                        </p>
                        <p className="mt-1 font-semibold opacity-60 dark:text-white">
                            through your machine
                        </p>
                    </div>
                </Upload>
                <div className="mt-4">
                    <Button
                        block
                        variant="solid"
                        loading={uploading}
                        onClick={handleImport}
                    >
                        {uploading ? 'Importing...' : 'Import'}
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

export default LeadImportDialog
