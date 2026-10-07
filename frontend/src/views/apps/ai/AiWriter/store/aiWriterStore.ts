import { create } from 'zustand'

type SelectedText = {
    content: string
    range?: {
        from: number
        to: number
    }
}

type PromptResult = {
    id: string
    content: string
    prompt: string
    showButton: boolean
    selectedText: string
    range?: {
        from: number
        to: number
    }
    retrying?: boolean
    type: 'ammend' | 'generate'
}

type View = 'assistant' | 'generator'

type AiWriterState = {
    selectedText: SelectedText
    content: string
    view: View
    loading: boolean
    showBubbleMenu: boolean
    lastFocusPoint: number | null
    generating: boolean
    generated: boolean
    promptResultList: PromptResult[]
    sidePanelOpen: boolean
}

type AiWriterAction = {
    setSelectedText: (text: SelectedText) => void
    setContent: (text: string) => void
    setView: (view: View) => void
    setLoading: (loading: boolean) => void
    setLastFocusPoint: (point: number) => void
    setShowBubbleMenu: (show: boolean) => void
    setGenerated: (generated: boolean) => void
    setGenerating: (generating: boolean) => void
    setPromptResultList: (list: PromptResult[]) => void
    setSidePanelOpen: (open: boolean) => void
}

const initialState: AiWriterState = {
    selectedText: { content: '' },
    view: 'assistant',
    loading: false,
    showBubbleMenu: false,
    lastFocusPoint: null,
    generated: false,
    generating: false,
    content: ``,
    promptResultList: [],
    sidePanelOpen: false,
}

export const useAiWriterStore = create<AiWriterState & AiWriterAction>(
    (set) => ({
        ...initialState,
        setSelectedText: (payload) => set(() => ({ selectedText: payload })),
        setContent: (text) => set(() => ({ content: text })),
        setView: (view) => set(() => ({ view })),
        setLoading: (loading: boolean) => set(() => ({ loading })),
        setLastFocusPoint(point) {
            set(() => ({ lastFocusPoint: point }))
        },
        setShowBubbleMenu(show) {
            set(() => ({ showBubbleMenu: show }))
        },
        setGenerated(generated) {
            set(() => ({ generated }))
        },
        setGenerating(generating) {
            set(() => ({ generating }))
        },
        setPromptResultList(list) {
            set(() => ({ promptResultList: list }))
        },
        setSidePanelOpen(open) {
            set(() => ({ sidePanelOpen: open }))
        },
    }),
)
