import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Upload from '@/components/ui/Upload'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import IconFrame from '@/components/shared/IconFrame'
import sleep from '@/utils/sleep'
import { LiDocumentUpload } from '@/icons'

type CSVUploadDialogProps = {
    isOpen: boolean
    onClose: () => void
}

const CSVUploadDialog = ({ isOpen, onClose }: CSVUploadDialogProps) => {
    const [uploading, setUploading] = useState(false)
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)

    const handleFileUpload = (file: File) => {
        if (file) {
            // Validate file type
            if (!file.name.toLowerCase().endsWith('.csv')) {
                console.error('Please upload a CSV file')
                return
            }

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                console.error('File size must be less than 10MB')
                return
            }

            setUploadedFile(file)
        }
    }

    const handleUpload = async () => {
        if (!uploadedFile) {
            console.error('Please select a file to upload')
            return
        }

        setUploading(true)
        try {
            await sleep(1000)
            onClose()
            setUploadedFile(null)
            toast.push(
                <Notification type="success" title="File Uploaded">
                    The file has been uploaded successfully.
                </Notification>,
            )
        } catch (error) {
            console.error('Upload failed:', error)
        } finally {
            setUploading(false)
        }
    }

    const handleClose = () => {
        if (!uploading) {
            setUploadedFile(null)
            onClose()
        }
    }

    return (
        <Dialog isOpen={isOpen} onClose={handleClose}>
            <div>
                <h5>Upload Payroll Data</h5>
                <p className="mb-4">
                    Upload a CSV file containing payroll data.
                </p>
                <Upload
                    draggable
                    multiple={false}
                    accept=".csv"
                    onChange={handleFileUpload}
                >
                    <div className="text-center py-8">
                        <IconFrame className="mb-4 mx-auto">
                            <LiDocumentUpload className="heading-text text-xl" />
                        </IconFrame>
                        <p className="font-medium">
                            Drop your CSV file here, or{' '}
                            <span className="text-primary cursor-pointer">
                                click to browse
                            </span>
                        </p>
                        <p>Supports CSV files up to 10MB</p>
                    </div>
                </Upload>
                <div className="flex items-center justify-end gap-2 mt-4">
                    <Button
                        variant="subtle"
                        onClick={handleClose}
                        disabled={uploading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        onClick={handleUpload}
                        loading={uploading}
                        disabled={!uploadedFile}
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default CSVUploadDialog
