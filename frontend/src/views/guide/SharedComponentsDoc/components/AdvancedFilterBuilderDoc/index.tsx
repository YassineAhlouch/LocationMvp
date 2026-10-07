import DemoLayout from '@/components/docs/DemoLayout'

// Demo
import Basic from './Basic'
import WithCustomFields from './WithCustomFields'
import WithPopover from './WithPopover'

const mdPath = 'AdvancedFilterBuilderDoc'

const demoHeader = {
    title: 'AdvancedFilterBuilder',
    desc: 'AdvancedFilterBuilder provides a visual interface for building complex filter queries with rules and groups, supporting AND/OR logic and various field types.',
}

const demos = [
    {
        mdName: 'Basic',
        mdPath: mdPath,
        title: 'Basic',
        desc: `Basic filter builder with default fields. Add rules and groups to build complex queries.`,
        component: <Basic />,
    },
    {
        mdName: 'WithCustomFields',
        mdPath: mdPath,
        title: 'Custom Fields',
        desc: `You can define custom fields with different types (text, number, select, date).`,
        component: <WithCustomFields />,
    },
    {
        mdName: 'WithPopover',
        mdPath: mdPath,
        title: 'With Popover',
        desc: `AdvancedFilterBuilder can be placed inside a Popover for a compact filter UI.`,
        component: <WithPopover />,
    },
]

const demoApi = [
    {
        component: 'AdvancedFilterBuilder',
        api: [
            {
                propName: 'fields',
                type: `<code>{ key: string; label: string; type: 'text' | 'number' | 'select' | 'date' | 'boolean'; options?: { value: string; label: string }[] }[]</code>`,
                default: `<code>DEFAULT_FIELDS</code>`,
                desc: 'Array of field configurations defining available filter fields',
            },
            {
                propName: 'value',
                type: `<code>{ id: string; type: 'group'; condition: 'AND' | 'OR'; children: Array&lt;Rule | RuleGroup&gt;; logicalOperator?: 'AND' | 'OR' | 'NOT' }</code>`,
                default: `-`,
                desc: 'Controlled filter tree value',
            },
            {
                propName: 'onChange',
                type: `<code>(tree: FilterTree, queryString: string) => void</code>`,
                default: `-`,
                desc: 'Callback fired when the filter tree changes',
            },
            {
                propName: 'onApply',
                type: `<code>(tree: FilterTree, queryString: string) => void</code>`,
                default: `-`,
                desc: 'Callback fired when the Apply button is clicked',
            },
            {
                propName: 'onReset',
                type: `<code>(tree: FilterTree, queryString: string) => void</code>`,
                default: `-`,
                desc: 'Callback fired when the Reset button is clicked',
            },
        ],
    },
]

const AdvancedFilterBuilderDoc = () => {
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

export default AdvancedFilterBuilderDoc
