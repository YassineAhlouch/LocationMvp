import { create } from 'zustand'
import sleep from '@/utils/sleep'
import type {
    AnnouncementsStoreState,
    AnnouncementsStoreActions,
    DateRange,
    SortOption,
} from '../types'

type AnnouncementsStore = AnnouncementsStoreState & AnnouncementsStoreActions

const initialState: AnnouncementsStoreState = {
    selectedCategory: 'all',
    dateRange: null,
    sortBy: 'date-desc',
    modals: {
        viewAnnouncement: {
            isOpen: false,
            announcementId: null,
        },
        createCategory: {
            isOpen: false,
        },
        editAnnouncement: {
            isOpen: false,
            announcementId: null,
        },
    },
    expandedComments: new Set<string>(),
    reactionPickerOpen: null,
    sidebarCollapsed: false,
    pinnedCollapsed: false,
}

export const useAnnouncementsStore = create<AnnouncementsStore>()((set) => ({
    ...initialState,

    setSelectedCategory: (category: string) =>
        set({ selectedCategory: category }),

    setDateRange: (range: DateRange | null) => set({ dateRange: range }),

    setSortBy: (sort: SortOption) => set({ sortBy: sort }),

    openViewModal: (announcementId: string) =>
        set((state) => ({
            modals: {
                ...state.modals,
                viewAnnouncement: {
                    isOpen: true,
                    announcementId,
                },
            },
        })),

    openCreateCategoryModal: () =>
        set((state) => ({
            modals: {
                ...state.modals,
                createCategory: {
                    isOpen: true,
                },
            },
        })),

    openEditModal: (announcementId: string) =>
        set((state) => ({
            modals: {
                ...state.modals,
                editAnnouncement: {
                    isOpen: true,
                    announcementId,
                },
            },
        })),

    closeAllModals: async () => {
        set((state) => ({
            modals: {
                viewAnnouncement: {
                    isOpen: false,
                    announcementId:
                        state.modals.viewAnnouncement.announcementId,
                },
                createCategory: {
                    isOpen: false,
                },
                editAnnouncement: {
                    isOpen: false,
                    announcementId:
                        state.modals.editAnnouncement.announcementId,
                },
            },
        }))
        await sleep(300)
        set((state) => ({
            modals: {
                ...state.modals,
                viewAnnouncement: {
                    ...state.modals.viewAnnouncement,
                    announcementId: null,
                },
                editAnnouncement: {
                    ...state.modals.editAnnouncement,
                    announcementId: null,
                },
            },
        }))
    },

    toggleComments: (announcementId: string) =>
        set((state) => {
            const newExpanded = new Set(state.expandedComments)
            if (newExpanded.has(announcementId)) {
                newExpanded.delete(announcementId)
            } else {
                newExpanded.add(announcementId)
            }
            return { expandedComments: newExpanded }
        }),

    openReactionPicker: (announcementId: string) =>
        set({ reactionPickerOpen: announcementId }),

    closeReactionPicker: () => set({ reactionPickerOpen: null }),

    // Mobile Actions
    toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

    togglePinned: () =>
        set((state) => ({ pinnedCollapsed: !state.pinnedCollapsed })),

    // Reset
    resetState: () => set(initialState),
}))
