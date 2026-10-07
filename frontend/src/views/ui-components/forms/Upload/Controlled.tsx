import { useState } from 'react'
import Upload from '@/components/ui/Upload'

const Controlled = () => {
    const [files, setFiles] = useState<File[]>([
        new File([''], 'PdfFile.pdf', { type: 'application/pdf' }),
        new File([''], 'SomeZipFile.zip', {
            type: 'application/x-zip-compressed',
        }),
    ])

    const handleChange = (file: File, fileList: File[]) => {
        console.log('attached file', file)
        setFiles(fileList)
    }

    const handleRemove = (file: File, fileList: File[]) => {
        console.log('removed file', file)
        setFiles(fileList)
    }

    return (
        <Upload
            fileList={files}
            onChange={handleChange}
            onFileRemove={handleRemove}
        />
    )
}

export default Controlled
