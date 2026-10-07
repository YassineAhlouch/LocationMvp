import { create } from 'zustand'

export type ProjectSettingState = {
    disabled: boolean
    archived: boolean
    deleted: boolean
}

type ProjectSettingAction = {
    setArchived: (value: boolean) => void
    setDeleted: (value: boolean) => void
    setDisabled: (value: boolean) => void
}

const initialState: ProjectSettingState = {
    disabled: false,
    archived: false,
    deleted: false,
}

export const useProjectSettingStore = create<
    ProjectSettingState & ProjectSettingAction
>((set) => ({
    ...initialState,
    setArchived: (value) => set(() => ({ archived: value })),
    setDeleted: (value) => set(() => ({ deleted: value })),
    setDisabled: (value) => set(() => ({ disabled: value })),
}))
