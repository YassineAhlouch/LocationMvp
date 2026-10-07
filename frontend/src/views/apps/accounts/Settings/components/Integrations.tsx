import { useMemo, useState } from 'react'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Switcher from '@/components/ui/Switcher'
import Dialog from '@/components/ui/Dialog'
import { apiGetAccountIntegrationSettings } from '@/services/AccountService'
import sleep from '@/utils/sleep'
import {
    TbRosetteDiscountCheckFilled,
    TbCircleCheckFilled,
} from 'react-icons/tb'
import { LiTick } from '@/icons'
import useSWR from 'swr'
import type { GetSettingsIntegrationsResponse, Integration } from '../types'

type IntegrationCardProps = {
    app: Integration
    onToggle: (app: Integration) => void
    onLearnMore: (app: Integration) => void
    onManage: (app: Integration) => void
}

const integrationTypeMap: Record<string, { name: string; desc: string }> = {
    automation: {
        name: 'Automation',
        desc: 'Automate tasks and connect multiple apps to streamline your workflow without manual effort.',
    },
    storageCollaboration: {
        name: 'Storage & Collaboration',
        desc: 'Tools that help you manage files, documents, and collaborate seamlessly across your team.',
    },
    projectTools: {
        name: 'Project Tools',
        desc: 'Manage tasks, support tickets, and customer relationships to keep your projects organized and on track.',
    },
    devDesignTools: {
        name: 'Dev & Design Tools',
        desc: 'Developer and design tools for code management, prototyping, error tracking, and visual collaboration.',
    },
}

const IntegrationCard = ({
    app,
    onToggle,
    onLearnMore,
    onManage,
}: IntegrationCardProps) => {
    return (
        <Card
            className="flex flex-col justify-between"
            footer={{
                className: 'h-13 w-full flex items-center px-2',
                content: (
                    <div className="w-full flex items-center justify-between gap-2">
                        {app.active && (
                            <Button onClick={() => onManage(app)}>
                                Manage
                            </Button>
                        )}
                        {!app.active && (
                            <Button onClick={() => onLearnMore(app)}>
                                Learn More
                            </Button>
                        )}
                        <Switcher
                            onChange={() => onToggle(app)}
                            checked={app.active}
                        />
                    </div>
                ),
            }}
        >
            <div className="flex flex-col gap-4">
                <Avatar
                    className="bg-transparent dark:bg-transparent border-0"
                    size={30}
                    src={app.img}
                    shape="round"
                />
                <div>
                    <div className="heading-text font-semibold">{app.name}</div>
                    <span>{app.desc}</span>
                </div>
            </div>
        </Card>
    )
}

const Integrations = () => {
    const { data, isLoading, mutate } = useSWR(
        [`/api/settings/integration`],
        () =>
            apiGetAccountIntegrationSettings<GetSettingsIntegrationsResponse>(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            evalidateOnFocus: false,
        },
    )

    const [selectedIntegration, setSelectedIntegration] = useState<{
        integration: Partial<Integration>
        dialogOpen: boolean
    }>({
        integration: {},
        dialogOpen: false,
    })
    const [isDisconnecting, setIsDisconnecting] = useState(false)

    const handleDisconnect = async (disconnect?: boolean) => {
        if (disconnect) {
            setIsDisconnecting(true)
            await sleep(1000)
            setIsDisconnecting(false)
            mutate(
                [
                    ...(data?.map((item) =>
                        item.id === selectedIntegration.integration.id
                            ? { ...item, active: false }
                            : item,
                    ) || []),
                ],
                false,
            )
        }
        setSelectedIntegration((prev) => ({ ...prev, dialogOpen: false }))
        await sleep(200)
        setSelectedIntegration({
            integration: {},
            dialogOpen: false,
        })
    }

    const handleDialogClose = () => {
        setSelectedIntegration({
            integration: {},
            dialogOpen: false,
        })
    }

    const handleLearnMore = (app: Integration) => {
        setSelectedIntegration({
            integration: app,
            dialogOpen: true,
        })
    }

    const integrations = useMemo(() => {
        const categories: {
            integrated: Integration[]
            apps: Record<string, Integration[]>
        } = {
            integrated: [],
            apps: {
                automation: [],
                storageCollaboration: [],
                projectTools: [],
                devDesignTools: [],
            },
        }

        if (data) {
            data.forEach((item) => {
                if (item.active) {
                    categories.integrated.push(item)
                } else {
                    categories.apps[item.type].push(item)
                }
            })
        }

        return categories
    }, [data])

    const handleToggle = (app: Integration) => {
        if (data) {
            mutate(
                [
                    ...(data?.map((item) =>
                        item.id === app.id
                            ? { ...item, active: !item.active }
                            : item,
                    ) || []),
                ],
                false,
            )
        }
    }

    const handleManage = (app: Integration) => {
        setSelectedIntegration({
            integration: app,
            dialogOpen: true,
        })
    }

    return (
        <div className="space-y-4">
            {integrations.integrated.length > 0 && (
                <div className="py-4">
                    <div className="mb-4">
                        <h5>Your Integration</h5>
                        <p>Manage or disable your integrations here</p>
                    </div>
                    <div>
                        {!isLoading && data && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {integrations.integrated.map((app) => (
                                    <IntegrationCard
                                        key={app.id}
                                        app={app}
                                        onToggle={handleToggle}
                                        onLearnMore={handleLearnMore}
                                        onManage={handleManage}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
            {integrations.apps.automation.length > 0 && (
                <>
                    {Object.entries(integrations.apps).map(([key, value]) => (
                        <div className="py-4" key={key}>
                            <div className="mb-4">
                                <h5>{integrationTypeMap[key].name}</h5>
                                <p>{integrationTypeMap[key].desc}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {value.map((app) => (
                                    <IntegrationCard
                                        key={app.id}
                                        app={app}
                                        onToggle={handleToggle}
                                        onLearnMore={handleLearnMore}
                                        onManage={handleManage}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </>
            )}
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
                            {!selectedIntegration.integration.active && (
                                <TbRosetteDiscountCheckFilled className="text-info text-base" />
                            )}
                            {selectedIntegration.integration.active && (
                                <TbCircleCheckFilled className="text-success text-base" />
                            )}
                        </div>
                        <span className="flex gap-2">
                            <span>
                                {selectedIntegration.integration.type &&
                                integrationTypeMap[
                                    selectedIntegration.integration.type
                                ]
                                    ? integrationTypeMap[
                                          selectedIntegration.integration.type
                                      ].name
                                    : 'Unknown Type'}
                            </span>
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
                    {selectedIntegration.integration.active ? (
                        <Button
                            block
                            loading={isDisconnecting}
                            onClick={() => handleDisconnect(true)}
                        >
                            <span className="text-error">
                                {isDisconnecting
                                    ? 'Disconnecting...'
                                    : 'Disconnect'}
                            </span>
                        </Button>
                    ) : (
                        <Button block onClick={() => handleDialogClose()}>
                            Acknowledge
                        </Button>
                    )}
                </div>
            </Dialog>
        </div>
    )
}

export default Integrations
