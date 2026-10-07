import ProductListSearch from './ProductListSearch'
import ProductListFilter from './ProductListFilter'
import ProductListExport from './ProductListExport'
import useProductListData from '../hooks/useProductListData'

const ProductListTableTools = () => {
    const { setQueryParams } = useProductListData()

    const handleInputChange = (val: string) => {
        setQueryParams({ query: val })
    }

    return (
        <div className="flex items-center sm:justify-between gap-2">
            <div className="flex-1 sm:flex-none">
                <ProductListSearch onInputChange={handleInputChange} />
            </div>
            <div className="flex items-center gap-2">
                <div>
                    <ProductListFilter />
                </div>
                <div>
                    <ProductListExport />
                </div>
            </div>
        </div>
    )
}

export default ProductListTableTools
