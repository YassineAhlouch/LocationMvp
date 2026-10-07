import {
    LiHash,
    LiStatus,
    LiUserAdd,
    LiCake,
    LiStatusUp,
    LiRepeat,
    LiStar,
    LiArchiveBook,
    LiStory,
} from '@/icons'
import { useAnnouncementsStore } from '../store/announcementsStore'
import { apiGetAnnouncementCategories } from '@/services/HrmService'
import useSWR from 'swr'
import classNames from '@/utils/classNames'
import type { Category } from '../types'

const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'all':
            return <LiHash />
        case 'general':
            return <LiStatus />
        case 'new-hire':
            return <LiUserAdd />
        case 'policy':
            return <LiArchiveBook />
        case 'promotions':
            return <LiStar />
        case 'transfer':
            return <LiRepeat />
        case 'training':
            return <LiStatusUp />
        case 'special':
            return <LiCake />
        default:
            return <LiStory />
    }
}

const AnnouncementsSidebar = () => {
    const { data: categories, isLoading } = useSWR<Category[]>(
        '/hrm/announcements/categories',
        apiGetAnnouncementCategories<Category[]>,
        { revalidateOnFocus: false },
    )

    const selectedCategory = useAnnouncementsStore(
        (state) => state.selectedCategory,
    )
    const setSelectedCategory = useAnnouncementsStore(
        (state) => state.setSelectedCategory,
    )

    const handleCategoryClick = (categoryId: string) => {
        setSelectedCategory(categoryId)
    }

    return (
        <div className="w-full lg:max-w-64">
            <nav aria-label="Announcement categories">
                <div className="space-y-1" role="list">
                    {categories?.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category.id)}
                            disabled={isLoading}
                            role="listitem"
                            aria-current={
                                selectedCategory === category.id
                                    ? 'page'
                                    : undefined
                            }
                            aria-label={`${category.name} category, ${category.count} announcements`}
                            className={classNames(
                                'w-full flex items-center gap-2 p-2 rounded-lg transition-colors',
                                selectedCategory === category.id
                                    ? 'bg-gray-100 dark:bg-gray-700 font-medium'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700',
                                isLoading && 'opacity-50 cursor-not-allowed',
                            )}
                        >
                            <span className="text-lg">
                                {getCategoryIcon(category.id)}
                            </span>
                            <span className="heading-text">
                                {category.name}
                            </span>
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    )
}

export default AnnouncementsSidebar
