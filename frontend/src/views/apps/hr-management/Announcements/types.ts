import type { TableQueries } from '@/@types/common'

// Category Types
export type Category = {
    id: string
    name: string
    color: string
    count: number
    icon?: string
}

// Media Types
export type MediaType = 'photo' | 'video'

export type Media = {
    id: string
    type: MediaType
    url: string
    thumbnail?: string
    name: string
    size: number
}

// Reaction Types
export type Reaction = {
    emoji: string
    count: number
    users: {
        id: string
        name: string
    }[]
    reacted?: boolean
}

// Comment Types
export type CommentReply = {
    id: string
    author: {
        id: string
        name: string
        avatar?: string
    }
    text: string
    createdAt: string
}

export type Comment = {
    id: string
    author: {
        id: string
        name: string
        avatar?: string
    }
    text: string
    createdAt: string
    replies?: CommentReply[]
    reactions?: Reaction[]
}

// Announcement Types
export type Announcement = {
    id: string
    author: {
        id: string
        name: string
        title: string
        avatar?: string
    }
    category: string
    title: string
    description: string
    media?: Media[]
    reactions: Reaction[]
    comments: Comment[]
    isPinned: boolean
    createdAt: string
    updatedAt: string
}

// API Response Types
export type GetAnnouncementsResponse = {
    announcements: Announcement[]
    categories: Category[]
    pinned: Announcement[]
    total: number
}

// Request Types
export type CreateAnnouncementRequest = {
    title: string
    description: string
    category: string
    media?: File[]
}

export type UpdateAnnouncementRequest = {
    title?: string
    description?: string
    category?: string
    media?: File[]
}

export type CreateCategoryRequest = {
    name: string
    color: string
}

export type AddReactionRequest = {
    announcementId: string
    emoji: string
}

export type AddCommentRequest = {
    announcementId: string
    text: string
}

// Filter and Sort Types
export type DateRange = {
    start: string
    end: string
}

export type SortOption = 'date-desc' | 'date-asc' | 'reactions' | 'comments'

export type AnnouncementRequestParams = TableQueries & {
    category?: string
    dateRange?: DateRange
    sortBy?: SortOption
}

// Store Types
export type ModalState = {
    viewAnnouncement: {
        isOpen: boolean
        announcementId: string | null
    }
    createCategory: {
        isOpen: boolean
    }
    editAnnouncement: {
        isOpen: boolean
        announcementId: string | null
    }
}

export type AnnouncementsStoreState = {
    // View State
    selectedCategory: string
    dateRange: DateRange | null
    sortBy: SortOption

    // Modal States
    modals: ModalState

    // UI State
    expandedComments: Set<string>
    reactionPickerOpen: string | null

    // Mobile State
    sidebarCollapsed: boolean
    pinnedCollapsed: boolean
}

export type AnnouncementsStoreActions = {
    // Category Actions
    setSelectedCategory: (category: string) => void

    // Filter Actions
    setDateRange: (range: DateRange | null) => void
    setSortBy: (sort: SortOption) => void

    // Modal Actions
    openViewModal: (announcementId: string) => void
    openCreateCategoryModal: () => void
    openEditModal: (announcementId: string) => void
    closeAllModals: () => void

    // UI Actions
    toggleComments: (announcementId: string) => void
    openReactionPicker: (announcementId: string) => void
    closeReactionPicker: () => void

    // Mobile Actions
    toggleSidebar: () => void
    togglePinned: () => void

    // Reset
    resetState: () => void
}
