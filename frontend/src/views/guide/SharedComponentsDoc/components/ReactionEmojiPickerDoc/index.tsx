import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import CustomEmojis from './CustomEmojis'

const mdPath = 'ReactionEmojiPickerDoc'

const demoHeader = {
    title: 'ReactionEmojiPicker',
    desc: 'ReactionEmojiPicker provides a popover-based emoji picker for adding reactions, commonly used in social features like comments or messages.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic usage with default emoji set. Click the trigger to open the picker.`,
        component: <Basic />,
    },
    {
        mdName: 'CustomEmojis',
        mdPath: mdPath,
        title: 'Custom Emojis',
        desc: `You can customize the emoji set and trigger element.`,
        component: <CustomEmojis />,
    },
]

const demoApi = [
    {
        component: 'ReactionEmojiPicker',
        api: [
            {
                propName: 'emojis',
                type: `<code>readonly string[]</code>`,
                default: `<code>['👍', '❤️', '😂', '😮', '😢', '😡', '👏', '🎉']</code>`,
                desc: 'Array of emoji characters to display in the picker',
            },
            {
                propName: 'onSelect',
                type: `<code>(emoji: string) => void</code>`,
                default: `-`,
                desc: 'Callback fired when an emoji is selected',
            },
            {
                propName: 'trigger',
                type: `<code>ReactNode</code>`,
                default: `-`,
                desc: 'Custom trigger element. Defaults to a smile icon button',
            },
            {
                propName: 'placement',
                type: `<code>string</code>`,
                default: `<code>"top"</code>`,
                desc: 'Placement of the popover relative to the trigger',
            },
            {
                propName: 'width',
                type: `<code>number</code>`,
                default: `<code>250</code>`,
                desc: 'Width of the popover in pixels',
            },
        ],
    },
]

const ReactionEmojiPickerDoc = () => {
    return (
        <DemoLayout
            innerFrame={false}
            header={demoHeader}
            demos={demos}
            api={demoApi}
            mdPrefixPath="shared"
        />
    )
}

export default ReactionEmojiPickerDoc
