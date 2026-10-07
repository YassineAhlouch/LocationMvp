import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Tooltip from '@/components/ui/Tooltip'
import Alert from '@/components/ui/Alert'
import Switcher from '@/components/ui/Switcher'
import Collapsible from '@/components/ui/Collapsible'
import NewApiKeyDialog from './NewApiKeyDialog'
import IpWhitelistingDialog from './IpWhitelistingDialog'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import SettingsHeader from './SettingsHeader'
import useProjectSettingData from '../hooks/useProjectSettingData'
import classNames from '@/utils/classNames'
import sleep from '@/utils/sleep'
import { LiEye, LiEyeSlash, LiCopy, LiTick, LiAdd } from '@/icons'
import dayjs from 'dayjs'
import type { ApiKey, WhiteList } from '../types'

type ApiKeyInfoProps = {
    data: ApiKey
    onDelete: () => void
}

type WhiteListInfoProps = {
    data: WhiteList
    onDelete: () => void
    onConfig: () => void
}

const ApiKeyInfo = ({ data, onDelete }: ApiKeyInfoProps) => {
    const [retrieveLoading, setRetrieveLoading] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const [visible, setVisible] = useState(false)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if (copied) {
            navigator.clipboard.writeText(data.token)
            if (copied) {
                const copyFeedbackInterval = setTimeout(
                    () => setCopied(false),
                    3000,
                )

                return () => {
                    clearTimeout(copyFeedbackInterval)
                }
            }
        }
    }, [copied, data.token])

    const handleRetrieve = async () => {
        setRetrieveLoading(true)
        await sleep(1000) // Simulate API call delay
        setRetrieveLoading(false)
        setExpanded(true)
    }

    const handleCodeCopy = async () => {
        setCopied(true)
    }

    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="font-semibold heading-text">
                        {data.name}
                    </div>
                    <div className="text-xs">
                        {data.lastUsedAt
                            ? `Last used at: ${dayjs(data.lastUsedAt).format('d, MMM DD YYYY')}`
                            : 'Never used'}
                        {' • '}
                        {data.expiresAt
                            ? `Expires at: ${dayjs(data.expiresAt).format('d, MMM DD YYYY')}`
                            : 'Never expires'}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {!expanded && (
                        <Button
                            loading={retrieveLoading}
                            onClick={handleRetrieve}
                        >
                            Retrieve Key
                        </Button>
                    )}
                    <Button
                        variant="subtle"
                        onClick={onDelete}
                        className={({ active, unclickable }) =>
                            classNames(
                                'text-error border border-gray-300 dark:border-gray-500',
                                active ? '' : 'bg-gray-100 dark:bg-gray-600',
                                unclickable && 'opacity-50 cursor-not-allowed',
                                !active &&
                                    !unclickable &&
                                    'hover:bg-gray-200 hover:dark:bg-gray-500',
                            )
                        }
                    >
                        Delete
                    </Button>
                </div>
            </div>
            <Collapsible open={expanded}>
                <Collapsible.Content>
                    <div className="mt-4">
                        <Input
                            value={
                                visible
                                    ? data.token
                                    : `${data.token.slice(0, 4)}******${data.token.slice(-4)}`
                            }
                            readOnly
                            className="w-full"
                            suffix={
                                <span className="flex items-center">
                                    <Tooltip
                                        title={
                                            visible
                                                ? 'Hide Token'
                                                : 'Show Token'
                                        }
                                        placement="top"
                                    >
                                        <Button
                                            variant="link"
                                            onClick={() => setVisible(!visible)}
                                            icon={
                                                visible ? (
                                                    <LiEyeSlash className="text-lg" />
                                                ) : (
                                                    <LiEye className="text-lg" />
                                                )
                                            }
                                        />
                                    </Tooltip>
                                    <Tooltip
                                        title={copied ? 'Copied' : 'Copy'}
                                        placement="top"
                                    >
                                        <Button
                                            variant="link"
                                            onClick={handleCodeCopy}
                                            icon={
                                                copied ? (
                                                    <LiTick className="text-lg" />
                                                ) : (
                                                    <LiCopy className="text-lg" />
                                                )
                                            }
                                        />
                                    </Tooltip>
                                </span>
                            }
                        />
                    </div>
                </Collapsible.Content>
            </Collapsible>
        </div>
    )
}

const WhiteListInfo = ({ data, onDelete, onConfig }: WhiteListInfoProps) => {
    return (
        <div className="p-4">
            <div className="flex items-center justify-between">
                <div>
                    <div className="font-semibold heading-text">
                        {data.label}
                    </div>
                    <div className="text-xs">{data.ip}</div>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={onConfig}>Config</Button>
                    <Button
                        variant="subtle"
                        onClick={onDelete}
                        className={({ active, unclickable }) =>
                            classNames(
                                'text-error border border-gray-300 dark:border-gray-500',
                                active ? '' : 'bg-gray-100 dark:bg-gray-600',
                                unclickable && 'opacity-50 cursor-not-allowed',
                                !active &&
                                    !unclickable &&
                                    'hover:bg-gray-200 hover:dark:bg-gray-500',
                            )
                        }
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    )
}

const Security = () => {
    const { data, setData } = useProjectSettingData()

    const [deleteApiKeyDialog, setDeleteApiKeyDialog] = useState({
        open: false,
        selectedKeyId: '',
    })

    const [deleteWhiteListDialog, setDeleteWhiteListDialog] = useState({
        open: false,
        selectedKeyId: '',
    })

    const [confiWhitelistingDialog, setConfigWhitelistingDialog] = useState<{
        open: boolean
        type: 'add' | 'edit' | ''
        selectedIp: WhiteList | null
    }>({
        open: false,
        selectedIp: null,
        type: '',
    })

    const [deleteApiKeyLoading, setDeleteApiKeyLoading] = useState(false)

    const handleDeleteApiKeyDialogClose = () => {
        setDeleteApiKeyDialog({
            open: false,
            selectedKeyId: '',
        })
    }

    const handleDeleteWhiteListDialogClose = () => {
        setDeleteWhiteListDialog({
            open: false,
            selectedKeyId: '',
        })
    }

    const handleDeleteApiKeyConfirm = async () => {
        setDeleteApiKeyLoading(true)
        await sleep(1000) // Simulate API call delay
        setData((prevData) => {
            const updatedApiKeys = prevData.security.apiKeys.filter(
                (key) => key.id !== deleteApiKeyDialog.selectedKeyId,
            )
            return {
                ...prevData,
                security: {
                    ...prevData.security,
                    apiKeys: updatedApiKeys,
                },
            }
        })
        setDeleteApiKeyLoading(false)
        handleDeleteApiKeyDialogClose()
    }

    const handleDeleteWhiteListConfirm = async () => {
        setDeleteApiKeyLoading(true)
        await sleep(1000) // Simulate API call delay
        setData((prevData) => {
            const updatedWhiteList = prevData.security.whiteList.list.filter(
                (key) => key.id !== deleteWhiteListDialog.selectedKeyId,
            )
            return {
                ...prevData,
                security: {
                    ...prevData.security,
                    whiteList: {
                        ...prevData.security.whiteList,
                        list: updatedWhiteList,
                    },
                },
            }
        })
        setDeleteApiKeyLoading(false)
        handleDeleteWhiteListDialogClose()
    }

    const handleCreateNewApiKey = () => {
        const callback = async (payload: ApiKey) => {
            await sleep(1000)
            setData((prevData) => ({
                ...prevData,
                security: {
                    ...prevData.security,
                    apiKeys: [...prevData.security.apiKeys, payload],
                },
            }))
        }

        return callback
    }

    const handleWhiteListToggle = (checked: boolean) => {
        setData((prevData) => ({
            ...prevData,
            security: {
                ...prevData.security,
                whiteList: {
                    ...prevData.security.whiteList,
                    enabled: checked,
                },
            },
        }))
    }

    const handleUpateWhiteList = () => {
        const callback = async (payload: WhiteList) => {
            await sleep(1000)
            setData((prevData) => ({
                ...prevData,
                security: {
                    ...prevData.security,
                    whiteList: {
                        ...prevData.security.whiteList,
                        list: [
                            ...prevData.security.whiteList.list.filter(
                                (item) => item.id !== payload.id,
                            ),
                            payload,
                        ],
                    },
                },
            }))
        }
        return callback
    }

    const handleAddNewWhiteList = () => {
        const callback = async (payload: WhiteList) => {
            await sleep(1000)
            setData((prevData) => ({
                ...prevData,
                security: {
                    ...prevData.security,
                    whiteList: {
                        ...prevData.security.whiteList,
                        list: [...prevData.security.whiteList.list, payload],
                    },
                },
            }))
        }
        return callback
    }

    return (
        <div>
            <SettingsHeader
                title="Security"
                description="Manage your project's security preferences."
            />
            <div className="border-b border-gray-200 dark:border-gray-800 py-6">
                <div className="pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                        <div className="heading-text font-semibold">
                            API Keys & Tokens
                        </div>
                        <p>Manage your project API keys and access tokens</p>
                    </div>
                    <NewApiKeyDialog onSubmit={handleCreateNewApiKey} />
                </div>
                <div className="space-y-4">
                    {data && data.security.apiKeys.length > 0 ? (
                        <Card bodyClass="p-0">
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {data.security.apiKeys.map((key) => (
                                    <ApiKeyInfo
                                        key={key.id}
                                        data={key}
                                        onDelete={() =>
                                            setDeleteApiKeyDialog({
                                                open: true,
                                                selectedKeyId: key.id,
                                            })
                                        }
                                    />
                                ))}
                            </div>
                        </Card>
                    ) : (
                        <Card className="bg-gray-50 dark:bg-gray-800 heading-text">
                            <p>
                                No API keys found. Create a new API key to get
                                started.
                            </p>
                        </Card>
                    )}
                </div>
            </div>
            <div className="py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="heading-text font-semibold">
                            IP Whitelisting
                        </div>
                        <p>Restrict access to specific IP addresses</p>
                    </div>
                    <Switcher
                        checked={data?.security.whiteList.enabled}
                        onChange={handleWhiteListToggle}
                    />
                </div>
                {data?.security.whiteList.enabled && (
                    <div>
                        <Alert type="info" showIcon className="mt-4">
                            When enabled, only requests from whitelisted IP
                            addresses will be allowed.
                        </Alert>
                        <div className="mt-4">
                            {data && data.security.whiteList.list.length > 0 ? (
                                <Card bodyClass="p-0">
                                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {data.security.whiteList.list.map(
                                            (whiteList) => (
                                                <WhiteListInfo
                                                    key={whiteList.id}
                                                    data={whiteList}
                                                    onDelete={() =>
                                                        setDeleteWhiteListDialog(
                                                            {
                                                                open: true,
                                                                selectedKeyId:
                                                                    whiteList.id,
                                                            },
                                                        )
                                                    }
                                                    onConfig={() =>
                                                        setConfigWhitelistingDialog(
                                                            {
                                                                open: true,
                                                                selectedIp:
                                                                    whiteList,
                                                                type: 'edit',
                                                            },
                                                        )
                                                    }
                                                />
                                            ),
                                        )}
                                    </div>
                                </Card>
                            ) : (
                                <Card className="bg-gray-50 dark:bg-gray-800 heading-text">
                                    <p>No whitelisted IP addresses found.</p>
                                </Card>
                            )}
                        </div>
                        <div className="mt-4">
                            <Button
                                variant="subtle"
                                onClick={() =>
                                    setConfigWhitelistingDialog({
                                        open: true,
                                        selectedIp: null,
                                        type: 'add',
                                    })
                                }
                                icon={<LiAdd className="text-base" />}
                            >
                                Add New Whitelisted IP
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            <ConfirmDialog
                isOpen={deleteApiKeyDialog.open}
                type="danger"
                title="Delete API Key"
                onClose={handleDeleteApiKeyDialogClose}
                onCancel={handleDeleteApiKeyDialogClose}
                onConfirm={handleDeleteApiKeyConfirm}
                confirmButtonProps={{ loading: deleteApiKeyLoading }}
            >
                <p>
                    {' '}
                    Are you sure you want to delete this API key? This action
                    can&apos;t be undo.{' '}
                </p>
            </ConfirmDialog>
            <ConfirmDialog
                isOpen={deleteWhiteListDialog.open}
                type="danger"
                title="Delete Whitelisted IP"
                onClose={handleDeleteWhiteListDialogClose}
                onCancel={handleDeleteWhiteListDialogClose}
                onConfirm={handleDeleteWhiteListConfirm}
                confirmButtonProps={{ loading: deleteApiKeyLoading }}
            >
                <p> Are you sure you want to delete this whitelisted IP?</p>
            </ConfirmDialog>
            <IpWhitelistingDialog
                data={confiWhitelistingDialog.selectedIp}
                open={confiWhitelistingDialog.open}
                type={confiWhitelistingDialog.type}
                onSubmit={
                    confiWhitelistingDialog.type === 'add'
                        ? handleAddNewWhiteList
                        : handleUpateWhiteList
                }
                onClose={() =>
                    setConfigWhitelistingDialog({
                        open: false,
                        selectedIp: null,
                        type: 'edit',
                    })
                }
            />
        </div>
    )
}

export default Security
