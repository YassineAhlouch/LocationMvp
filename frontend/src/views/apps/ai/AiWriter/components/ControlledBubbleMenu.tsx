import { ReactNode, useLayoutEffect } from 'react'
import { useFloating, autoUpdate, offset, flip } from '@floating-ui/react-dom'
import { Editor, isNodeSelection, posToDOMRect } from '@tiptap/core'
import { getMarkRange } from '@tiptap/react'
import { TextSelection } from '@tiptap/pm/state'

type Props = {
    editor: Editor
    open: boolean
    children: ReactNode
}

const ControlledBubbleMenu = ({ editor, open, children }: Props) => {
    const { view } = editor
    const {
        x,
        y,
        strategy: position,
        refs,
    } = useFloating({
        strategy: 'fixed',
        whileElementsMounted: autoUpdate,
        placement: 'bottom',
        middleware: [
            offset({ mainAxis: 8 }),
            flip({
                padding: 8,
                boundary: editor.options.element as HTMLElement,
                fallbackPlacements: [
                    'bottom',
                    'top-start',
                    'bottom-start',
                    'top-end',
                    'bottom-end',
                ],
            }),
        ],
    })

    useLayoutEffect(() => {
        refs.setReference({
            getBoundingClientRect() {
                const { ranges } = editor.state.selection
                const from = Math.min(...ranges.map((range) => range.$from.pos))
                const to = Math.max(...ranges.map((range) => range.$to.pos))

                if (isNodeSelection(editor.state.selection)) {
                    const node = editor.view.nodeDOM(from) as HTMLElement

                    if (node) {
                        return node.getBoundingClientRect()
                    }
                }

                const range = getMarkRange(
                    view.state.doc.resolve(from),
                    view.state.schema.marks.link,
                )
                if (range) {
                    const $start = view.state.doc.resolve(range.from)
                    const $end = view.state.doc.resolve(range.to)
                    const transaction = view.state.tr.setSelection(
                        new TextSelection($start, $end),
                    )
                    view.dispatch(transaction)
                    return posToDOMRect(editor.view, range.from, range.to)
                }
                return posToDOMRect(editor.view, from, to)
            },
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refs.reference, editor.state.selection, view])

    if (!open) {
        return null
    }
    const style = { position, top: y ?? 0, left: x ?? 0 }

    return (
        <div ref={refs.setFloating} style={style} className="z-30">
            {children}
        </div>
    )
}

export default ControlledBubbleMenu
