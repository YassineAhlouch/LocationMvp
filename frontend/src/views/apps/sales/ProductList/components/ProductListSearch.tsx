import DebouceInput from '@/components/shared/DebouceInput'
import { LuSearch } from 'react-icons/lu'
import { Ref } from 'react'

type ProductListSearchProps = {
    onInputChange: (value: string) => void
    ref?: Ref<HTMLInputElement>
}

const ProductListSearch = (props: ProductListSearchProps) => {
    const { onInputChange, ref } = props

    return (
        <DebouceInput
            ref={ref}
            placeholder="Search"
            prefix={<LuSearch className="text-lg" />}
            onChange={(e) => onInputChange(e.target.value)}
        />
    )
}

export default ProductListSearch
