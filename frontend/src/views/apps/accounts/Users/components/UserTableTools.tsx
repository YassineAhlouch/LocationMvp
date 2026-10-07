import { useState, useEffect } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import PopoverFilter from '@/components/shared/PopoverFilter'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import SelectOptionWithPrefix from '@/components/shared/SelectOptionWithPrefix'
import useAccessControlData from '../hooks/useAccessControlData'
import { getStatusColor, roleOptions } from '../utils'
import classNames from '@/utils/classNames'
import { LiSearch, LiSetting4 } from '@/icons'

const statusOptions = [
    {
        value: '',
        label: 'All Status',
        color: 'bg-gray-400',
    },
    {
        value: 'active',
        label: 'Active',
        color: getStatusColor('active'),
    },
    {
        value: 'inactive',
        label: 'Inactive',
        color: getStatusColor('inactive'),
    },
    {
        value: 'suspended',
        label: 'Suspended',
        color: getStatusColor('suspended'),
    },
]

const UserTableTools = () => {
    const { pagingState, filterState, setQueryParams } = useAccessControlData()

    const [searchQuery, setSearchQuery] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('')
    const [selectedRoles, setSelectedRoles] = useState<string[]>([])

    useEffect(() => {
        setSearchQuery(pagingState.query || '')
        setSelectedStatus(filterState.status || '')

        if (filterState.role) {
            const roles = Array.isArray(filterState.role)
                ? filterState.role
                : filterState.role.split(',').filter(Boolean)
            setSelectedRoles(roles)
        } else {
            setSelectedRoles([])
        }
    }, [pagingState.query, filterState.status, filterState.role])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearchQuery(value)

        const newParams = {
            ...pagingState,
            query: value,
            pageIndex: 1,
        }
        setQueryParams(newParams)
    }

    const handleStatusChange = (option: { value: string }) => {
        const value = option.value || ''
        setSelectedStatus(value)

        const newParams = {
            ...pagingState,
            pageIndex: 1,
        }

        const newFilterState = {
            ...filterState,
        }

        if (typeof value !== 'string') {
            newFilterState.status = ''
        } else {
            newFilterState.status = value
        }

        setQueryParams({ ...newParams, ...newFilterState })
    }

    const handleRoleFilterChange = (
        selectedRoleData: Array<{ label: string; value: string }>,
    ) => {
        const roleValues = selectedRoleData.map((item) => item.value)
        setSelectedRoles(roleValues)

        const newParams = {
            ...pagingState,
            pageIndex: 1,
        }

        const newFilterState = {
            ...filterState,
        }

        if (roleValues.length > 0) {
            newFilterState.role = roleValues.join(',')
        } else {
            newFilterState.role = undefined
        }

        setQueryParams({ ...newParams, ...newFilterState })
    }

    return (
        <div className="flex flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between">
            <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearchChange}
                prefix={<LiSearch className="text-base" />}
                className="w-full sm:max-w-[250px]"
            />
            <div className="flex items-center gap-2 sm:justify-end">
                <div className="min-w-[120px]">
                    <Select
                        options={statusOptions}
                        value={statusOptions.find(
                            (option) => option.value === selectedStatus,
                        )}
                        onChange={handleStatusChange}
                        placeholder="Filter by status"
                        customInputDisplay={(selectedItem) => (
                            <SelectInputWithPrefix
                                label={selectedItem?.label}
                                prefix={
                                    selectedItem &&
                                    selectedItem.color && (
                                        <Badge
                                            className={classNames(
                                                'w-3 h-3 rounded-full',
                                                selectedItem.color,
                                            )}
                                        />
                                    )
                                }
                            />
                        )}
                        customOption={({ option, selected, CheckIcon }) => (
                            <SelectOptionWithPrefix
                                label={option.label}
                                prefix={
                                    option.color && (
                                        <Badge
                                            className={classNames(
                                                'w-3 h-3 rounded-full',
                                                option.color,
                                            )}
                                        />
                                    )
                                }
                                selected={selected}
                                checkIcon={CheckIcon}
                            />
                        )}
                    />
                </div>
                <PopoverFilter
                    data={roleOptions}
                    value={selectedRoles}
                    onChange={handleRoleFilterChange}
                    title="Filter by Role"
                    inputPlaceholder="Search roles..."
                    placement="bottom-start"
                    renderTrigger={
                        <Button className="relative" icon={<LiSetting4 />}>
                            <span className="flex items-center gap-1">
                                {selectedRoles.length > 0 ? (
                                    <span>Selected: </span>
                                ) : (
                                    <span>Filter by Role</span>
                                )}

                                {selectedRoles.length > 0 && (
                                    <span className="p-0.25 bg-primary text-white text-xs rounded w-4 h-4 flex items-center justify-center font-medium">
                                        {selectedRoles.length}
                                    </span>
                                )}
                            </span>
                        </Button>
                    }
                />
            </div>
        </div>
    )
}

export default UserTableTools
