import { LiEye, LiEyeSlash, LiBan } from '@/icons'
import type { ReactNode } from 'react'

export const visibilityOptions: {
    label: string
    value: string
    description: string
    icon: ReactNode
}[] = [
    {
        label: 'Public',
        value: 'public',
        description: 'Visible to everyone and searchable on the frontend.',
        icon: <LiEye />,
    },
    {
        label: 'Private',
        value: 'private',
        description:
            'Only visible to admins or users with permission. Hidden from customers.',
        icon: <LiEyeSlash />,
    },
    {
        label: 'Unlisted',
        value: 'unlisted',
        description:
            'Accessible via direct link only. Not shown in listings or search.',
        icon: <LiBan />,
    },
]

export const statusOptions: { label: string; value: string; color: string }[] =
    [
        {
            label: 'Active',
            value: 'active',
            color: 'bg-success',
        },
        {
            label: 'Inactive',
            value: 'inactive',
            color: 'bg-error',
        },
        {
            label: 'Draft',
            value: 'draft',
            color: 'bg-gray-300 dark:bg-gray-700',
        },
        {
            label: 'Archived',
            value: 'archived',
            color: 'bg-warning',
        },
    ]

export const stockStatusOptions: {
    label: string
    value: string
    color: string
}[] = [
    {
        label: 'In Stock',
        value: 'inStock',
        color: 'bg-success',
    },
    {
        label: 'Out of Stock',
        value: 'outOfStock',
        color: 'bg-error',
    },
    {
        label: 'Low Stock',
        value: 'lowStock',
        color: 'bg-warning',
    },
]

export const wareHouseOptions: { label: string; value: string }[] = [
    {
        label: 'Main Warehouse',
        value: 'main',
    },
    {
        label: 'Secondary Warehouse',
        value: 'secondary',
    },
    {
        label: 'Retail Store',
        value: 'retail',
    },
]

export const weightUnitOptions: { label: string; value: string }[] = [
    {
        label: 'Kilogram (kg)',
        value: 'kg',
    },
    {
        label: 'Gram (g)',
        value: 'g',
    },
    {
        label: 'Ounce (oz)',
        value: 'oz',
    },
    {
        label: 'Pound (lb)',
        value: 'lb',
    },
]

export const lengthUnitOptions: { label: string; value: string }[] = [
    {
        label: 'Millimeter (mm)',
        value: 'mm',
    },
    {
        label: 'Centimeter (cm)',
        value: 'cm',
    },
    {
        label: 'Inch (in)',
        value: 'in',
    },
    {
        label: 'Foot (ft)',
        value: 'ft',
    },
]

export const shippingClassOptions: { label: string; value: string }[] = [
    {
        label: 'Standard',
        value: 'standard',
    },
    {
        label: 'Priority',
        value: 'priority',
    },
    {
        label: 'Express',
        value: 'express',
    },
]

export const categoryMap = {
    clothing: {
        label: 'Clothing',
    },
    electronics: {
        label: 'Electronics',
    },
    shoes: {
        label: 'Shoes',
    },
    accessories: {
        label: 'Accessories',
    },
    watches: {
        label: 'Watches',
    },
    beauty: {
        label: 'Beauty',
    },
    bags: {
        label: 'Bags',
    },
    music: {
        label: 'Music Instruments',
    },
}

export const productDetailSectionList = [
    {
        label: 'Basic info',
        value: 'basicInfo',
        fields: [
            'name',
            'productCode',
            'slug',
            'description',
            'visibility',
            'category',
            'status',
            'imgList',
        ],
    },
    {
        label: 'Pricing',
        value: 'pricing',
        fields: [
            'price',
            'taxRate',
            'costPerItem',
            'bulkDiscountPrice',
            'variants',
        ],
    },
    {
        label: 'Inventory',
        value: 'inventory',
        fields: [
            'sku',
            'stock',
            'stockStatus',
            'warehouse',
            'allowBackorder',
            'weight',
            'length',
            'height',
            'weightUnit',
            'dimensionUnit',
            'shippingClass',
            'freeShipping',
        ],
    },
]
