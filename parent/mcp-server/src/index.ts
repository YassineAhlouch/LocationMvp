#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    ListResourcesRequestSchema,
    ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ComponentMCP {
    component_id: string;
    name: string;
    display_name: string;
    category: string;
    import_path: string;
    description: string;
    usage_guidelines: string[];
    props: Record<string, any>;
    compound_components?: Record<string, any>;
    code_examples?: Record<string, { title: string; code: string }>;
    features?: string[];
    accessibility?: Record<string, any>;
    styling_info?: any;
    best_practices?: any;
}

interface HookMCP {
    hook_id: string;
    name: string;
    display_name: string;
    category: string;
    import_path: string;
    description: string;
    usage_guidelines: string[];
    parameters?: Record<string, any>;
    return_value?: any;
    best_practices?: any;
}

interface UtilityMCP {
    utility_id: string;
    name: string;
    display_name: string;
    category: string;
    import_path: string;
    description: string;
    usage_guidelines: string[];
    parameters?: Record<string, unknown>;
    return_value?: unknown;
    best_practices?: unknown;
}

interface CompositionPattern {
    name: string;
    description: string;
    components: string[];
    hooks: string[];
    utilities: string[];
    example_structure: string;
}

const COMPOSITION_PATTERNS: CompositionPattern[] = [
    {
        name: "CRUD List Page",
        description:
            "Standard page for listing, searching, filtering, and managing data records with table view.",
        components: [
            "DataTable",
            "Button",
            "Input",
            "ConfirmDialog",
            "Drawer",
            "Badge",
            "Dropdown",
            "Container",
            "Loading",
            "PopoverFilter",
        ],
        hooks: ["useDataTableState", "useDebounce", "useTranslation"],
        utilities: ["wildCardSearch", "paginate", "sortBy"],
        example_structure: `import { useState } from 'react'
import Container from '@/components/shared/Container'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Drawer from '@/components/ui/Drawer'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import DebouceInput from '@/components/shared/DebouceInput'
import type { ColumnDef, OnSortParam } from '@/components/shared/DataTable'

// 1. Define your data type
type Item = { id: string; name: string; status: string }

// 2. Column definitions with useMemo
const columns: ColumnDef<Item>[] = [...]

// 3. State: tableData { pageIndex, pageSize, sort, query, total }
// 4. Fetch data with useEffect on tableData changes
// 5. Render: Container > search input + DataTable + ConfirmDialog + Drawer`,
    },
    {
        name: "Form Page",
        description:
            "Page with a validated form using React Hook Form + Zod schema, with consistent field layout.",
        components: [
            "Form",
            "Input",
            "Select",
            "Checkbox",
            "Radio",
            "Switcher",
            "DatePicker",
            "Button",
            "Card",
            "Container",
            "Upload",
        ],
        hooks: ["useTranslation"],
        utilities: ["classNames"],
        example_structure: `import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Form from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'

// 1. Define Zod schema
const schema = z.object({ name: z.string().min(1), email: z.string().email() })
type FormValues = z.infer<typeof schema>

// 2. useForm with zodResolver
const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema)
})

// 3. Render: Form layout='horizontal' > Form.Item + Controller + Input
// 4. Submit with handleSubmit`,
    },
    {
        name: "Dashboard Page",
        description:
            "Analytics/overview page with statistic cards, charts, and data summaries.",
        components: [
            "Card",
            "StatisticCard",
            "Chart",
            "GrowShrinkTag",
            "GrowShrinkValue",
            "Skeleton",
            "Loading",
            "Container",
            "Segment",
            "Badge",
            "Avatar",
            "UsersAvatarGroup",
        ],
        hooks: ["useResponsive", "useTranslation"],
        utilities: [
            "formatCurrency",
            "formatCurrencyCompact",
            "formatNumber",
            "formatDate",
        ],
        example_structure: `import Card from '@/components/ui/Card'
import StatisticCard from '@/components/shared/StatisticCard'
import Chart from '@/components/shared/Chart'
import { GrowShrinkTag } from '@/components/shared/GrowShrinkTag'

// 1. Fetch dashboard data via SWR or useEffect
// 2. Top row: StatisticCard grid (2-4 cards)
// 3. Chart row: Card > Chart.LineChart or Chart.BarChart
// 4. Details: DataTable or Timeline for recent activity`,
    },
    {
        name: "Settings Page",
        description:
            "User/system settings page with tabbed sections and form controls.",
        components: [
            "Tabs",
            "Card",
            "Form",
            "Input",
            "Switcher",
            "Select",
            "Avatar",
            "Upload",
            "Button",
            "Container",
        ],
        hooks: ["useDarkMode", "useDirection", "useTranslation"],
        utilities: ["classNames"],
        example_structure: `import Tabs from '@/components/ui/Tabs'
import Card from '@/components/ui/Card'
import Form from '@/components/ui/Form'

const { TabNav, TabList, TabContent } = Tabs

// 1. Tabs container with sections: Profile, Notifications, Security, etc.
// 2. Each TabContent contains a Card with Form layout
// 3. Save button per section or global save`,
    },
    {
        name: "Detail/Profile Page",
        description:
            "Detailed view of a single record with header, info sections, and activity timeline.",
        components: [
            "Card",
            "Avatar",
            "Badge",
            "Tag",
            "Timeline",
            "Tabs",
            "Button",
            "Drawer",
            "Container",
            "IconFrame",
        ],
        hooks: ["useTranslation", "useResponsive"],
        utilities: ["formatDate", "formatRelativeTime", "acronym"],
        example_structure: `// 1. Header: Avatar + name + badges + action buttons
// 2. Info grid: Card sections with key-value pairs
// 3. Tabs: Activity timeline, related items, notes
// 4. Drawer for editing details`,
    },
    {
        name: "Calendar/Scheduler Page",
        description:
            "Event management page with full calendar and event creation.",
        components: [
            "FullCalendar",
            "Dialog",
            "Form",
            "DatePicker",
            "TimeInput",
            "Select",
            "Input",
            "Button",
            "Container",
        ],
        hooks: ["useTranslation"],
        utilities: ["formatDate"],
        example_structure: `import FullCalendar from '@/components/shared/FullCalendar'
import Dialog from '@/components/ui/Dialog'

// 1. FullCalendar with event data
// 2. Dialog for event creation/editing
// 3. Form inside Dialog with DatePicker, TimeInput, Select
// 4. Handle onEventClick, onDateClick, onEventDrop`,
    },
];

const server = new Server(
    {
        name: "eyris-mcp-server",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
            resources: {},
        },
    },
);

function getMCPBasePath(): string {
    return path.resolve(__dirname, "..", "data");
}

async function readMCPFiles(dirPath: string): Promise<unknown[]> {
    try {
        const files = await fs.readdir(dirPath, { recursive: true });
        const jsonFiles = files.filter((f) => f.endsWith(".json"));

        const data = await Promise.all(
            jsonFiles.map(async (file) => {
                const filePath = path.join(dirPath, file);
                const content = await fs.readFile(filePath, "utf-8");
                return JSON.parse(content);
            }),
        );

        return data;
    } catch (error) {
        console.error(`Error reading MCP files from ${dirPath}:`, error);
        return [];
    }
}

let componentsCache: ComponentMCP[] | null = null;
let hooksCache: HookMCP[] | null = null;
let utilitiesCache: UtilityMCP[] | null = null;

async function loadAllData() {
    const basePath = getMCPBasePath();

    if (!componentsCache) {
        const uiComponents = await readMCPFiles(
            path.join(basePath, "components", "ui"),
        );
        const sharedComponents = await readMCPFiles(
            path.join(basePath, "components", "shared"),
        );
        componentsCache = [
            ...uiComponents,
            ...sharedComponents,
        ] as ComponentMCP[];
    }

    if (!hooksCache) {
        hooksCache = (await readMCPFiles(
            path.join(basePath, "utils", "hooks"),
        )) as HookMCP[];
    }

    if (!utilitiesCache) {
        utilitiesCache = (await readMCPFiles(
            path.join(basePath, "utils"),
        )) as UtilityMCP[];
    }

    return {
        components: componentsCache || [],
        hooks: hooksCache || [],
        utilities: utilitiesCache || [],
    };
}

server.setRequestHandler(ListResourcesRequestSchema, async () => {
    const data = await loadAllData();

    const resources = [
        ...data.components.map((comp) => ({
            uri: `eyris://component/${comp.name}`,
            mimeType: "application/json",
            name: `Component: ${comp.display_name}`,
            description: comp.description,
        })),
        ...data.hooks.map((hook) => ({
            uri: `eyris://hook/${hook.name}`,
            mimeType: "application/json",
            name: `Hook: ${hook.display_name}`,
            description: hook.description,
        })),
        ...data.utilities.map((util) => ({
            uri: `eyris://utility/${util.name}`,
            mimeType: "application/json",
            name: `Utility: ${util.display_name}`,
            description: util.description,
        })),
    ];

    return { resources };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;
    const data = await loadAllData();

    if (uri.startsWith("eyris://component/")) {
        const name = uri.replace("eyris://component/", "");
        const component = data.components.find((c) => c.name === name);

        if (!component) {
            throw new Error(`Component not found: ${name}`);
        }

        return {
            contents: [
                {
                    uri,
                    mimeType: "application/json",
                    text: JSON.stringify(component, null, 2),
                },
            ],
        };
    }

    if (uri.startsWith("eyris://hook/")) {
        const name = uri.replace("eyris://hook/", "");
        const hook = data.hooks.find((h) => h.name === name);

        if (!hook) {
            throw new Error(`Hook not found: ${name}`);
        }

        return {
            contents: [
                {
                    uri,
                    mimeType: "application/json",
                    text: JSON.stringify(hook, null, 2),
                },
            ],
        };
    }

    if (uri.startsWith("eyris://utility/")) {
        const name = uri.replace("eyris://utility/", "");
        const utility = data.utilities.find((u) => u.name === name);

        if (!utility) {
            throw new Error(`Utility not found: ${name}`);
        }

        return {
            contents: [
                {
                    uri,
                    mimeType: "application/json",
                    text: JSON.stringify(utility, null, 2),
                },
            ],
        };
    }

    throw new Error(`Unknown resource URI: ${uri}`);
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "search_components",
                description:
                    "Search for Eyris components by name, category, or description",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: {
                            type: "string",
                            description:
                                "Search query (searches name, category, description)",
                        },
                        category: {
                            type: "string",
                            description: "Filter by category (optional)",
                        },
                    },
                    required: ["query"],
                },
            },
            {
                name: "get_component",
                description:
                    "Get detailed information about a specific component",
                inputSchema: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            description:
                                "Component name (e.g., 'Button', 'DataTable')",
                        },
                    },
                    required: ["name"],
                },
            },
            {
                name: "search_hooks",
                description: "Search for Eyris custom hooks",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: {
                            type: "string",
                            description: "Search query",
                        },
                    },
                    required: ["query"],
                },
            },
            {
                name: "get_hook",
                description: "Get detailed information about a specific hook",
                inputSchema: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            description:
                                "Hook name (e.g., 'useDebounce', 'useThemeSchema')",
                        },
                    },
                    required: ["name"],
                },
            },
            {
                name: "search_utilities",
                description: "Search for Eyris utility functions",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: {
                            type: "string",
                            description: "Search query",
                        },
                    },
                    required: ["query"],
                },
            },
            {
                name: "get_utility",
                description:
                    "Get detailed information about a specific utility function",
                inputSchema: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            description:
                                "Utility name (e.g., 'formatCurrency', 'classNames')",
                        },
                    },
                    required: ["name"],
                },
            },
            {
                name: "list_all_components",
                description:
                    "List all available Eyris components with brief descriptions. Optionally filter by category.",
                inputSchema: {
                    type: "object",
                    properties: {
                        category: {
                            type: "string",
                            description:
                                "Optional category filter (e.g., 'Form Elements', 'Navigation', 'Layout', 'Data Display', 'Overlay', 'Feedback')",
                        },
                    },
                },
            },
            {
                name: "list_all_hooks",
                description: "List all available Eyris hooks",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            {
                name: "list_all_utilities",
                description: "List all available Eyris utilities",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            {
                name: "get_code_examples",
                description:
                    "Get code examples for a specific component showing real usage patterns",
                inputSchema: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            description:
                                "Component name (e.g., 'Button', 'DataTable', 'Tabs')",
                        },
                    },
                    required: ["name"],
                },
            },
            {
                name: "get_composition_patterns",
                description:
                    "Get common page composition patterns showing which components, hooks, and utilities to use together for building standard pages (CRUD list, form, dashboard, settings, detail, calendar)",
                inputSchema: {
                    type: "object",
                    properties: {
                        pattern: {
                            type: "string",
                            description:
                                "Optional pattern name filter (e.g., 'CRUD', 'Form', 'Dashboard', 'Settings', 'Detail', 'Calendar'). Returns all patterns if omitted.",
                        },
                    },
                },
            },
            {
                name: "add_new_page",
                description:
                    "Scaffold a new page: creates the view component, adds the route, and updates navigation. (Only available in local dev environment)",
                inputSchema: {
                    type: "object",
                    properties: {
                        pageName: {
                            type: "string",
                            description: "Name of the page/component (e.g., 'Settings', 'UserList')",
                        },
                        path: {
                            type: "string",
                            description: "URL path for the page (e.g., '/settings', '/users')",
                        },
                        menuGroup: {
                            type: "string",
                            description: "Optional: key of the menu group to add this page to",
                        },
                    },
                    required: ["pageName", "path"],
                },
            },
            {
                name: "cleanup_starter_code",
                description:
                    "Remove the 'Example purpose only' boilerplate code from routes and navigation configs. Use this to prepare the starter template for a real project.",
                inputSchema: {
                    type: "object",
                    properties: {
                        confirm: {
                            type: "boolean",
                            description: "Must be set to true to confirm deletion",
                        },
                    },
                    required: ["confirm"],
                },
            },
            {
                name: "scaffold_pattern_view",
                description:
                    "Generate the full code for a view component based on a composition pattern (e.g., CRUD, Form). Returns the code for you to write to a file.",
                inputSchema: {
                    type: "object",
                    properties: {
                        pattern: {
                            type: "string",
                            enum: ["CRUD List Page", "Form Page", "Dashboard Page", "Settings Page", "Detail/Profile Page", "Calendar/Scheduler Page"],
                            description: "The UI pattern to scaffold",
                        },
                        entityName: {
                            type: "string",
                            description: "Name of the entity to scaffold (e.g., 'Customer', 'Ticket', or any other domain entity)",
                        },
                    },
                    required: ["pattern", "entityName"],
                },
            },
            {
                name: "configure_theme",
                description:
                    "Update the global theme configuration (primary color, etc.)",
                inputSchema: {
                    type: "object",
                    properties: {
                        primaryColor: {
                            type: "string",
                            description: "Hex code for the primary color (e.g., '#286cf0')",
                        },
                    },
                    required: ["primaryColor"],
                },
            },
        ],
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const data = await loadAllData();

    if (!args) {
        throw new Error("Missing arguments");
    }

    switch (name) {
        case "search_components": {
            const query = (args.query as string).toLowerCase();
            const category = args.category as string | undefined;

            const results = data.components.filter((comp) => {
                // Search across name, display name, description, category, and compound component names
                const compoundNames = comp.compound_components
                    ? Object.keys(comp.compound_components)
                        .join(" ")
                        .toLowerCase()
                    : "";
                const featureText = comp.features
                    ? comp.features.join(" ").toLowerCase()
                    : "";

                const matchesQuery =
                    comp.name.toLowerCase().includes(query) ||
                    comp.display_name.toLowerCase().includes(query) ||
                    comp.description.toLowerCase().includes(query) ||
                    comp.category.toLowerCase().includes(query) ||
                    compoundNames.includes(query) ||
                    featureText.includes(query);

                const matchesCategory =
                    !category ||
                    comp.category
                        .toLowerCase()
                        .includes(category.toLowerCase());

                return matchesQuery && matchesCategory;
            });

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(results, null, 2),
                    },
                ],
            };
        }

        case "get_component": {
            const name = args.name as string;
            const component = data.components.find(
                (c) => c.name.toLowerCase() === name.toLowerCase(),
            );

            if (!component) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Component "${name}" not found. Use search_components to find available components.`,
                        },
                    ],
                };
            }

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(component, null, 2),
                    },
                ],
            };
        }

        case "search_hooks": {
            const query = (args.query as string).toLowerCase();

            const results = data.hooks.filter(
                (hook) =>
                    hook.name.toLowerCase().includes(query) ||
                    hook.display_name.toLowerCase().includes(query) ||
                    hook.description.toLowerCase().includes(query),
            );

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(results, null, 2),
                    },
                ],
            };
        }

        case "get_hook": {
            const name = args.name as string;
            const hook = data.hooks.find(
                (h) => h.name.toLowerCase() === name.toLowerCase(),
            );

            if (!hook) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Hook "${name}" not found. Use search_hooks to find available hooks.`,
                        },
                    ],
                };
            }

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(hook, null, 2),
                    },
                ],
            };
        }

        case "search_utilities": {
            const query = (args.query as string).toLowerCase();

            const results = data.utilities.filter(
                (util) =>
                    util.name.toLowerCase().includes(query) ||
                    util.display_name.toLowerCase().includes(query) ||
                    util.description.toLowerCase().includes(query),
            );

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(results, null, 2),
                    },
                ],
            };
        }

        case "get_utility": {
            const name = args.name as string;
            const utility = data.utilities.find(
                (u) => u.name.toLowerCase() === name.toLowerCase(),
            );

            if (!utility) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Utility "${name}" not found. Use search_utilities to find available utilities.`,
                        },
                    ],
                };
            }

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(utility, null, 2),
                    },
                ],
            };
        }

        case "list_all_components": {
            const categoryFilter = args.category as string | undefined;
            let filteredComponents = data.components;

            if (categoryFilter) {
                filteredComponents = data.components.filter((c) =>
                    c.category
                        .toLowerCase()
                        .includes(categoryFilter.toLowerCase()),
                );
            }

            const list = filteredComponents.map((c) => ({
                name: c.name,
                display_name: c.display_name,
                category: c.category,
                import_path: c.import_path,
                description: c.description,
                has_code_examples: !!(c.code_examples && Object.keys(c.code_examples).length > 0),
                has_compound_components: !!(c.compound_components && Object.keys(c.compound_components).length > 0),
            }));

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(list, null, 2),
                    },
                ],
            };
        }

        case "list_all_hooks": {
            const list = data.hooks.map((h) => ({
                name: h.name,
                display_name: h.display_name,
                category: h.category,
                import_path: h.import_path,
                description: h.description,
            }));

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(list, null, 2),
                    },
                ],
            };
        }

        case "list_all_utilities": {
            const list = data.utilities.map((u) => ({
                name: u.name,
                display_name: u.display_name,
                category: u.category,
                import_path: u.import_path,
                description: u.description,
            }));

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(list, null, 2),
                    },
                ],
            };
        }

        case "get_code_examples": {
            const compName = args.name as string;
            const component = data.components.find(
                (c) => c.name.toLowerCase() === compName.toLowerCase(),
            );

            if (!component) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Component "${compName}" not found. Use search_components or list_all_components to find available components.`,
                        },
                    ],
                };
            }

            if (
                !component.code_examples ||
                Object.keys(component.code_examples).length === 0
            ) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `No code examples available for "${compName}". Check the component documentation with get_component for usage guidelines instead.`,
                        },
                    ],
                };
            }

            const examplesOutput = Object.entries(component.code_examples)
                .map(
                    ([key, example]) =>
                        `### ${example.title}\n\n\`\`\`tsx\n${example.code}\n\`\`\``,
                )
                .join("\n\n---\n\n");

            return {
                content: [
                    {
                        type: "text",
                        text: `# Code Examples for ${component.display_name}\n\nImport: \`${component.import_path}\`\n\n${examplesOutput}`,
                    },
                ],
            };
        }

        case "get_composition_patterns": {
            const patternFilter = args.pattern as string | undefined;

            let patterns = COMPOSITION_PATTERNS;
            if (patternFilter) {
                patterns = COMPOSITION_PATTERNS.filter((p) =>
                    p.name
                        .toLowerCase()
                        .includes(patternFilter.toLowerCase()),
                );
            }

            if (patterns.length === 0) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `No composition pattern found matching "${patternFilter}". Available patterns: ${COMPOSITION_PATTERNS.map((p) => p.name).join(", ")}`,
                        },
                    ],
                };
            }

            const output = patterns
                .map(
                    (p) =>
                        `## ${p.name}\n\n${p.description}\n\n**Components:** ${p.components.join(", ")}\n**Hooks:** ${p.hooks.join(", ")}\n**Utilities:** ${p.utilities.join(", ")}\n\n### Example Structure\n\n\`\`\`tsx\n${p.example_structure}\n\`\`\``,
                )
                .join("\n\n---\n\n");

            return {
                content: [
                    {
                        type: "text",
                        text: output,
                    },
                ],
            };
        }

        case "add_new_page": {
            const { pageName, path: routePath, menuGroup } = args as {
                pageName: string;
                path: string;
                menuGroup?: string;
            };

            const projectRoot = path.resolve(__dirname, "../..");
            const viewsDir = path.join(projectRoot, "src", "views");
            const routesConfigPath = path.join(projectRoot, "src", "configs", "routes.config", "routes.config.ts");
            const navConfigPath = path.join(projectRoot, "src", "configs", "navigation.config", "index.ts");

            try {
                const targetViewPath = path.join(viewsDir, `${pageName}.tsx`);

                const viewContent = `import React from 'react'

const ${pageName} = () => {
    return (
        <div>
            ${pageName}
        </div>
    )
}

export default ${pageName}`;

                await fs.writeFile(targetViewPath, viewContent);

                const routesContent = await fs.readFile(routesConfigPath, "utf-8");

                if (routesContent.includes(`path: '${routePath}'`)) {
                    throw new Error(`Route path '${routePath}' already exists.`);
                }

                const newRouteConfig = `    {
        key: '${pageName.toLowerCase()}',
        path: '${routePath}',
        component: lazy(() => import('@/views/${pageName}')),
        authority: [],
        access: 'protected',
    },
`;
                const routesUpdated = routesContent.replace(
                    /(export const routes: Routes = \[\s*[\s\S]*?)(\s*\])/,
                    `$1${newRouteConfig}$2`
                );

                await fs.writeFile(routesConfigPath, routesUpdated);

                const navContent = await fs.readFile(navConfigPath, "utf-8");

                const newNavConfig = `    {
        key: '${pageName.toLowerCase()}',
        path: '${routePath}',
        title: '${pageName}',
        translateKey: 'nav.${pageName.toLowerCase()}',
        icon: '',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
`;

                let navUpdated = navContent;
                if (menuGroup) {
                    const groupRegex = new RegExp(`(key: '${menuGroup}',[\\s\\S]*?subMenu: \\[)([\\s\\S]*?)(\\])`, 'm');
                    if (groupRegex.test(navContent)) {
                        navUpdated = navContent.replace(groupRegex, `$1$2${newNavConfig}$3`);
                    } else {
                        navUpdated = navContent.replace(
                            /(const navigationConfig: NavigationTree\[\] = \[\s*[\s\S]*?)(\s*\])/,
                            `$1${newNavConfig}$2`
                        );
                    }
                } else {
                    navUpdated = navContent.replace(
                        /(const navigationConfig: NavigationTree\[\] = \[\s*[\s\S]*?)(\s*\])/,
                        `$1${newNavConfig}$2`
                    );
                }

                await fs.writeFile(navConfigPath, navUpdated);

                return {
                    content: [
                        {
                            type: "text",
                            text: `Successfully created page '${pageName}' at '${routePath}' and updated configs.`,
                        },
                    ],
                };
            } catch (error: any) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Error adding new page: ${error.message}`,
                        },
                    ],
                };
            }
        }

        case "cleanup_starter_code": {
            const { confirm } = args as { confirm: boolean };
            if (!confirm) {
                return {
                    content: [{ type: "text", text: "Please confirm deletion by setting 'confirm' to true." }]
                };
            }

            const projectRoot = path.resolve(__dirname, "../..");
            const routesConfigPath = path.join(projectRoot, "src", "configs", "routes.config", "routes.config.ts");
            const navConfigPath = path.join(projectRoot, "src", "configs", "navigation.config", "index.ts");

            try {
                let routesContent = await fs.readFile(routesConfigPath, "utf-8");

                const routeBlockRegex = /\/\*\* Example purpose only, please remove \*\/[\s\S]*?(?=export const getRoutesByAccess)/;

                if (routeBlockRegex.test(routesContent)) {
                    routesContent = routesContent.replace(routeBlockRegex, "];\n\n");
                    await fs.writeFile(routesConfigPath, routesContent);
                }
                let navContent = await fs.readFile(navConfigPath, "utf-8");
                const navBlockRegex = /\/\*\* Example purpose only, please remove \*\/[\s\S]*?(?=export default)/;

                if (navBlockRegex.test(navContent)) {
                    navContent = navContent.replace(navBlockRegex, "];\n\n");
                    await fs.writeFile(navConfigPath, navContent);
                }

                return {
                    content: [
                        {
                            type: "text",
                            text: "Successfully removed example code from starter template.",
                        },
                    ],
                };
            } catch (error: any) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Error cleaning up starter code: ${error.message}`,
                        },
                    ],
                };
            }
        }

        case "scaffold_pattern_view": {
            const { pattern, entityName } = args as { pattern: string; entityName: string };
            const patternDef = COMPOSITION_PATTERNS.find(p => p.name === pattern);

            if (!patternDef) {
                return {
                    content: [{ type: "text", text: `Pattern '${pattern}' not found.` }]
                };
            }

            let code = patternDef.example_structure;

            code = code.replace(/Item/g, entityName);

            return {
                content: [
                    {
                        type: "text",
                        text: code,
                    },
                ],
            };
        }

        case "configure_theme": {
            const { primaryColor } = args as { primaryColor: string };
            const projectRoot = path.resolve(__dirname, "../..");
            const cssPath = path.join(projectRoot, "src", "assets", "styles", "tailwind", "index.css");

            try {
                let cssContent = await fs.readFile(cssPath, "utf-8");

                const regex = /--primary:\s*[^;]+;/;

                if (regex.test(cssContent)) {
                    cssContent = cssContent.replace(regex, `--primary: ${primaryColor};`);
                    await fs.writeFile(cssPath, cssContent);
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Successfully updated primary color to ${primaryColor}`,
                            },
                        ],
                    };
                } else {
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Could not find --primary variable in ${cssPath}. Please ensure the path is correct for your template version.`,
                            },
                        ],
                    };
                }
            } catch (error: any) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Error updating theme: ${error.message}`,
                        },
                    ],
                };
            }
        }

        default:
            throw new Error(`Unknown tool: ${name}`);
    }
});

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Eyris MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
