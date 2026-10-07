import { useNavigate } from 'react-router'
import Button from '@/components/ui/Button'
import Container from '@/components/shared/Container'
import { LuPlus } from 'react-icons/lu'

const ProductListHeader = () => {
    const navigate = useNavigate()

    return (
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <Container className="sm:px-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h5>Product List</h5>
                        <p>
                            Track stock level, availability & reorder in real
                            time
                        </p>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Button
                            className="w-full md:w-auto"
                            variant="subtle"
                            icon={<LuPlus />}
                            onClick={() => navigate('/apps/sales/product')}
                        >
                            Add Product
                        </Button>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default ProductListHeader
