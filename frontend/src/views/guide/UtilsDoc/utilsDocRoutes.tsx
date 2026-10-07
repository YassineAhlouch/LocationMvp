import { lazy } from 'react'
import { DocumentationRoute } from '@/@types/docs'

const utilsDocRoutes: DocumentationRoute[] = [
    {
        groupName: 'Hooks',
        nav: [
            {
                path: 'use-auth',
                label: 'useAuth',
                component: lazy(() => import('./components/UseAuthDoc')),
            },
            {
                path: 'use-dark-mode',
                label: 'useDarkMode',
                component: lazy(() => import('./components/UseDarkModeDoc')),
            },
            {
                path: 'use-debounce',
                label: 'useDebounce',
                component: lazy(() => import('./components/UseDebounceDoc')),
            },
            {
                path: 'use-direction',
                label: 'useDirection',
                component: lazy(() => import('./components/UseDirectionDoc')),
            },
            {
                path: 'use-interval',
                label: 'useInterval',
                component: lazy(() => import('./components/UseIntervalDoc')),
            },
            {
                path: 'use-layout',
                label: 'useLayout',
                component: lazy(() => import('./components/UseLayoutDoc')),
            },
            {
                path: 'use-menu-active',
                label: 'useMenuActive',
                component: lazy(() => import('./components/UseMenuActiveDoc')),
            },
            {
                path: 'use-random-color',
                label: 'useRandomColor',
                component: lazy(
                    () => import('./components/UseRandomBgColorDoc'),
                ),
            },
            {
                path: 'use-responsive',
                label: 'useResponsive',
                component: lazy(() => import('./components/UseResponsiveDoc')),
            },
            {
                path: 'use-scroll-top',
                label: 'useScrollTop',
                component: lazy(() => import('./components/UseScrollTopDoc')),
            },
            {
                path: 'use-time-out-message',
                label: 'useTimeOutMessage',
                component: lazy(
                    () => import('./components/UseTimeOutMessageDoc'),
                ),
            },
            {
                path: 'use-translation',
                label: 'useTranslation',
                component: lazy(() => import('./components/UseTranslationDoc')),
            },
            {
                path: 'use-theme-schema',
                label: 'useThemeSchema',
                component: lazy(() => import('./components/UseThemeSchemaDoc')),
            },
            {
                path: 'use-data-table-state',
                label: 'useDataTableState',
                component: lazy(
                    () => import('./components/UseDataTableStateDoc'),
                ),
            },
            {
                path: 'use-append-query-params',
                label: 'useAppendQueryParams',
                component: lazy(
                    () => import('./components/UseAppendQueryParamsDoc'),
                ),
            },
            {
                path: 'use-query-param-paging-state',
                label: 'useQueryParamPagingState',
                component: lazy(
                    () => import('./components/UseQueryParamPagingStateDoc'),
                ),
            },
        ],
    },
    {
        groupName: 'Functions',
        nav: [
            {
                path: 'acronym',
                label: 'acronym',
                component: lazy(() => import('./components/AcronymDoc')),
            },
            {
                path: 'classNames',
                label: 'classNames',
                component: lazy(() => import('./components/ClassNamesDoc')),
            },
            {
                path: 'cookies-storage',
                label: 'cookiesStorage',
                component: lazy(() => import('./components/CookiesStorageDoc')),
            },
            {
                path: 'file-size-unit',
                label: 'fileSizeUnit',
                component: lazy(() => import('./components/FileSizeUnitDoc')),
            },
            {
                path: 'is-last-child',
                label: 'isLastChild',
                component: lazy(() => import('./components/IsLastChildDoc')),
            },
            {
                path: 'paginate',
                label: 'paginate',
                component: lazy(() => import('./components/PaginateDoc')),
            },
            {
                path: 'sleep',
                label: 'sleep',
                component: lazy(() => import('./components/SleepDoc')),
            },
            {
                path: 'sort-by',
                label: 'sortBy',
                component: lazy(() => import('./components/SortByDoc')),
            },
            {
                path: 'wild-card-search',
                label: 'wildCardSearch',
                component: lazy(() => import('./components/WildCardSearchDoc')),
            },
            {
                path: 'format-currency',
                label: 'formatCurrency',
                component: lazy(() => import('./components/FormatCurrencyDoc')),
            },
            {
                path: 'format-currency-compact',
                label: 'formatCurrencyCompact',
                component: lazy(
                    () => import('./components/FormatCurrencyCompactDoc'),
                ),
            },
            {
                path: 'format-number',
                label: 'formatNumber',
                component: lazy(() => import('./components/FormatNumberDoc')),
            },
            {
                path: 'format-relative-time',
                label: 'formatRelativeTime',
                component: lazy(
                    () => import('./components/FormatRelativeTimeDoc'),
                ),
            },
            {
                path: 'get-contrast',
                label: 'getContrast',
                component: lazy(() => import('./components/GetContrastDoc')),
            },
            {
                path: 'highlight-search-match',
                label: 'highlightSearchMatch',
                component: lazy(
                    () => import('./components/HighlightSearchMatchDoc'),
                ),
            },
        ],
    },
    {
        groupName: 'HOC',
        nav: [
            {
                path: 'with-header-item',
                label: 'withHeaderItem',
                component: lazy(() => import('./components/WithHeaderItemDoc')),
            },
        ],
    },
]

export default utilsDocRoutes
