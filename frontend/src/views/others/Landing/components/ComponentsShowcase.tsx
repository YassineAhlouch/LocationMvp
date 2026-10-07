import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Switcher } from '@/components/ui/Switcher'
import { Input } from '@/components/ui/Input'
import { Segment } from '@/components/ui/Segment'
import { Tag } from '@/components/ui/Tag'
import { Alert } from '@/components/ui/Alert'
import { Checkbox } from '@/components/ui/Checkbox'
import { Select } from '@/components/ui/Select'
import IconFrame from '@/components/shared/IconFrame'
import presetThemeSchemaConfig from '@/configs/preset-theme-schema.config'
import Progress from '@/components/ui/Progress'
import Menu from '@/components/ui/Menu'
import { colors } from '@/constants/colors.constant'
import {
    LiUser,
    LiCard,
    LiMail,
    LiChart,
    LiStar,
    LiSearch,
    LiTick,
} from '@/icons'
import classNames from '@/utils/classNames'
import Histogram from '@/components/shared/Historgram'
import Slider from '@/components/ui/Slider'
import Calendar from '@/components/ui/Calendar'
import SegmentedProgressBar from '@/components/shared/SegmentProgressBar'
import { motion } from 'motion/react'
import type { Mode } from '../types'

const sampleData = [
    { value: 15, label: '0-4' },
    { value: 28, label: '4-8' },
    { value: 45, label: '8-12' },
    { value: 32, label: '12-16' },
    { value: 18, label: '16-20' },
    { value: 35, label: '20-24' },
    { value: 52, label: '24-28' },
    { value: 48, label: '28-32' },
    { value: 25, label: '32-36' },
    { value: 45, label: '36-40' },
    { value: 62, label: '40-44' },
    { value: 55, label: '44-48' },
    { value: 35, label: '48-52' },
    { value: 18, label: '52-56' },
    { value: 42, label: '56-60' },
    { value: 58, label: '60-64' },
    { value: 45, label: '64-68' },
    { value: 28, label: '68-72' },
    { value: 15, label: '72-76' },
    { value: 32, label: '76-80' },
    { value: 48, label: '80-84' },
    { value: 35, label: '84-88' },
    { value: 22, label: '88-92' },
    { value: 12, label: '92-96' },
    { value: 35, label: '96-100' },
]

const ComponentsShowcase = ({
    mode,
    themeSchema,
    onThemeChange,
}: {
    mode: Mode
    themeSchema: string
    onThemeChange: (theme: string) => void
}) => {
    const [check1, setCheck1] = useState(true)
    const [switch1, setSwitch1] = useState(false)
    const [range, setRange] = useState<[number, number]>([20, 70])
    const [newsletter, setNewsletter] = useState('daily')
    const [date, setDate] = useState<Date | null>(null)
    const [accessControl, setAccessControl] = useState(['level-1', 'level-2'])

    const onAccessControlChange = (val: string, checked: boolean) => {
        if (checked) {
            setAccessControl([...accessControl, val])
        } else {
            setAccessControl(accessControl.filter((item) => item !== val))
        }
    }

    const container = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    }
    const item = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className="space-y-4"
            >
                <motion.div variants={item}>
                    <Card>
                        <Menu variant="subtle">
                            <Menu.MenuItem eventKey="profile" isActive>
                                <span className="text-lg">
                                    <LiUser />
                                </span>
                                <span>Profile</span>
                            </Menu.MenuItem>
                            <Menu.MenuItem eventKey="billing">
                                <span className="text-lg">
                                    <LiCard />
                                </span>
                                <span>Billing</span>
                            </Menu.MenuItem>
                            <Menu.MenuItem eventKey="messages">
                                <span className="text-lg">
                                    <LiMail />
                                </span>
                                <span>Messages</span>
                            </Menu.MenuItem>
                            <Menu.MenuItem eventKey="stats">
                                <span className="text-lg">
                                    <LiChart />
                                </span>
                                <span>Stats</span>
                            </Menu.MenuItem>
                            <Menu.MenuItem eventKey="premium">
                                <span className="text-lg">
                                    <LiStar />
                                </span>
                                <span>Premium</span>
                            </Menu.MenuItem>
                        </Menu>
                    </Card>
                </motion.div>
                <motion.div variants={item}>
                    <Card>
                        <div className="flex items-center justify-between">
                            <span className="heading-text font-medium text-base">
                                Notifications
                            </span>
                            <Switcher checked={switch1} onChange={setSwitch1} />
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <span>Allow push notifications</span>
                        </div>
                        <div className="mt-4">
                            <Button block variant="solid">
                                Update Settings
                            </Button>
                        </div>
                    </Card>
                </motion.div>
                <motion.div variants={item}>
                    <Card>
                        <div className="mb-4 heading-text font-medium">
                            Theme
                        </div>
                        <div className="inline-flex items-center gap-2">
                            {Object.entries(presetThemeSchemaConfig).map(
                                ([key, value]) => (
                                    <button
                                        key={key}
                                        className={classNames(
                                            'h-6 w-6 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800',
                                            themeSchema === key &&
                                                'ring-2 ring-primary',
                                        )}
                                        style={{
                                            backgroundColor:
                                                value[mode as 'light' | 'dark']
                                                    .primary || '',
                                        }}
                                        onClick={() => onThemeChange(key)}
                                    />
                                ),
                            )}
                        </div>
                    </Card>
                </motion.div>
                <motion.div variants={item}>
                    <Card>
                        <Segment
                            value={newsletter}
                            onChange={(val) => setNewsletter(val as string)}
                            className="flex flex-col gap-4 bg-transparent dark:bg-transparent p-0 min-w-0"
                        >
                            {['weekly', 'daily'].map((val) => (
                                <Segment.Item key={val} value={val}>
                                    {({ active, onSegmentItemClick }) => (
                                        <div
                                            className={classNames(
                                                'border rounded-lg p-4 cursor-pointer transition-all select-none',
                                                active
                                                    ? 'border-primary ring-1 ring-primary bg-primary-subtle'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
                                            )}
                                            onClick={onSegmentItemClick}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="pr-4 min-w-0">
                                                    <div className="font-bold heading-text truncate">
                                                        {val === 'weekly'
                                                            ? 'Weekly Digest'
                                                            : 'Daily Briefing'}
                                                    </div>
                                                    <div className="heading-text mt-1">
                                                        {val === 'weekly'
                                                            ? "Get a summary of the week's top stories every Friday."
                                                            : 'Receive a comprehensive update every morning.'}
                                                    </div>
                                                </div>
                                                {active ? (
                                                    <span className="text-primary text-lg shrink-0">
                                                        <LiTick />
                                                    </span>
                                                ) : (
                                                    <div className="h-5 w-5 rounded-full border border-gray-300 dark:border-gray-600 shrink-0 mt-0.5" />
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </Segment.Item>
                            ))}
                        </Segment>
                    </Card>
                </motion.div>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className="space-y-4"
            >
                <motion.div variants={item}>
                    <Card bodyClass="flex flex-col gap-2">
                        <Input
                            placeholder="Search for people"
                            prefix={<LiSearch className="text-lg" />}
                        />
                        <div>
                            {[
                                {
                                    src: '/img/avatars/thumb-1.jpg',
                                    name: 'Richard Jones',
                                    handle: '@richard',
                                },
                                {
                                    src: '/img/avatars/thumb-2.jpg',
                                    name: 'John Harrison',
                                    handle: '@john',
                                },
                                {
                                    src: '/img/avatars/thumb-3.jpg',
                                    name: 'Melissa Waters',
                                    handle: '@melissa',
                                },
                            ].map((user) => (
                                <div
                                    key={user.handle}
                                    className="flex items-center justify-between py-2 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar
                                            src={user.src}
                                            shape="circle"
                                            size={30}
                                            icon={<LiUser />}
                                        />
                                        <div>
                                            <div className="font-medium heading-text">
                                                {user.name}
                                            </div>
                                            <div className="text-xs">
                                                {user.handle}
                                            </div>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="default">
                                        View
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button block variant="default">
                            View All
                        </Button>
                    </Card>
                </motion.div>
                <motion.div variants={item}>
                    <div className="flex flex-wrap gap-2">
                        <Tag
                            className={classNames(
                                'border-0',
                                colors.emerald.iconBg,
                                colors.emerald.iconText,
                            )}
                        >
                            New
                        </Tag>
                        <Tag
                            className={classNames(
                                'border-0',
                                colors.blue.iconBg,
                                colors.blue.iconText,
                            )}
                        >
                            Processing
                        </Tag>
                        <Tag
                            className={classNames(
                                'border-0',
                                colors.red.iconBg,
                                colors.red.iconText,
                            )}
                        >
                            Error
                        </Tag>
                        <Tag
                            className={classNames(
                                'border-0',
                                colors.purple.iconBg,
                                colors.purple.iconText,
                            )}
                        >
                            Design
                        </Tag>
                        <Tag
                            className={classNames(
                                'border-0',
                                colors.cyan.iconBg,
                                colors.cyan.iconText,
                            )}
                        >
                            Development
                        </Tag>
                    </div>
                </motion.div>
                <motion.div variants={item}>
                    <Card className="flex justify-center">
                        <Calendar
                            value={date}
                            onChange={(val) => setDate(val as Date)}
                        />
                    </Card>
                </motion.div>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className="space-y-4"
            >
                <motion.div variants={item}>
                    <Card>
                        <h5 className="mb-4">Sign In</h5>
                        <div className="space-y-4">
                            <Input placeholder="Username" />
                            <Input type="password" placeholder="Password" />
                            <Select
                                placeholder="Select Role"
                                options={[
                                    { label: 'Admin', value: 'admin' },
                                    { label: 'User', value: 'user' },
                                ]}
                            />
                            <div className="flex gap-4">
                                <Checkbox checked={check1} onChange={setCheck1}>
                                    Remember me
                                </Checkbox>
                            </div>
                            <Button variant="solid" block>
                                Sign In
                            </Button>
                        </div>
                    </Card>
                </motion.div>
                <motion.div variants={item}>
                    <Card>
                        <Alert type="info" showIcon className="mb-4">
                            Welcome back! You have 3 new messages.
                        </Alert>
                        <Alert type="danger" showIcon>
                            Session expired. Please log in again.
                        </Alert>
                    </Card>
                </motion.div>
                <motion.div variants={item}>
                    <Card>
                        <div className="heading-text font-semibold mb-1">
                            Daily Transactions limit
                        </div>
                        <div className="text-right font-semibold heading-text mb-2">
                            75%
                        </div>
                        <SegmentedProgressBar
                            segments={35}
                            percent={75}
                            height={20}
                            gap={2}
                        />
                        <div className="mt-2">
                            <span className="heading-text font-medium">
                                $1,250
                            </span>{' '}
                            used
                        </div>
                    </Card>
                </motion.div>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className="space-y-4"
            >
                <motion.div variants={item}>
                    <Card>
                        <div className="flex items-center gap-4">
                            <IconFrame>
                                <LiChart className="heading-text text-lg" />
                            </IconFrame>
                            <div>
                                <p>Total Revenue</p>
                                <h4>$42,593</h4>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <span className="flex items-center gap-1">
                                <Tag
                                    className={classNames(
                                        'border-0',
                                        colors.emerald.iconBg,
                                        colors.emerald.iconText,
                                    )}
                                >
                                    +12.5%
                                </Tag>
                                <span>from last month</span>
                            </span>
                        </div>
                    </Card>
                </motion.div>
                <motion.div variants={item}>
                    <Card>
                        <h5 className="mb-4">Team Members</h5>
                        <Avatar.Group
                            chained
                            maxCount={4}
                            omittedAvatarProps={{ shape: 'circle', size: 30 }}
                        >
                            <Avatar
                                size={30}
                                shape="circle"
                                src="/img/avatars/thumb-4.jpg"
                            />
                            <Avatar
                                size={30}
                                shape="circle"
                                src="/img/avatars/thumb-5.jpg"
                            />
                            <Avatar
                                size={30}
                                shape="circle"
                                src="/img/avatars/thumb-1.jpg"
                            />
                            <Avatar
                                size={30}
                                shape="circle"
                                src="/img/avatars/thumb-3.jpg"
                            />
                            <Avatar
                                size={30}
                                shape="circle"
                                icon={<LiUser />}
                            />
                        </Avatar.Group>
                    </Card>
                </motion.div>
                <motion.div variants={item}>
                    <Card>
                        <div className="flex items-center justify-between mb-2">
                            <span className="heading-text font-medium">
                                Storage
                            </span>
                            <span className="font-semibold">75%</span>
                        </div>
                        <Progress percent={75} showInfo={false} />
                        <p className="mt-2 text-xs font-medium">
                            15GB of 20GB used
                        </p>
                    </Card>
                </motion.div>
                <motion.div variants={item}>
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <span className="heading-text font-medium">
                                Distribution
                            </span>
                            <span className="text-xs font-medium">
                                {range[0]} - {range[1]}
                            </span>
                        </div>
                        <Histogram
                            data={sampleData}
                            range={range}
                            min={0}
                            max={100}
                        />
                        <div className="mt-4">
                            <Slider.Range
                                min={0}
                                max={100}
                                value={range}
                                step={1}
                                onChange={(val) =>
                                    setRange(val as [number, number])
                                }
                            />
                        </div>
                    </Card>
                </motion.div>
                <motion.div variants={item}>
                    <Card>
                        <div className="mb-4 heading-text font-semibold">
                            Access is granted for
                        </div>
                        <div className="space-y-4">
                            {[
                                {
                                    val: 'level-4',
                                    label: 'Confidential data or Level-4 data',
                                },
                                {
                                    val: 'level-3',
                                    label: 'Restricted data or Level-3 data',
                                },
                                {
                                    val: 'level-2',
                                    label: 'Internal data or Level-2 data',
                                },
                                {
                                    val: 'level-1',
                                    label: 'Public domain data or Level-1 data',
                                },
                            ].map(({ val, label }) => (
                                <Checkbox
                                    key={val}
                                    checked={accessControl.includes(val)}
                                    onChange={(checked) =>
                                        onAccessControlChange(val, checked)
                                    }
                                >
                                    {label}
                                </Checkbox>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default ComponentsShowcase
