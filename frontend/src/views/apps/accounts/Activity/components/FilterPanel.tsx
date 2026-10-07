import { useState, useCallback, useContext, useMemo } from 'react'
import { apiGetProjectMembers } from '@/services/ProjectService'
import useSWR from 'swr'
import Scroll from '@/components/ui/Scroll'
import Segment from '@/components/ui/Segment'
import KeywordFilter from './KeywordFilter'
import MemberFilter from './MemberFilter'
import DataContext from '../context/DataContext'

import type { TabValue, FilterState, Member } from '../types'

type ProjectMembersResponse = {
    allMembers: {
        id: string
        name: string
        firstName: string
        lastName: string
        email: string
        img: string
    }[]
}

const FilterPanel = () => {
    const { filter, onFilterChange } = useContext(DataContext)

    const { data: membersData, isLoading: membersLoading } = useSWR(
        '/activity/members',
        () => apiGetProjectMembers<ProjectMembersResponse>(),
    )

    const members: Member[] = useMemo(() => {
        if (!membersData?.allMembers) return []
        return membersData.allMembers.map((member) => ({
            ...member,
            // eslint-disable-next-line react-hooks/purity
            activityCount: Math.floor(Math.random() * 1000) + 1,
        }))
    }, [membersData])

    const [filterState, setFilterState] = useState<FilterState>({
        activeTab: 'keywords',
        selectedMembers: filter.members || [],
        selectedKeyword: filter.keyword || null,
        customKeywords: [],
    })

    const handleTabChange = useCallback((tab: TabValue) => {
        setFilterState((prev) => ({
            ...prev,
            activeTab: tab,
        }))
    }, [])

    const handleKeywordSelect = useCallback(
        (keyword: string | null) => {
            const newFilter = {
                ...filter,
                keyword: keyword,
            }

            setFilterState((prev) => ({
                ...prev,
                selectedKeyword: keyword,
            }))

            onFilterChange(newFilter)
        },
        [filter, onFilterChange],
    )

    const handleMemberToggle = useCallback(
        (memberId: string) => {
            const currentMembers = filterState.selectedMembers
            const newMembers = currentMembers.includes(memberId)
                ? currentMembers.filter((id) => id !== memberId)
                : [...currentMembers, memberId]

            const newFilter = {
                ...filter,
                members: newMembers.length > 0 ? newMembers : undefined,
            }

            setFilterState((prev) => ({
                ...prev,
                selectedMembers: newMembers,
            }))

            onFilterChange(newFilter)
        },
        [filterState.selectedMembers, filter, onFilterChange],
    )

    const handleSelectAll = useCallback(() => {
        const allMemberIds = members.map((member) => member.id)
        const newFilter = {
            ...filter,
            members: allMemberIds,
        }

        setFilterState((prev) => ({
            ...prev,
            selectedMembers: allMemberIds,
        }))

        onFilterChange(newFilter)
    }, [members, filter, onFilterChange])

    const handleClearAll = useCallback(() => {
        const newFilter = {
            ...filter,
            members: undefined,
        }

        setFilterState((prev) => ({
            ...prev,
            selectedMembers: [],
        }))

        onFilterChange(newFilter)
    }, [filter, onFilterChange])

    return (
        <>
            <div className="p-4">
                <h5 className="text-lg font-semibold mb-4">Filters by</h5>
                <Segment
                    value={filterState.activeTab}
                    onChange={(val) => handleTabChange(val as TabValue)}
                    className="w-full"
                >
                    <Segment.Item value="keywords">Keywords</Segment.Item>
                    <Segment.Item value="members">Members</Segment.Item>
                </Segment>
            </div>
            <div className="absolute w-full h-[calc(100%-120px)]">
                <Scroll className="h-full" scrollbars="vertical">
                    {filterState.activeTab === 'keywords' ? (
                        <KeywordFilter
                            selectedKeyword={filterState.selectedKeyword}
                            onKeywordSelect={handleKeywordSelect}
                        />
                    ) : (
                        <MemberFilter
                            members={members}
                            membersLoading={membersLoading}
                            selectedMembers={filterState.selectedMembers}
                            onMemberToggle={handleMemberToggle}
                            onSelectAll={handleSelectAll}
                            onClearAll={handleClearAll}
                        />
                    )}
                </Scroll>
            </div>
        </>
    )
}

export default FilterPanel
