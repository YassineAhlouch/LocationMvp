import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Table from '@/components/ui/Table'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import { colors } from '@/constants/colors.constant'
import { LiClock } from '@/icons'
import classNames from '@/utils/classNames'
import type { ComplianceData } from '../types'

type ComplianceIssuesProps = {
    data: ComplianceData
}

const ComplianceIssues = ({ data }: ComplianceIssuesProps) => {
    const { issues } = data

    const displayedIssues = issues.slice(0, 6)

    const getUrgencyClass = (urgency: string) => {
        switch (urgency) {
            case 'overdue':
                return `${colors.red.iconBg} ${colors.red.iconText}`
            case 'critical':
                return `${colors.rose.iconBg} ${colors.rose.iconText}`
            case 'warning':
                return `${colors.yellow.iconBg} ${colors.yellow.iconText}`
            default:
                return ''
        }
    }

    const getUrgencyLabel = (urgency: string) => {
        switch (urgency) {
            case 'overdue':
                return 'Overdue'
            case 'critical':
                return 'Critical'
            case 'warning':
                return 'Warning'
            default:
                return urgency
        }
    }

    return (
        <Card bodyClass="p-0">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h5>Compliance Issues</h5>
                <Button>See All</Button>
            </div>
            <Table hoverable>
                <Table.THead>
                    <Table.Tr>
                        <Table.Th>Employee Name</Table.Th>
                        <Table.Th>Type</Table.Th>
                        <Table.Th>Department</Table.Th>
                        <Table.Th>Status</Table.Th>
                    </Table.Tr>
                </Table.THead>
                <Table.TBody>
                    {displayedIssues.map((issue) => (
                        <Table.Tr key={issue.id}>
                            <Table.Td>
                                <div className="flex items-center gap-3">
                                    <Avatar
                                        size={25}
                                        shape="circle"
                                        src={issue.employee.avatar}
                                        alt={issue.employee.name}
                                    />
                                    <div>
                                        <div className="font-medium heading-text">
                                            {issue.employee.name}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {issue.employee.email}
                                        </div>
                                    </div>
                                </div>
                            </Table.Td>
                            <Table.Td>
                                <div>
                                    <div className="heading-text">
                                        {issue.description}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span>
                                            <LiClock />
                                        </span>
                                        <span className="text-xs font-medium">
                                            {issue.daysRemaining < 0
                                                ? `${Math.abs(issue.daysRemaining)} days overdue`
                                                : `${issue.daysRemaining} days remaining`}
                                        </span>
                                    </div>
                                </div>
                            </Table.Td>
                            <Table.Td>
                                <Tag>{issue.employee.department}</Tag>
                            </Table.Td>
                            <Table.Td>
                                <Tag
                                    className={classNames(
                                        'border-0',
                                        getUrgencyClass(issue.urgency),
                                    )}
                                >
                                    {getUrgencyLabel(issue.urgency)}
                                </Tag>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.TBody>
            </Table>
        </Card>
    )
}

export default ComplianceIssues
