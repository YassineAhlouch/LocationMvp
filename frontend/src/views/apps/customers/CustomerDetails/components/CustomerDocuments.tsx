import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Loading from '@/components/shared/Loading'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import FileIcon from '@/components/shared/FileIcon'
import classNames from '@/utils/classNames'
import { apiGetCustomerDocuments } from '@/services/CustomersService'
import { LuDownload, LuTrash } from 'react-icons/lu'
import useSWR from 'swr'

export type CustomerDocumentsProps = {
    customerId: string
}

type Documents = Record<
    string,
    Array<{
        id: string
        name: string
        type: string
        size: string
        uploadedBy: string
        uploadedByAvatar: string
        uploadedByInitials: string
        uploadedDate: string
        relativeTime: string
        status: string
        amount: string
        expiryDate: string
    }>
>

const CustomerDocuments = ({ customerId }: CustomerDocumentsProps) => {
    const [fileToDelete, setFileToDelete] = useState<[string, string] | null>(
        null,
    )

    const { data, isLoading, mutate } = useSWR(
        ['/api/customers/documents', { id: customerId }],
        ([, params]) =>
            apiGetCustomerDocuments<Documents, { id: string }>(params),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            evalidateOnFocus: false,
        },
    )

    const handleDelete = (keySet: [string, string]) => {
        setFileToDelete(keySet)
    }

    const handleConfirm = () => {
        if (fileToDelete && data) {
            mutate(
                {
                    ...data,
                    [fileToDelete[0]]: data[fileToDelete[0]].filter(
                        (file) => file.id !== fileToDelete[1],
                    ),
                },
                false,
            )
            setFileToDelete(null)
        }
    }

    return (
        <>
            <Loading loading={isLoading}>
                <div className="flex flex-col gap-6">
                    {data &&
                        Object.entries(data).map(([key, value]) => (
                            <div key={key}>
                                <h5 className="capitalize mb-2">{key}</h5>
                                <Card bodyClass="p-0">
                                    {value.map((document, index) => (
                                        <div
                                            key={document.id}
                                            className={classNames(
                                                'flex items-center justify-between gap-2 p-4 border-b border-gray-200 dark:border-gray-700 last:border-0',
                                                index !== 0 && 'pt-4',
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center justify-center">
                                                    <FileIcon
                                                        type={document.type}
                                                    />
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <a
                                                            href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                                                            target="_blank"
                                                            className="font-semibold heading-text hover:underline"
                                                        >
                                                            {document.name}
                                                        </a>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                                        <span>
                                                            {
                                                                document.relativeTime
                                                            }
                                                        </span>
                                                        <span>•</span>
                                                        <span>
                                                            {document.size}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={<LuDownload />}
                                                    title="Download"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    icon={
                                                        <LuTrash
                                                            className="text-error"
                                                            title="Delete"
                                                        />
                                                    }
                                                    onClick={() =>
                                                        handleDelete([
                                                            key,
                                                            document.id,
                                                        ])
                                                    }
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </Card>
                            </div>
                        ))}
                </div>
            </Loading>
            <ConfirmDialog
                isOpen={fileToDelete !== null}
                type="danger"
                title="Generate new content?"
                onClose={() => setFileToDelete(null)}
                onCancel={() => setFileToDelete(null)}
                onConfirm={handleConfirm}
            >
                <p>
                    {' '}
                    Are you sure you want to delete this document? This action
                    can&apos;t be undo.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default CustomerDocuments
