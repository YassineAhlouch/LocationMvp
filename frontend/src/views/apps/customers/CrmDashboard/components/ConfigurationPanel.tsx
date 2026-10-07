import { useMemo } from 'react'
import TimeHorizonFilter from './TimeHorizonFilter'
import TeamFilter from './TeamFilter'
import PipelineSegmentation from './PipelineSegmentation'
import ViewPreferences from './ViewPreferences'
import { apiGetProjectMembers } from '@/services/ProjectService'
import useSWR from 'swr'
import type { TeamMember } from '../types'

type ProjectMembersResponse = {
    participantMembers: Array<{
        id: string
        name: string
        img: string
    }>
    allMembers: Array<{
        id: string
        name: string
        img: string
    }>
}

const ConfigurationPanel = () => {
    const { data, isLoading } = useSWR<ProjectMembersResponse>(
        '/api/projects/scrum-board/members',
        () => apiGetProjectMembers<ProjectMembersResponse>(),
    )

    const teamMembers: TeamMember[] = useMemo(
        () =>
            (data?.participantMembers || []).map((member) => ({
                id: member.id,
                name: member.name,
                avatar: member.img,
                initials: member.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase(),
            })),
        [data],
    )

    return (
        <div className="p-4">
            <div className="flex flex-col gap-y-6">
                <TimeHorizonFilter />
                <TeamFilter teamMembers={teamMembers} isLoading={isLoading} />
                <PipelineSegmentation />
                <ViewPreferences />
            </div>
        </div>
    )
}

export default ConfigurationPanel
