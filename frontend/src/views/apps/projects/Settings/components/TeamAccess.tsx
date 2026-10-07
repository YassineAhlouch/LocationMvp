import { useState, useMemo, useEffect } from 'react'
import Table from '@/components/ui/Table'
import Avatar from '@/components/ui/Avatar/Avatar'
import Button from '@/components/ui/Button'
import Segment from '@/components/ui/Segment'
import Input from '@/components/ui/Input'
import Switcher from '@/components/ui/Switcher'
import InputGroup from '@/components/ui/InputGroup'
import Dialog from '@/components/ui/Dialog'
import Dropdown from '@/components/ui/Dropdown'
import AutoComplete from '@/components/shared/AutoComplete'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import DebouceInput from '@/components/shared/DebouceInput'
import SettingsHeader from './SettingsHeader'
import useProjectSettingData from '../hooks/useProjectSettingData'
import classNames from '@/utils/classNames'
import sleep from '@/utils/sleep'
import formatRelativeTime from '@/utils/formatRelativeTime'
import dayjs from 'dayjs'
import {
    LiSearch,
    LiChevronDown,
    LiUserAdd,
    LiGlobal,
    LiCross,
    LiTrash,
} from '@/icons'

type MemberOption = {
    value: string
    label: string
    email: string
    img: string
    status: string
    permissionRole: string
    invitedDate: string | number
    invitedBy: string
}

const permissionRoleMap: Record<string, { label: string }> = {
    owner: {
        label: 'Owner',
    },
    viewer: {
        label: 'Member',
    },
    editor: {
        label: 'Admin',
    },
}

const TeamAccess = () => {
    const { data, setData } = useProjectSettingData()

    const [query, setQuery] = useState('')
    const [filter, setFilter] = useState('')
    const [copied, setCopied] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [selectedMember, setSelectedMember] = useState<MemberOption | null>(
        null,
    )
    const [pendingMembers, setPendingMembers] = useState<Array<MemberOption>>(
        [],
    )
    const [invitedPersonPermissionRole, setInvitedPersonPermissionRole] =
        useState('viewer')

    const [isLoading, setIsLoading] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
    const [memberToDelete, setMemberToDelete] = useState<{
        id: string
        type: 'existing' | 'pending'
        name?: string
    } | null>(null)

    useEffect(() => {
        if (data) {
            setPendingMembers(
                data.invitedMembers.map((member) => ({
                    ...member,
                    value: member.id,
                    label: member.name,
                    invitedDate: member.invitedDate,
                })),
            )
        }
    }, [data])

    const permissionRoleOptions = useMemo(() => {
        return Object.entries(permissionRoleMap).map(([key, value]) => {
            return { value: key, label: value.label }
        })
    }, [])

    const allMembersOption = useMemo(() => {
        return (
            data?.allMembers
                .filter(
                    (member) =>
                        !data.participantMembers.some(
                            (participant) => participant.id === member.id,
                        ) &&
                        !pendingMembers.some(
                            (participant) => participant.value === member.id,
                        ),
                )
                .map((member) => {
                    return {
                        value: member.id,
                        label: member.name,
                        email: member.email,
                        img: member.img,
                        status: member.status,
                        permissionRole: member.permissionRole,
                        invitedDate: member.invitedDate,
                        invitedBy: member.invitedBy,
                    }
                }) || []
        )
    }, [data, pendingMembers])

    const handleQuery = (value: string) => {
        setQuery(value)
    }

    const handleInvite = async () => {
        setIsLoading(true)
        await sleep(1000)
        setIsLoading(false)
        setDialogOpen(false)
        setInputValue('')
        setPendingMembers(
            selectedMember
                ? [...pendingMembers, selectedMember]
                : pendingMembers,
        )
    }

    const handleExistingMemberRoleChange = (role: string, id: string) => {
        setData((prevData) => {
            const updatedMembers = prevData.participantMembers.map((member) => {
                if (member.id === id) {
                    return { ...member, permissionRole: role }
                }
                return member
            })
            return { ...prevData, participantMembers: updatedMembers }
        })
    }

    const handleExistingMemberRemove = (id: string) => {
        setData((prevData) => {
            const updatedMembers = prevData.participantMembers.filter(
                (member) => member.id !== id,
            )
            return { ...prevData, participantMembers: updatedMembers }
        })
    }

    const handlePendingMemberRoleChange = (role: string, id: string) => {
        setPendingMembers((prev) => {
            return prev.map((member) => {
                if (member.value === id) {
                    return { ...member, permissionRole: role }
                }
                return member
            })
        })
    }

    const handlePendingMemberRemove = (id: string) => {
        setPendingMembers((prev) =>
            prev.filter((member) => member.value !== id),
        )
    }

    const handleOptionSelect = (option: MemberOption) => {
        setSelectedMember({
            ...option,
            invitedDate: dayjs().toISOString(),
            permissionRole: invitedPersonPermissionRole,
            invitedBy: 'you',
        })
    }

    const handleClose = () => {
        setDialogOpen(false)
        setInputValue('')
        setSelectedMember(null)
    }

    const renderDropdown = (
        team: { id: string; permissionRole: string },
        callback: (role: string, id: string) => void,
    ) => {
        return (
            <Dropdown
                renderTitle={
                    <Button
                        iconAlignment="end"
                        clickFeedback={false}
                        icon={<LiChevronDown className="text-sm" />}
                        disabled={team.permissionRole === 'owner'}
                        className="w-24"
                    >
                        {permissionRoleMap[team.permissionRole].label}
                    </Button>
                }
                placement="bottom-end"
                menuClass="min-w-[150px]"
                disabled={team.permissionRole === 'owner'}
            >
                {permissionRoleOptions.map((option) => (
                    <Dropdown.Item
                        key={option.value}
                        onClick={() => callback(option.value, team.id)}
                        disabled={option.value === 'owner'}
                    >
                        {option.label}
                    </Dropdown.Item>
                ))}
            </Dropdown>
        )
    }

    const handleDeleteClick = (
        id: string,
        type: 'existing' | 'pending',
        name?: string,
    ) => {
        setMemberToDelete({ id, type, name })
        setConfirmDeleteOpen(true)
    }

    const handleConfirmDelete = () => {
        if (memberToDelete) {
            if (memberToDelete.type === 'existing') {
                handleExistingMemberRemove(memberToDelete.id)
            } else {
                handlePendingMemberRemove(memberToDelete.id)
            }
        }
        setConfirmDeleteOpen(false)
        setMemberToDelete(null)
    }

    const handleCancelDelete = () => {
        setConfirmDeleteOpen(false)
        setMemberToDelete(null)
    }

    const renderDeleteButton = (
        id: string,
        type: 'existing' | 'pending',
        disabled = false,
        name?: string,
    ) => {
        return (
            <button
                className={classNames(
                    'text-lg heading-text hover:text-error',
                    disabled && 'cursor-not-allowed opacity-50',
                )}
                title="Remove"
                onClick={() => handleDeleteClick(id, type, name)}
                disabled={disabled}
            >
                <LiTrash />
            </button>
        )
    }

    return (
        <div className="space-y-4">
            <SettingsHeader
                title="Team"
                description="Manage team member and invitations"
            >
                <Button
                    icon={<LiUserAdd />}
                    onClick={() => setDialogOpen(true)}
                >
                    Invite Members
                </Button>
            </SettingsHeader>
            {pendingMembers.length > 0 && (
                <div className="border-b border-gray-200 dark:border-gray-700 space-y-2 pb-4">
                    <div className="mb-4">
                        <div className="heading-text font-semibold">
                            {pendingMembers.length} pending invitations
                        </div>
                        <p>
                            You can adjust pending members roles or decline them
                            before they join.
                        </p>
                    </div>
                    <div className="md:hidden space-y-3">
                        {pendingMembers.map((member) => (
                            <div
                                key={member.value}
                                className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="heading-text font-medium truncate flex-1 mr-2">
                                        {member.email}
                                    </div>
                                    {renderDeleteButton(
                                        member.value,
                                        'pending',
                                        false,
                                        member.label,
                                    )}
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="space-y-1">
                                        <div>Invited by {member.invitedBy}</div>
                                        <div>
                                            {formatRelativeTime(
                                                member.invitedDate,
                                            )}
                                        </div>
                                    </div>
                                    {renderDropdown(
                                        {
                                            id: member.value,
                                            permissionRole:
                                                member.permissionRole,
                                        },
                                        handlePendingMemberRoleChange,
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <Table hoverable={false} className="hidden md:table">
                        <Table.TBody>
                            {pendingMembers.map((member) => {
                                return (
                                    <Table.Tr key={member.value}>
                                        <Table.Td className="px-0">
                                            <div className="heading-text font-medium">
                                                {member.email}
                                            </div>
                                        </Table.Td>
                                        <Table.Td>
                                            Invited by {member.invitedBy}
                                        </Table.Td>
                                        <Table.Td>
                                            {formatRelativeTime(
                                                member.invitedDate,
                                            )}
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="flex items-center justify-end">
                                                {renderDropdown(
                                                    {
                                                        id: member.value,
                                                        permissionRole:
                                                            member.permissionRole,
                                                    },
                                                    handlePendingMemberRoleChange,
                                                )}
                                            </div>
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="flex items-center justify-end">
                                                {renderDeleteButton(
                                                    member.value,
                                                    'pending',
                                                    false,
                                                    member.label,
                                                )}
                                            </div>
                                        </Table.Td>
                                    </Table.Tr>
                                )
                            })}
                        </Table.TBody>
                    </Table>
                </div>
            )}
            <div className="space-y-2 py-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <DebouceInput
                        className="md:max-w-[250px]"
                        placeholder="Search..."
                        prefix={<LiSearch className="heading-text" />}
                        onChange={(e) => handleQuery(e.target.value)}
                    />
                    <div>
                        <Segment
                            value={filter}
                            onChange={(value) => setFilter(value)}
                            className="w-full md:w-auto "
                        >
                            <Segment.Item value="" className="px-3">
                                All
                            </Segment.Item>
                            <Segment.Item value="editor" className="px-3">
                                Admin
                            </Segment.Item>
                            <Segment.Item value="viewer" className="px-3">
                                Members
                            </Segment.Item>
                        </Segment>
                    </div>
                </div>
                <div>
                    {/* Mobile view */}
                    <div className="md:hidden space-y-3">
                        {data?.participantMembers
                            ?.filter(
                                (team) =>
                                    team.name
                                        .toLowerCase()
                                        .includes(query.toLowerCase()) &&
                                    (filter === '' ||
                                        team.permissionRole === filter),
                            )
                            .map((team) => (
                                <div
                                    key={team.id}
                                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <Avatar
                                                shape="circle"
                                                src={team.img}
                                                size={36}
                                            />
                                            <div className="min-w-0">
                                                <div className="heading-text font-semibold truncate">
                                                    {team.name}
                                                </div>
                                                <p className="truncate text-sm">
                                                    {team.email}
                                                </p>
                                            </div>
                                        </div>
                                        {renderDeleteButton(
                                            team.id,
                                            'existing',
                                            team.permissionRole === 'owner',
                                            team.name,
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div>
                                            Since{' '}
                                            {dayjs(team.invitedDate).format(
                                                'MMM DD YYYY',
                                            )}
                                        </div>
                                        {renderDropdown(
                                            team,
                                            handleExistingMemberRoleChange,
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                    {/* Desktop view */}
                    <Table hoverable={false} className="hidden md:table">
                        <Table.TBody>
                            {data?.participantMembers
                                ?.filter(
                                    (team) =>
                                        team.name
                                            .toLowerCase()
                                            .includes(query.toLowerCase()) &&
                                        (filter === '' ||
                                            team.permissionRole === filter),
                                )
                                .map((team) => {
                                    return (
                                        <Table.Tr key={team.id}>
                                            <Table.Td className="px-0">
                                                <div className="flex items-center gap-2">
                                                    <Avatar
                                                        shape="circle"
                                                        src={team.img}
                                                    />
                                                    <div>
                                                        <div className="heading-text font-semibold">
                                                            {team.name}
                                                        </div>
                                                        <p>{team.email}</p>
                                                    </div>
                                                </div>
                                            </Table.Td>
                                            <Table.Td>
                                                Since{' '}
                                                {dayjs(team.invitedDate).format(
                                                    'MMM DD YYYY',
                                                )}
                                            </Table.Td>
                                            <Table.Td>
                                                <div className="flex items-center justify-end">
                                                    {renderDropdown(
                                                        team,
                                                        handleExistingMemberRoleChange,
                                                    )}
                                                </div>
                                            </Table.Td>
                                            <Table.Td>
                                                <div className="flex items-center justify-end">
                                                    {renderDeleteButton(
                                                        team.id,
                                                        'existing',
                                                        team.permissionRole ===
                                                            'owner',
                                                        team.name,
                                                    )}
                                                </div>
                                            </Table.Td>
                                        </Table.Tr>
                                    )
                                })}
                        </Table.TBody>
                    </Table>
                    {data && data.participantMembers.length === 0 && (
                        <div className="flex items-center justify-center py-4">
                            <p className="text-gray-500">
                                No team members found.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <Dialog
                isOpen={dialogOpen}
                onClose={() => setDialogOpen(false)}
                closable={false}
                className="p-0"
                width={500}
            >
                <div className="flex justify-between border-b border-gray-200 p-4">
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
                            <LiCross />
                        </button>
                    </div>
                </div>
                <div className="space-y-8 p-4">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Avatar
                                    icon={<LiGlobal className="heading-text" />}
                                />
                                <div>
                                    <div className="heading-text font-medium">
                                        Public access
                                    </div>
                                    <p>Anyone with the link can view</p>
                                </div>
                            </div>
                            <Switcher defaultChecked />
                        </div>
                        <InputGroup>
                            <Input
                                readOnly
                                value="https://eyris.themenate.net/apps/projects/scrumboard"
                                className="bg-gray-100"
                            />
                            <Button
                                onClick={() => setCopied(true)}
                                className="hover:bg-transparent"
                            >
                                {copied ? 'Copied' : 'Copy'}
                            </Button>
                        </InputGroup>
                    </div>
                    <div>
                        <div className="heading-text font-medium mb-1.5">
                            Invite team members
                        </div>
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
                                                clickFeedback={false}
                                                className="px-0"
                                                variant="link"
                                                iconAlignment="end"
                                                icon={
                                                    <LiChevronDown className="text-sm" />
                                                }
                                            >
                                                {
                                                    permissionRoleMap[
                                                        invitedPersonPermissionRole
                                                    ].label
                                                }
                                            </Button>
                                        }
                                    >
                                        {permissionRoleOptions.map((option) => (
                                            <Dropdown.Item
                                                key={option.value}
                                                disabled={
                                                    option.value === 'owner'
                                                }
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
                </div>
            </Dialog>
            <ConfirmDialog
                isOpen={confirmDeleteOpen}
                type="danger"
                title="Remove Member"
                confirmButtonProps={{ variant: 'solid', color: 'red' }}
                confirmText="Remove"
                cancelText="Cancel"
                onClose={handleCancelDelete}
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove{' '}
                    <span className="font-semibold">
                        {memberToDelete?.name || 'this member'}
                    </span>
                    {memberToDelete?.type === 'pending'
                        ? ' from pending invitations'
                        : ' from the team'}
                    ? This action cannot be undone.
                </p>
            </ConfirmDialog>
        </div>
    )
}

export default TeamAccess
