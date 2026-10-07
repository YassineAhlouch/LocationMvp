import { useState } from 'react'
import Upload from '@/components/ui/Upload'
import classNames from '@/utils/classNames'
import { TbX } from 'react-icons/tb'
import { FcImageFile, FcAudioFile, FcDocument, FcFile } from 'react-icons/fc'

const CustomFileItem = () => {
    const [files, setFiles] = useState<File[]>([
        new File([''], 'Music.mp3', { type: 'audio/mpeg' }),

        new File([''], 'Documnent.txt', { type: 'text/plain' }),
        new File([''], 'Image.png', {
            type: 'image/png',
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
            fileListClass="border border-gray-200 dark:border-gray-600 rounded-lg"
            customFileItem={({ file, index, onRemove }) => {
                const renderIcon = () => {
                    if (
                        file.type === 'image/png' ||
                        file.type === 'image/jpeg'
                    ) {
                        return <FcImageFile />
                    }

                    if (file.type === 'audio/mpeg') {
                        return <FcAudioFile />
                    }

                    if (file.type === 'text/plain') {
                        return <FcDocument />
                    }

                    return (
                        <FcFile className="text-gray-900 dark:text-gray-100" />
                    )
                }

                return (
                    <div
                        className={classNames(
                            'flex items-center justify-between p-4',
                            files.length - 1 !== index &&
                                'border-b border-gray-200 dark:border-gray-600',
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">{renderIcon()}</span>
                            <div className="font-bold heading-text">
                                {file.name}
                            </div>
                        </div>
                        <button className="text-lg" onClick={onRemove}>
                            <TbX />
                        </button>
                    </div>
                )
            }}
        />
    )
}

export default CustomFileItem
