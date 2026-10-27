import { useMemo } from 'react'
import Button from '@/components/ui/Button'
import DebouceInput from '@/components/shared/DebouceInput'
import PopoverFilter from '@/components/shared/PopoverFilter'
import UsersAvatarGroup from '@/components/shared/UsersAvatarGroup'
import PeriodPicker from '@/components/shared/PeriodPicker'
import ProjectTab from '@/components/view/ProjectTab'
import { useScrumboardStore } from '../store/scrumboardStore'
import useResponsive from '@/utils/hooks/useResponsive'
import useScrumboard from '../hooks/useScrumboardData'
import { LiSearch, LiSetting4, LiAdd } from '@/icons'

const ScrumboardHeader = () => {
    const { projectMeta, columns } = useScrumboard()

    const { larger, smaller } = useResponsive()

    const setQuery = useScrumboardStore((state) => state.setQuery)
    const setDisplayedColumns = useScrumboardStore(
        (state) => state.setDisplayedColumns,
    )
    const displayedColumns = useScrumboardStore(
        (state) => state.displayedColumns,
    )
    const setColumnDialog = useScrumboardStore((state) => state.setColumnDialog)
    const dateRange = useScrumboardStore((state) => state.dateRange)
    const setDateRange = useScrumboardStore((state) => state.setDateRange)

    const columnOptions = useMemo(
        () => columns.map((col) => ({ label: col.name, value: col.id })),
        [columns],
    )

    const handleAddColumn = () => {
        setColumnDialog({
            open: true,
            type: 'add',
        })
    }

    const renderActionSection = () => (
        <div className="flex items-center gap-2 my-2">
            <DebouceInput
                placeholder="Search"
                prefix={<LiSearch />}
                onChange={(e) => setQuery(e.target.value)}
            />
            <PopoverFilter
                data={columnOptions}
                placement="bottom-end"
                title={
                    <span className="flex items-center gap-2">
                        <LiSetting4 className="text-lg" /> <span>Filter</span>
                    </span>
                }
                value={displayedColumns}
                onChange={(data) => {
                    setDisplayedColumns(data.map((item) => item.value))
                }}
            />
            <Button icon={<LiAdd />} variant="subtle" onClick={handleAddColumn}>
                Add Column
            </Button>
        </div>
    )

    return (
        <div className="pt-4 px-4 border-b border-gray-200 dark:border-gray-800 ">
            {projectMeta && (
                <>
                    <div className="flex flex-col md:flex-row md:justify-between gap-4">
                        <div>
                            <h4 className="">{projectMeta.title}</h4>
                            <p className="mt-2">{projectMeta.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <UsersAvatarGroup
                                users={projectMeta.participantMembers}
                            />
                            <PeriodPicker
                                value={dateRange}
                                onChange={setDateRange}
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <ProjectTab tabListClass="lg:border-0 lg:mx-0 -mx-4">
                            {larger.lg && renderActionSection()}
                        </ProjectTab>
                        {smaller.lg && renderActionSection()}
                    </div>
                </>
            )}
        </div>
    )
}

export default ScrumboardHeader
