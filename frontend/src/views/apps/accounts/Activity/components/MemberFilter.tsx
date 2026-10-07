import { useCallback } from 'react'
import Avatar from '@/components/ui/Avatar'
import Checkbox from '@/components/ui/Checkbox'
import Loading from '@/components/shared/Loading'
import MediaSkeleton from '@/components/shared/loaders/MediaSkeleton'
import type { Member } from '../types'

type MemberFilterProps = {
    members: Member[]
    membersLoading: boolean
    selectedMembers: string[]
    onMemberToggle: (memberId: string) => void
    onSelectAll: () => void
    onClearAll: () => void
}

const MemberFilter = ({
    members,
    membersLoading,
    selectedMembers,
    onMemberToggle,
    onSelectAll,
    onClearAll,
}: MemberFilterProps) => {
    const handleMemberClick = useCallback(
        (memberId: string) => {
            onMemberToggle(memberId)
        },
        [onMemberToggle],
    )

    const handleSelectAllClick = () => {
        if (selectedMembers.length === members.length) {
            onClearAll()
        } else {
            onSelectAll()
        }
    }

    const isAllSelected =
        selectedMembers.length === members.length && members.length > 0

    return (
        <div className="px-2">
            <div className="mb-2">
                <div
                    onClick={handleSelectAllClick}
                    className="flex items-center justify-between w-full p-2 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <Checkbox
                            checked={isAllSelected}
                            onChange={() => handleSelectAllClick()}
                        >
                            <span className="font-medium">
                                SELECT ALL ({members.length})
                            </span>
                        </Checkbox>
                    </div>
                    <span className="text-xs">ACTIVITIES</span>
                </div>
            </div>
            <Loading loading={membersLoading} type="default">
                <div className="flex flex-col gap-2">
                    {members.map((member) => {
                        const isSelected = selectedMembers.includes(member.id)
                        return (
                            <div
                                key={member.id}
                                className="flex items-center justify-between gap-2 py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
                                onClick={() => handleMemberClick(member.id)}
                            >
                                <div className="flex items-center flex-1 gap-2">
                                    <Checkbox checked={isSelected} />
                                    <div className="flex items-center gap-2">
                                        <Avatar
                                            src={member.img}
                                            size={25}
                                            shape="circle"
                                            alt={member.name}
                                        />
                                        <span className="heading-text font-medium">
                                            {member.name}
                                        </span>
                                    </div>
                                </div>
                                <span>{member.activityCount}</span>
                            </div>
                        )
                    })}
                </div>
            </Loading>

            {/* Loading Skeleton */}
            {membersLoading && (
                <div className="space-y-3 mt-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="flex items-center p-3">
                            <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded mr-3" />
                            <MediaSkeleton
                                avatarProps={{ width: 32, height: 32 }}
                                titleProps={{ height: 16 }}
                                textProps={{ height: 12 }}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MemberFilter
