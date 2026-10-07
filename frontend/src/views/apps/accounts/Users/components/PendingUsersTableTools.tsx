import { useState, useEffect } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import PopoverFilter from '@/components/shared/PopoverFilter'
import useAccessControlData from '../hooks/useAccessControlData'
import { roleOptions } from '../utils'
import { LiSearch, LiSetting4 } from '@/icons'

const PendingUsersTableTools = () => {
    const { pagingState, filterState, setQueryParams } = useAccessControlData()

    const [searchQuery, setSearchQuery] = useState('')
    const [selectedRoles, setSelectedRoles] = useState<string[]>([])

    useEffect(() => {
        setSearchQuery(pagingState.query || '')

        if (filterState.requestedRole) {
            const roles = Array.isArray(filterState.requestedRole)
                ? filterState.requestedRole
                : filterState.requestedRole.split(',').filter(Boolean)
            setSelectedRoles(roles)
        } else {
            setSelectedRoles([])
        }
    }, [pagingState.query, filterState.status, filterState.requestedRole])

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
            newFilterState.requestedRole = roleValues.join(',')
        } else {
            newFilterState.requestedRole = undefined
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
            <div className="flex items-center gap-2 justify-between sm:justify-end">
                <PopoverFilter
                    data={roleOptions}
                    value={selectedRoles}
                    onChange={handleRoleFilterChange}
                    title="Filter by Requested Role"
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

export default PendingUsersTableTools
