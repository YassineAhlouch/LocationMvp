import { Mark, mergeAttributes, type CommandProps } from '@tiptap/core'

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        highlight: {
            setHighlight: () => ReturnType
            toggleHighlight: () => ReturnType
            unsetHighlight: () => ReturnType
        }
    }
}

export const Highlight = Mark.create({
    name: 'highlight',

    addOptions() {
        return {
            HTMLAttributes: {},
        }
    },

    parseHTML() {
        return [
            {
                tag: 'mark',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'mark',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
            0,
        ]
    },

    addCommands() {
        return {
            setHighlight:
                () =>
                ({ commands }: CommandProps) => {
                    return commands.setMark(this.name)
                },
            toggleHighlight:
                () =>
                ({ commands }: CommandProps) => {
                    return commands.toggleMark(this.name)
                },
            unsetHighlight:
                () =>
                ({ commands }: CommandProps) => {
                    return commands.unsetMark(this.name)
                },
        }
    },
})
