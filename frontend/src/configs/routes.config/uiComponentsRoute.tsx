import { lazy } from 'react'
import { UI_COMPONENTS_PREFIX_PATH } from '@/constants/route.constant'
import type { Routes } from '@/@types/routes'

const uiComponentsRoute: Routes = [
    {
        key: 'uiComponent.common.button',
        path: `${UI_COMPONENTS_PREFIX_PATH}/button`,
        component: lazy(() => import('@/views/ui-components/common/Button')),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.common.grid',
        path: `${UI_COMPONENTS_PREFIX_PATH}/grid`,
        component: lazy(() => import('@/views/ui-components/common/Grid')),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.common.typography',
        path: `${UI_COMPONENTS_PREFIX_PATH}/typography`,
        component: lazy(
            () => import('@/views/ui-components/common/Typography'),
        ),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.common.scroll',
        path: `${UI_COMPONENTS_PREFIX_PATH}/scroll`,
        component: lazy(() => import('@/views/ui-components/common/Scroll')),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.common.icons',
        path: `${UI_COMPONENTS_PREFIX_PATH}/icons`,
        component: lazy(() => import('@/views/ui-components/common/Icons')),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.feedback.actionBar',
        path: `${UI_COMPONENTS_PREFIX_PATH}/action-bar`,
        component: lazy(
            () => import('@/views/ui-components/feedback/ActionBar'),
        ),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.feedback.alert',
        path: `${UI_COMPONENTS_PREFIX_PATH}/alert`,
        component: lazy(() => import('@/views/ui-components/feedback/Alert')),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.feedback.dialog',
        path: `${UI_COMPONENTS_PREFIX_PATH}/dialog`,
        component: lazy(() => import('@/views/ui-components/feedback/Dialog')),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.feedback.drawer',
        path: `${UI_COMPONENTS_PREFIX_PATH}/drawer`,
        component: lazy(() => import('@/views/ui-components/feedback/Drawer')),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.feedback.progress',
        path: `${UI_COMPONENTS_PREFIX_PATH}/progress`,
        component: lazy(
            () => import('@/views/ui-components/feedback/Progress'),
        ),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.feedback.skeleton',
        path: `${UI_COMPONENTS_PREFIX_PATH}/skeleton`,
        component: lazy(
            () => import('@/views/ui-components/feedback/Skeleton'),
        ),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.feedback.spinner',
        path: `${UI_COMPONENTS_PREFIX_PATH}/spinner`,
        component: lazy(() => import('@/views/ui-components/feedback/Spinner')),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.feedback.toast',
        path: `${UI_COMPONENTS_PREFIX_PATH}/toast`,
        component: lazy(() => import('@/views/ui-components/feedback/Toast')),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.dataDisplay.avatar',
        path: `${UI_COMPONENTS_PREFIX_PATH}/avatar`,
        component: lazy(
            () => import('@/views/ui-components/data-display/Avatar'),
        ),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.dataDisplay.badge',
        path: `${UI_COMPONENTS_PREFIX_PATH}/badge`,
        component: lazy(
            () => import('@/views/ui-components/data-display/Badge'),
        ),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.dataDisplay.calendar',
        path: `${UI_COMPONENTS_PREFIX_PATH}/calendar`,
        component: lazy(
            () => import('@/views/ui-components/data-display/Calendar'),
        ),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.dataDisplay.cards',
        path: `${UI_COMPONENTS_PREFIX_PATH}/cards`,
        component: lazy(
            () => import('@/views/ui-components/data-display/Cards'),
        ),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.dataDisplay.carousel',
        path: `${UI_COMPONENTS_PREFIX_PATH}/carousel`,
        component: lazy(
            () => import('@/views/ui-components/data-display/Carousel'),
        ),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.dataDisplay.popover',
        path: `${UI_COMPONENTS_PREFIX_PATH}/popover`,
        component: lazy(
            () => import('@/views/ui-components/data-display/Porpover'),
        ),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.dataDisplay.table',
        path: `${UI_COMPONENTS_PREFIX_PATH}/table`,
        component: lazy(
            () => import('@/views/ui-components/data-display/Table'),
        ),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.dataDisplay.tag',
        path: `${UI_COMPONENTS_PREFIX_PATH}/tag`,
        component: lazy(() => import('@/views/ui-components/data-display/Tag')),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.dataDisplay.timeline',
        path: `${UI_COMPONENTS_PREFIX_PATH}/timeline`,
        component: lazy(
            () => import('@/views/ui-components/data-display/Timeline'),
        ),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.dataDisplay.tooltip',
        path: `${UI_COMPONENTS_PREFIX_PATH}/tooltip`,
        component: lazy(
            () => import('@/views/ui-components/data-display/Tooltip'),
        ),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.dataDisplay.collapsible',
        path: `${UI_COMPONENTS_PREFIX_PATH}/collapsible`,
        component: lazy(
            () => import('@/views/ui-components/data-display/Collapsible'),
        ),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.forms.checkbox',
        path: `${UI_COMPONENTS_PREFIX_PATH}/checkbox`,
        component: lazy(() => import('@/views/ui-components/forms/Checkbox')),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.forms.datePicker',
        path: `${UI_COMPONENTS_PREFIX_PATH}/date-picker`,
        component: lazy(() => import('@/views/ui-components/forms/DatePicker')),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.forms.formControl',
        path: `${UI_COMPONENTS_PREFIX_PATH}/form-control`,
        component: lazy(
            () => import('@/views/ui-components/forms/FormControl'),
        ),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.forms.input',
        path: `${UI_COMPONENTS_PREFIX_PATH}/input`,
        component: lazy(() => import('@/views/ui-components/forms/Input')),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.forms.inputGroup',
        path: `${UI_COMPONENTS_PREFIX_PATH}/input-group`,
        component: lazy(() => import('@/views/ui-components/forms/InputGroup')),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.forms.radio',
        path: `${UI_COMPONENTS_PREFIX_PATH}/radio`,
        component: lazy(() => import('@/views/ui-components/forms/Radio')),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.forms.segment',
        path: `${UI_COMPONENTS_PREFIX_PATH}/segment`,
        component: lazy(() => import('@/views/ui-components/forms/Segment')),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.forms.select',
        path: `${UI_COMPONENTS_PREFIX_PATH}/select`,
        component: lazy(() => import('@/views/ui-components/forms/Select')),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.forms.slider',
        path: `${UI_COMPONENTS_PREFIX_PATH}/slider`,
        component: lazy(() => import('@/views/ui-components/forms/Slider')),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.forms.switcher',
        path: `${UI_COMPONENTS_PREFIX_PATH}/switcher`,
        component: lazy(() => import('@/views/ui-components/forms/Switcher')),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.forms.timeInput',
        path: `${UI_COMPONENTS_PREFIX_PATH}/time-input`,
        component: lazy(() => import('@/views/ui-components/forms/TimeInput')),
        access: 'public',
    },
    {
        key: 'uiComponent.forms.upload',
        path: `${UI_COMPONENTS_PREFIX_PATH}/upload`,
        component: lazy(() => import('@/views/ui-components/forms/Upload')),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.forms.multiValueInput',
        path: `${UI_COMPONENTS_PREFIX_PATH}/multi-value-input`,
        component: lazy(
            () => import('@/views/ui-components/forms/MultiValueInput'),
        ),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.navigation.dropdown',
        path: `${UI_COMPONENTS_PREFIX_PATH}/dropdown`,
        component: lazy(
            () => import('@/views/ui-components/navigation/Dropdown'),
        ),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.navigation.menu',
        path: `${UI_COMPONENTS_PREFIX_PATH}/menu`,
        component: lazy(() => import('@/views/ui-components/navigation/Menu')),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.navigation.pagination',
        path: `${UI_COMPONENTS_PREFIX_PATH}/pagination`,
        component: lazy(
            () => import('@/views/ui-components/navigation/Pagination'),
        ),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.navigation.steps',
        path: `${UI_COMPONENTS_PREFIX_PATH}/steps`,
        component: lazy(() => import('@/views/ui-components/navigation/Steps')),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'uiComponent.navigation.tabs',
        path: `${UI_COMPONENTS_PREFIX_PATH}/tabs`,
        component: lazy(() => import('@/views/ui-components/navigation/Tabs')),
        access: 'public',
        meta: {
            pageContainerType: 'contained',
        },
    },
]

export default uiComponentsRoute
