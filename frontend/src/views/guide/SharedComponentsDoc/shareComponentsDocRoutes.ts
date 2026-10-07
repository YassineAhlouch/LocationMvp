import { lazy } from 'react'
import { DocumentationRoute } from '@/@types/docs'

const documentationRoutes: DocumentationRoute[] = [
    {
        groupName: 'Components',
        nav: [
            {
                path: 'action-link',
                label: 'ActionLink',
                component: lazy(() => import('./components/ActionLinkDoc')),
            },
            {
                path: 'advanced-filter-builder',
                label: 'AdvancedFilterBuilder',
                component: lazy(
                    () => import('./components/AdvancedFilterBuilderDoc'),
                ),
            },
            {
                path: 'affix',
                label: 'Affix',
                component: lazy(() => import('./components/AffixDoc')),
            },
            {
                path: 'authority-check',
                label: 'AuthorityCheck',
                component: lazy(() => import('./components/AuthorityCheckDoc')),
            },
            {
                path: 'auto-complete',
                label: 'AutoComplete',
                component: lazy(() => import('./components/AutoCompleteDoc')),
            },
            {
                path: 'full-calendar',
                label: 'FullCalendar',
                component: lazy(() => import('./components/FullCalendarDoc')),
            },
            {
                path: 'chart',
                label: 'Chart',
                component: lazy(() => import('./components/ChartDoc')),
            },
            {
                path: 'clock-progress',
                label: 'ClockProgress',
                component: lazy(() => import('./components/ClockProgressDoc')),
            },
            {
                path: 'confirm-dialog',
                label: 'ConfirmDialog',
                component: lazy(() => import('./components/ConfirmDialogDoc')),
            },
            {
                path: 'container',
                label: 'Container',
                component: lazy(() => import('./components/ContainerDoc')),
            },
            {
                path: 'custom-format-input',
                label: 'CustomFormatInput',
                component: lazy(
                    () => import('./components/CustomFormatInputDoc'),
                ),
            },
            {
                path: 'data-table',
                label: 'DataTable',
                component: lazy(() => import('./components/DataTableDoc')),
            },
            {
                path: 'debounce-input',
                label: 'DebounceInput',
                component: lazy(() => import('./components/DebounceInputDoc')),
            },
            {
                path: 'divider',
                label: 'Divider',
                component: lazy(() => import('./components/DividerDoc')),
            },
            {
                path: 'empty-state',
                label: 'EmptyState',
                component: lazy(() => import('./components/EmptyStateDoc')),
            },
            {
                path: 'file-icon',
                label: 'FileIcon',
                component: lazy(() => import('./components/FileIconDoc')),
            },
            {
                path: 'gantt-chart',
                label: 'GanttChart',
                component: lazy(() => import('./components/GanttChartDoc')),
            },
            {
                path: 'grow-shrink-tag',
                label: 'GrowShrinkTag',
                component: lazy(() => import('./components/GrowShrinkTagDoc')),
            },
            {
                path: 'histogram',
                label: 'Histogram',
                component: lazy(() => import('./components/HistogramDoc')),
            },
            {
                path: 'icon-frame',
                label: 'IconFrame',
                component: lazy(() => import('./components/IconFrameDoc')),
            },
            {
                path: 'info-bar',
                label: 'InfoBar',
                component: lazy(() => import('./components/InfoBarDoc')),
            },
            {
                path: 'loaders',
                label: 'Loaders',
                component: lazy(() => import('./components/LoadersDoc')),
            },
            {
                path: 'loading',
                label: 'Loading',
                component: lazy(() => import('./components/LoadingDoc')),
            },
            {
                path: 'nav-toggle',
                label: 'NavToggle',
                component: lazy(() => import('./components/NavToggleDoc')),
            },
            {
                path: 'numeric-input',
                label: 'NumericInput',
                component: lazy(() => import('./components/NumericInputDoc')),
            },
            {
                path: 'numeric-input-stepper',
                label: 'NumericInputStepper',
                component: lazy(
                    () => import('./components/NumericInputStepperDoc'),
                ),
            },
            {
                path: 'otp-input',
                label: 'OtpInput',
                component: lazy(() => import('./components/OtpInputDoc')),
            },
            {
                path: 'overflow-tabs',
                label: 'OverflowTabs',
                component: lazy(() => import('./components/OverflowTabsDoc')),
            },
            {
                path: 'password-input',
                label: 'PasswordInput',
                component: lazy(() => import('./components/PasswordInputDoc')),
            },
            {
                path: 'pattern-input',
                label: 'PatternInput',
                component: lazy(() => import('./components/PatternInputDoc')),
            },
            {
                path: 'popover-filter',
                label: 'PopoverFilter',
                component: lazy(() => import('./components/PopoverFilterDoc')),
            },
            {
                path: 'reaction-emoji-picker',
                label: 'ReactionEmojiPicker',
                component: lazy(
                    () => import('./components/ReactionEmojiPickerDoc'),
                ),
            },
            {
                path: 'rich-text-editor',
                label: 'RichTextEditor',
                component: lazy(() => import('./components/RichTextEditorDoc')),
            },
            {
                path: 'segment-progress-bar',
                label: 'SegmentProgressBar',
                component: lazy(
                    () => import('./components/SegmentProgressBarDoc'),
                ),
            },
            {
                path: 'select-extension',
                label: 'Select Extension',
                component: lazy(
                    () => import('./components/SelectExtensionDoc'),
                ),
            },
            {
                path: 'statistic-card',
                label: 'StatisticCard',
                component: lazy(() => import('./components/StatisticCardDoc')),
            },
            {
                path: 'sticky-region',
                label: 'StickyRegion',
                component: lazy(() => import('./components/StickyRegionDoc')),
            },
            {
                path: 'syntax-highlighter',
                label: 'SyntaxHighlighter',
                component: lazy(
                    () => import('./components/SyntaxHighlighterDoc'),
                ),
            },
            {
                path: 'toggle-drawer',
                label: 'ToggleDrawer',
                component: lazy(() => import('./components/ToggleDrawerDoc')),
            },
            {
                path: 'users-avatar-group',
                label: 'UsersAvatarGroup',
                component: lazy(
                    () => import('./components/UsersAvatarGroupDoc'),
                ),
            },
            {
                path: 'vector-map',
                label: 'VectorMap',
                component: lazy(() => import('./components/VectorMapDoc')),
            },
            {
                path: 'wizard',
                label: 'Wizard',
                component: lazy(() => import('./components/WizardDoc')),
            },
        ],
    },
]

export default documentationRoutes
