export type Image = {
    id: string
    name: string
    src: string
}
export type Product = {
    id: string
    name: string
    productCode: string
    img: string
    imgList: Image[]
    category: string
    price: number
    stock: number
    status: number
    sales: number
    stockPercentage: number
}

export type Filter = {
    minAmount: number | string
    maxAmount: number | string
    stockLevel: string
    productStatus: string
    productType: string[]
}

export type GetProductListResponse = {
    list: Product[]
    total: number
    meta: {
        lowestPrice: number
        highestPrice: number
        rangeData: { value: number; label: string }[]
    }
}
