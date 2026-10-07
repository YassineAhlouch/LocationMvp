import { useState, useMemo, useEffect } from 'react'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import Dropdown from '@/components/ui/Dropdown'
import AutoComplete from '@/components/shared/AutoComplete'
import sleep from '@/utils/sleep'
import {
    LuShare2,
    LuX,
    LuChevronDown,
    LuLink,
    LuLoader,
    LuUserRound,
} from 'react-icons/lu'

type ShareProjectDialogProps = {
    data: ProjectMeta
    setData: (callback: (data: ProjectMeta) => ProjectMeta) => void
    permissionRoleMap: Record<string, string>
}

type MemberOption = {
    value: string
    label: string
    email: string
    img: string
    status: string
}

type Member = {
    id: string
    name: string
    email: string
    img: string
    permissionRole: string
    status: string
}

type ProjectMeta = {
    id: string
    title: string
    description: string
    participantMembers: Member[]
    allMembers: Member[]
}

const ShareProjectDialog = ({
    data,
    setData,
    permissionRoleMap,
}: ShareProjectDialogProps) => {
    const [dialogOpen, setDialogOpen] = useState(false)

    const [inputValue, setInputValue] = useState('')

    const [selectedMember, setSelectedMember] = useState<MemberOption | null>(
        null,
    )

    const [isLoading, setIsLoading] = useState(false)

    const [invitedPersonPermissionRole, setInvitedPersonPermissionRole] =
        useState('viewer')

    const [selectedPermision, setSelectedPermision] = useState('Can View')

    const [copied, setCopied] = useState(false)

    const handleClose = () => {
        setDialogOpen(false)
        setInputValue('')
        setSelectedMember(null)
    }

    const allMembersOption = useMemo(() => {
        return data.allMembers
            .filter(
                (member) =>
                    !data.participantMembers.some(
                        (participant) => participant.id === member.id,
                    ),
            )
            .map((member) => {
                return {
                    value: member.id,
                    label: member.name,
                    email: member.email,
                    img: member.img,
                    status: member.status,
                }
            })
    }, [data.allMembers, data.participantMembers])

    const permissionRoleOptions = useMemo(() => {
        return Object.entries(permissionRoleMap).map(([key, value]) => {
            return { value: key, label: value }
        })
    }, [permissionRoleMap])

    useEffect(() => {
        if (copied) {
            const copyFeedbackInterval = setTimeout(
                () => setCopied(false),
                2000,
            )

            return () => {
                clearTimeout(copyFeedbackInterval)
            }
        }
    }, [copied])

    const handleOptionSelect = (option: MemberOption) => {
        setSelectedMember(option)
    }

    const handleInvite = async () => {
        setIsLoading(true)
        await sleep(1000)
        setData((prev) => {
            if (selectedMember) {
                return {
                    ...prev,
                    participantMembers: [
                        ...prev.participantMembers,
                        ...[
                            {
                                id: selectedMember.value,
                                name: selectedMember.label,
                                email: selectedMember.email,
                                img: selectedMember.img,
                                permissionRole: invitedPersonPermissionRole,
                                status: 'pending',
                            },
                        ],
                    ],
                }
            }

            if (inputValue && !selectedMember) {
                return {
                    ...prev,
                    participantMembers: [
                        ...prev.participantMembers,
                        ...[
                            {
                                id: new Date().getTime().toString(),
                                name: inputValue,
                                email: inputValue,
                                img: '',
                                permissionRole: invitedPersonPermissionRole,
                                status: 'pending',
                            },
                        ],
                    ],
                }
            }

            return prev
        })
        setIsLoading(false)
        setInputValue('')
        setSelectedMember(null)
    }

    const handleRoleChange = (role: string, id: string) => {
        setData((prev) => {
            return {
                ...prev,
                participantMembers: prev.participantMembers.map((member) => {
                    if (member.id === id) {
                        return {
                            ...member,
                            permissionRole: role,
                        }
                    }
                    return member
                }),
            }
        })
    }

    return (
        <>
            <Button icon={<LuShare2 />} onClick={() => setDialogOpen(true)}>
                Share
            </Button>
            <Dialog
                isOpen={dialogOpen}
                onClose={() => setDialogOpen(false)}
                closable={false}
            >
                <div className="flex justify-between">
                    <div>
                        <h5 className="font-medium">Share this project</h5>
                        <p>
                            Invite team members to collaborate on this project.
                        </p>
                    </div>
                    <div>
                        <button
                            className="close-button button-press-feedback hover:bg-gray-100 hover:dark:bg-gray-700 rounded-lg"
                            type="button"
                            onClick={handleClose}
                        >
                            <LuX />
                        </button>
                    </div>
                </div>
                <div className="mt-6">
                    <div className="flex items-center gap-2">
                        <AutoComplete<MemberOption>
                            data={allMembersOption}
                            optionKey={(option) => option.email}
                            renderOption={(option) => (
                                <div className="flex items-center gap-2 p-1 cursor-pointer">
                                    <Avatar
                                        src={option.img}
                                        shape="circle"
                                        size={25}
                                    />
                                    <span className="font-medium">
                                        {option.label}
                                    </span>
                                </div>
                            )}
                            value={inputValue}
                            placeholder="Enter name or email"
                            onInputChange={setInputValue}
                            onOptionSelected={handleOptionSelect}
                            autoComplete="off"
                            suffix={
                                <Dropdown
                                    placement="bottom-end"
                                    menuClass="min-w-[150px]"
                                    renderTitle={
                                        <Button
                                            className="px-0"
                                            variant="link"
                                            size="sm"
                                            iconAlignment="end"
                                            icon={<LuChevronDown />}
                                        >
                                            {
                                                permissionRoleMap[
                                                    invitedPersonPermissionRole
                                                ]
                                            }
                                        </Button>
                                    }
                                >
                                    {permissionRoleOptions.map((option) => (
                                        <Dropdown.Item
                                            key={option.value}
                                            disabled={option.value === 'owner'}
                                            onClick={() =>
                                                setInvitedPersonPermissionRole(
                                                    option.value,
                                                )
                                            }
                                        >
                                            {option.label}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown>
                            }
                        />
                        <Button
                            variant="solid"
                            onClick={handleInvite}
                            loading={isLoading}
                        >
                            Invite
                        </Button>
                    </div>
                </div>
                <div className="mt-6">
                    <h6>Participants</h6>
                    <div className="mt-1">
                        {data.participantMembers.map((participant) => (
                            <div
                                key={participant.id}
                                className="flex items-center justify-between gap-2 py-2"
                            >
                                <div className="flex items-center gap-2">
                                    <Avatar
                                        src={participant.img}
                                        icon={
                                            <LuUserRound className="heading-text" />
                                        }
                                        shape="circle"
                                        size={32}
                                    />
                                    <div>
                                        <div className="font-medium heading-text">
                                            {participant.name}
                                        </div>
                                        <div className="text-xs">
                                            {participant.email}
                                        </div>
                                    </div>
                                </div>
                                {participant.status === 'pending' ? (
                                    <Button
                                        variant="ghost"
                                        disabled
                                        size="sm"
                                        icon={<LuLoader />}
                                    >
                                        Pending
                                    </Button>
                                ) : (
                                    <Dropdown
                                        renderTitle={
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                iconAlignment="end"
                                                icon={<LuChevronDown />}
                                                disabled={
                                                    participant.permissionRole ===
                                                    'owner'
                                                }
                                            >
                                                {
                                                    permissionRoleMap[
                                                        participant
                                                            .permissionRole
                                                    ]
                                                }
                                            </Button>
                                        }
                                        placement="bottom-end"
                                        menuClass="min-w-[150px]"
                                        disabled={
                                            participant.permissionRole ===
                                            'owner'
                                        }
                                    >
                                        {permissionRoleOptions.map((option) => (
                                            <Dropdown.Item
                                                key={option.value}
                                                onClick={() =>
                                                    handleRoleChange(
                                                        option.value,
                                                        participant.id,
                                                    )
                                                }
                                                disabled={
                                                    option.value === 'owner'
                                                }
                                            >
                                                {option.label}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-6">
                    <h6>Default access </h6>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 py-2 mt-1">
                            <Avatar
                                icon={<LuLink className="heading-text" />}
                                shape="circle"
                                size={32}
                            />
                            <div>
                                <div className="font-medium heading-text">
                                    Anyone with the link
                                </div>
                                <div className="text-xs">
                                    Anyone on the internet with the link
                                </div>
                            </div>
                        </div>
                        <Dropdown
                            placement="bottom-end"
                            renderTitle={
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    iconAlignment="end"
                                    icon={<LuChevronDown />}
                                >
                                    {selectedPermision}
                                </Button>
                            }
                            onSelect={(eventKey) =>
                                setSelectedPermision(eventKey)
                            }
                        >
                            <Dropdown.Item eventKey="Can view">
                                Can view
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="Can edit">
                                Can edit
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="Can delete">
                                Can delete
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="Can invite">
                                Can invite
                            </Dropdown.Item>
                        </Dropdown>
                    </div>
                </div>
                <div className="mt-6">
                    <Input
                        readOnly
                        value="https://eyris.themenate.net/apps/projects/scrumboard"
                        className="bg-gray-100"
                        suffix={
                            <Button
                                variant="link"
                                size="sm"
                                className="px-0"
                                onClick={() => setCopied(true)}
                            >
                                {copied ? 'Copied' : 'Copy'}
                            </Button>
                        }
                    />
                </div>
            </Dialog>
        </>
    )
}

export default ShareProjectDialog
