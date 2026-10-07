import { useState } from 'react'
import Upload from '@/components/ui/Upload'
import Progress from '@/components/ui/Progress'
import Spinner from '@/components/ui/Spinner'
import fileSizeUnit from '@/utils/fileSizeUnit'
import axios from 'axios'
import { TbTrash, TbCircleCheckFilled, TbCircleXFilled } from 'react-icons/tb'

const Async = () => {
    const [files, setFiles] = useState<File[]>([])

    const [progressStatus, setProgressStatus] = useState<
        Array<{
            file: File
            percent: number
            status: 'ready' | 'uploading' | 'success' | 'error'
            deleting?: boolean
        }>
    >([])

    const handleUpload = async (file: File, fileList: File[]) => {
        setFiles(fileList)

        setProgressStatus([
            ...progressStatus,
            {
                file,
                percent: 0,
                status: 'ready',
            },
        ])

        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await axios.post(
                'https://httpbin.org/post',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (progressEvent) => {
                        const { loaded, total } = progressEvent
                        if (total) {
                            const percentCompleted = Math.round(
                                (loaded * 100) / total,
                            )
                            setProgressStatus([
                                ...progressStatus,
                                {
                                    file,
                                    percent: percentCompleted,
                                    status:
                                        percentCompleted === 100
                                            ? 'success'
                                            : 'uploading',
                                },
                            ])
                        }
                    },
                },
            )
            window.alert(response.data)
        } catch (error) {
            console.error(error)
            setProgressStatus([
                ...progressStatus,
                {
                    file,
                    percent: 0,
                    status: 'error',
                },
            ])
        }
    }

    const handleRemove = async (file: File, fileList: File[]) => {
        setProgressStatus((previos) =>
            previos.map((progress) => {
                if (progress.file === file) {
                    return {
                        ...progress,
                        deleting: true,
                    }
                }
                return progress
            }),
        )

        try {
            await axios.delete('https://httpbin.org/delete', {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
        } catch (error) {
            console.error(error)
        } finally {
            setFiles(fileList)
            setProgressStatus((previos) =>
                previos.map((progress) => {
                    if (progress.file === file) {
                        return {
                            ...progress,
                            deleting: false,
                        }
                    }
                    return progress
                }),
            )
        }
    }

    return (
        <div>
            <Upload
                fileList={files}
                onChange={handleUpload}
                onFileRemove={handleRemove}
                customFileItem={({ file, onRemove, FileIcon }) => {
                    const progress = progressStatus.find(
                        (progress) => progress.file === file,
                    ) || {
                        percent: 0,
                        status: 'ready',
                        deleting: false,
                    }

                    const getStrokeClass = () => {
                        if (progress?.status === 'success') {
                            return 'bg-success'
                        }
                        if (progress?.status === 'error') {
                            return 'bg-error'
                        }

                        return ''
                    }

                    return (
                        <div className="upload-file">
                            <div className="upload-file-wrapper">
                                <div className="upload-file-info-wrapper">
                                    <div className="upload-file-thumbnail">
                                        {<FileIcon file={file} />}
                                    </div>
                                    <div className="upload-file-info">
                                        <h6 className="upload-file-name">
                                            {file.name}
                                        </h6>
                                        {progress.status === 'error' ? (
                                            <span className="upload-file-size text-error">
                                                Failed to upload
                                            </span>
                                        ) : (
                                            <span className="upload-file-size">
                                                {fileSizeUnit(file.size)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="px-4 flex items-center gap-3">
                                    {progress.status === 'success' && (
                                        <TbCircleCheckFilled className="text-success text-xl" />
                                    )}
                                    {progress.status === 'error' && (
                                        <TbCircleXFilled className="text-error text-xl" />
                                    )}
                                    {progress.deleting ? (
                                        <Spinner size={20} />
                                    ) : (
                                        <button
                                            className="text-xl"
                                            onClick={onRemove}
                                        >
                                            <TbTrash />
                                        </button>
                                    )}
                                </div>
                            </div>
                            {progress.status === 'uploading' && (
                                <div className="mb-3 px-2">
                                    <Progress
                                        size="sm"
                                        percent={progress.percent}
                                        strokeWidth={4}
                                        strokeClass={getStrokeClass()}
                                    />
                                </div>
                            )}
                        </div>
                    )
                }}
            />
        </div>
    )
}

export default Async
