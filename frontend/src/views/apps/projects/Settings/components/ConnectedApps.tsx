import { useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Switcher from '@/components/ui/Switcher'
import Dialog from '@/components/ui/Dialog'
import SettingsHeader from './SettingsHeader'
import useProjectSettingData from '../hooks/useProjectSettingData'
import classNames from '@/utils/classNames'
import { LiTick } from '@/icons'
import { TbRosetteDiscountCheckFilled } from 'react-icons/tb'
import type { Integration } from '../types'

const ConnectedApps = () => {
    const { data, setData } = useProjectSettingData()

    const [selectedIntegration, setSelectedIntegration] = useState<{
        integration: Partial<Integration>
        dialogOpen: boolean
    }>({
        integration: {},
        dialogOpen: false,
    })

    const handleDialogClose = () => {
        setSelectedIntegration({
            integration: {},
            dialogOpen: false,
        })
    }

    const handleToggle = (bool: boolean, id: string) => {
        setData((prevData) => {
            const updatedIntegrations = prevData.integrations.map(
                (integration) => {
                    if (integration.id === id) {
                        return { ...integration, active: bool }
                    }
                    return integration
                },
            )
            return { ...prevData, integrations: updatedIntegrations }
        })
    }

    return (
        <>
            <div className="space-y-4">
                <SettingsHeader
                    title="Connected Apps"
                    description="Supercharge your workflow with third-party tools"
                />
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {data &&
                        data.integrations.map((app) => (
                            <div
                                key={app.id}
                                className={classNames(
                                    'flex items-center justify-between py-4 border-gray-200 dark:border-gray-700',
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <Avatar
                                        className="bg-transparent dark:bg-transparent p-2 border-2 border-gray-200 dark:border-gray-700"
                                        size={45}
                                        src={app.img}
                                        shape="round"
                                    />
                                    <div>
                                        <div className="heading-text font-medium">
                                            {app.name}
                                        </div>
                                        <span className="hidden sm:block">
                                            {app.desc}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        onClick={() =>
                                            setSelectedIntegration({
                                                dialogOpen: true,
                                                integration: app,
                                            })
                                        }
                                    >
                                        Learn more
                                    </Button>
                                    <Switcher
                                        checked={app.active}
                                        onChange={(val) =>
                                            handleToggle(val, app.id)
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            <Dialog
                isOpen={selectedIntegration.dialogOpen}
                onClose={handleDialogClose}
            >
                <div className="flex items-center gap-3">
                    <Avatar
                        className="bg-transparent dark:bg-transparent p-2 border-2 border-gray-200 dark:border-gray-600"
                        size={45}
                        src={selectedIntegration.integration.img}
                        shape="round"
                    />
                    <div>
                        <div className="flex items-center gap-1">
                            <h6>{selectedIntegration.integration.name}</h6>
                            <TbRosetteDiscountCheckFilled className="text-info text-base" />
                        </div>
                        <span className="flex gap-2">
                            <span>{selectedIntegration.integration.type}</span>
                        </span>
                    </div>
                </div>
                <div className="mt-6">
                    <span className="font-medium heading-text">Overview</span>
                    <p className="mt-2">
                        This integration allows your workspace to seamlessly
                        connect with external platforms or services, helping you
                        enhance workflows, streamline data sharing, and unlock
                        new capabilities. It’s designed to be flexible, secure,
                        and easy to configure—whether you're syncing data,
                        automating tasks, or extending your app's functionality.
                    </p>
                    <div className="mt-6">
                        <span className="font-medium heading-text">
                            Key Features:
                        </span>
                        <ul className="list-disc mt-4 flex flex-col gap-3">
                            <li className="flex gap-2 items-center">
                                <LiTick className="text-success text-lg" />
                                <span className="leading-none">
                                    Effortless integration setup with guided
                                    configuration steps.
                                </span>
                            </li>
                            <li className="flex gap-2 items-center">
                                <LiTick className="text-success text-lg" />
                                <span className="leading-none">
                                    Secure authentication and permission-based
                                    access controls.
                                </span>
                            </li>
                            <li className="flex gap-2 items-center">
                                <LiTick className="text-success text-lg" />
                                <span className="leading-none">
                                    Real-time or scheduled data sync between
                                    platforms.
                                </span>
                            </li>
                            <li className="flex gap-2 items-center">
                                <LiTick className="text-success text-lg" />
                                <span className="leading-none">
                                    Scalable support for various use cases and
                                    workflows.
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className=" mt-6">
                    <Button block onClick={handleDialogClose}>
                        Acknowledge
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

export default ConnectedApps
