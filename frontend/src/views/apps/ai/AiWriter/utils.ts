import type { Editor } from '@tiptap/react'

export function findPositionFromTextOffset(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    doc: any,
    offset: number,
    length: number,
) {
    let accumulated = 0

    let from: number | null = null
    let to: number | null = null

    doc.descendants(
        (node: { text: string; isText: boolean }, posStart: number) => {
            if (!node.isText) return true

            const text = node.text || ''
            const textLen = text.length

            if (accumulated + textLen >= offset && from === null) {
                from = posStart + (offset - accumulated)
            }

            if (accumulated + textLen >= offset + length && to === null) {
                to = posStart + (offset + length - accumulated)
                return false
            }

            accumulated += textLen
            return true
        },
    )

    if (from !== null && to !== null) {
        return { from, to }
    }

    return null
}

export function highlightText(
    editor: Editor,
    range: { from: number; to: number },
) {
    editor.commands.setTextSelection(range)
    editor.commands.setHighlight()
}

export function removeHighlightFromText(
    editor: Editor,
    range: { from: number; to: number },
) {
    editor.commands.setTextSelection(range)
    editor.commands.unsetHighlight()
    editor.commands.setTextSelection(range) // collapse cursor
}
