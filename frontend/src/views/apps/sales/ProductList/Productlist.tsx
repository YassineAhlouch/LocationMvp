import Container from '@/components/shared/Container'
import ProductListContext from './components/ProductListContext'
import ProductListHeader from './components/ProductListHeader'
import ProductListTableTools from './components/ProductListTableTools'
import ProductListTable from './components/ProductListTable'
import ProductListSelected from './components/ProductListSelected'
import QuickEdit from './components/QuickEdit'

const Products = () => {
    return (
        <ProductListContext>
            <ProductListHeader />
            <Container className="p-4">
                <div className="flex flex-col gap-4">
                    <ProductListTableTools />
                    <ProductListTable />
                </div>
            </Container>
            <QuickEdit />
            <ProductListSelected />
        </ProductListContext>
    )
}

export default Products
