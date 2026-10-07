import { useMemo } from 'react'
import Select from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import { useCrmDashboardStore } from '@/views/apps/customers/CrmDashboard/store/crmDashboardStore'
import { LiProfiles } from '@/icons'
import type { TeamMember } from '../types'
import type { SingleOption } from '@/components/ui/Select/types'

type TeamFilterProps = {
    teamMembers: TeamMember[]
    isLoading?: boolean
}

type TeamOption = SingleOption<{ avatar?: string; initials?: string }>

const TeamFilter = ({ teamMembers, isLoading }: TeamFilterProps) => {
    const { filters, setTeamSelection } = useCrmDashboardStore()

    const options: TeamOption[] = useMemo(() => {
        const allOption: TeamOption = {
            label: 'All Team',
            value: 'all',
        }

        const memberOptions: TeamOption[] = teamMembers.map((member) => ({
            label: member.name,
            value: member.id,
            avatar: member.avatar,
            initials: member.initials,
        }))

        return [allOption, ...memberOptions]
    }, [teamMembers])

    const selectedOption = useMemo(
        () =>
            options.find((opt) => opt.value === filters.teamSelection) ||
            options[0],
        [options, filters.teamSelection],
    )

    const handleChange = (option: TeamOption) => {
        setTeamSelection(option.value)
    }

    const customOption = ({
        option,
        selected,
        CheckIcon,
    }: {
        option: TeamOption
        hovered: boolean
        selected: boolean
        CheckIcon: React.ReactNode
    }) => (
        <div className="flex items-center gap-2 w-full">
            {option.avatar ? (
                <Avatar size={24} src={option.avatar} shape="circle">
                    {option.initials}
                </Avatar>
            ) : (
                <div className="text-lg">
                    <LiProfiles />
                </div>
            )}
            <span className="flex-1">{option.label}</span>
            {selected && <span className="text-primary-600">{CheckIcon}</span>}
        </div>
    )

    const customInputDisplay = (option: TeamOption | null) => {
        if (!option) return null
        return (
            <div className="flex items-center gap-2">
                {option.avatar ? (
                    <Avatar size={24} src={option.avatar} shape="circle">
                        {option.initials}
                    </Avatar>
                ) : (
                    <div className="text-lg">
                        <LiProfiles />
                    </div>
                )}
                <span>{option.label}</span>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            <div className="heading-text font-semibold">Team Filter</div>
            <Select
                options={options}
                value={selectedOption}
                onChange={handleChange}
                customOption={customOption}
                customInputDisplay={customInputDisplay}
                isLoading={isLoading}
                isSearchable
                placeholder="Select team member..."
            />
        </div>
    )
}

export default TeamFilter
