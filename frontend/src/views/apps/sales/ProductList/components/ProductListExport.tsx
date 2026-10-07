import Button from '@/components/ui/Button'
import useProductListData from '../hooks/useProductListData'
import useResponsive from '@/utils/hooks/useResponsive'
import { LiDownload } from '@/icons'
import { CSVLink } from 'react-csv'

const ProductListExport = () => {
    const { data } = useProductListData()
    const { larger } = useResponsive()

    return (
        <CSVLink
            className="w-full"
            filename="products.csv"
            data={data?.list || []}
        >
            <Button icon={<LiDownload />}>{larger.sm ? 'Export' : ''}</Button>
        </CSVLink>
    )
}

export default ProductListExport
