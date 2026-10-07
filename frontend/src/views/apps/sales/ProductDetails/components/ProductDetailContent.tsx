import Container from '@/components/shared/Container'
import ProductForm from './ProductForm'
import { useProductDetailsStore } from '../store/productDetailsStore'
import type {
    ProductFormHandle,
    ProductFormData,
    ProductFormRef,
} from '../types'

type ProductDetailContentProps = ProductFormHandle &
    ProductFormData &
    ProductFormRef

const ProductDetailContent = ({
    onBeforeSubmit,
    onSubmit,
    ref,
    data,
}: ProductDetailContentProps) => {
    const selectedSection = useProductDetailsStore(
        (state) => state.selectedSection,
    )

    return (
        <Container size="md" className="p-4">
            <ProductForm
                ref={ref}
                onSubmit={onSubmit}
                onBeforeSubmit={onBeforeSubmit}
                selectedSection={selectedSection}
                data={data}
            />
        </Container>
    )
}

export default ProductDetailContent
