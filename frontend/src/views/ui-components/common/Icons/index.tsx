import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Container from '@/components/shared/Container'
import { HiOutlineExternalLink, HiOutlineHeart } from 'react-icons/hi'
import { SiGmail } from 'react-icons/si'
import { FaReact } from 'react-icons/fa'
import { BiHomeAlt } from 'react-icons/bi'
import { FiSettings } from 'react-icons/fi'
import { MdOutlineShoppingCart } from 'react-icons/md'
import {
    LiAward,
    LiBriefcase,
    LiCalculator,
    LiGift,
    LiActivity,
    LiAirplane,
} from '@/icons'
import LinearIcons from './LinearIcons'
import { useSearchParams, Link } from 'react-router'

const IconBox = ({
    children,
}: {
    children: React.ReactNode
    dark?: boolean
}) => (
    <div className=" w-20 h-20 rounded-2xl shadow-md text-3xl heading-text p-1">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center justify-center h-full w-full">
            {children}
        </div>
    </div>
)

interface IconSectionProps {
    title: string
    description: React.ReactNode
    href: string
    external?: boolean
    icons: React.ReactNode[]
}

const IconSection = ({
    title,
    description,
    href,
    external = false,
    icons,
}: IconSectionProps) => (
    <Card>
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="flex-1 h-full flex flex-col gap-2">
                <div>
                    <h5>{title}</h5>
                    <p className="mt-2 mb-6 lg:mb-12">{description}</p>
                </div>
                {external ? (
                    <a href={href} target="_blank" rel="noopener noreferrer">
                        <Button icon={<HiOutlineExternalLink />}>
                            Browse Icons
                        </Button>
                    </a>
                ) : (
                    <Link to={href}>
                        <Button icon={<HiOutlineExternalLink />}>
                            Browse Icons
                        </Button>
                    </Link>
                )}
            </div>
            <div className="flex justify-center w-full lg:w-[370px]">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg w-full p-6 lg:p-8">
                    <div className="grid grid-cols-3 gap-4 lg:gap-6">
                        {icons.map((icon, index) => (
                            <IconBox
                                key={index}
                                dark={index === icons.length - 1}
                            >
                                {icon}
                            </IconBox>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </Card>
)

const IconsOverview = () => (
    <Container size="sm" className="h-full flex flex-col justify-center gap-12">
        <IconSection
            title="React Icons"
            description="Include popular icons in your React projects easily with react-icons, which utilizes ES6 imports that allows you to include only the icons that your project is using."
            href="https://react-icons.github.io/react-icons/"
            external
            icons={[
                <FaReact />,
                <SiGmail />,
                <BiHomeAlt />,
                <FiSettings />,
                <HiOutlineHeart />,
                <MdOutlineShoppingCart />,
            ]}
        />

        <IconSection
            title="Linear Icons"
            description={
                <>
                    2000+ Free Linear Icons Set modified from the{' '}
                    <a
                        href="https://www.figma.com/community/file/1191440006557312499"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                    >
                        Figma community
                    </a>
                    . These icons are designed with a consistent stroke width
                    and style, perfect for modern UI designs. Licensed under CC
                    BY 4.0.
                </>
            }
            href="/ui-components/icons?type=linearIcons"
            icons={[
                <LiAward />,
                <LiBriefcase />,
                <LiCalculator />,
                <LiActivity />,
                <LiAirplane />,
                <LiGift />,
            ]}
        />
    </Container>
)

const Icons = () => {
    const [searchParams] = useSearchParams()
    const type = searchParams.get('type')

    if (type === 'linearIcons') {
        return <LinearIcons />
    }

    return <IconsOverview />
}

export default Icons
