import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import OverflowTabs from '@/components/shared/OverflowTabs'
import Container from '@/components/shared/Container'
import IconFrame from '@/components/shared/IconFrame'
import { useProductDetailsStore } from '../store/productDetailsStore'
import { productDetailSectionList } from '../utils'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { LiBoxAdd } from '@/icons'
import type { Image, FormMode } from '../types'

type ProductDetailsHeaderProps = {
    data?: {
        id: string
        name: string
        productCode: string
        img?: Image
    }
    isLoading?: boolean
    mode: FormMode
}

const ProductDetailsHeader = ({ data, mode }: ProductDetailsHeaderProps) => {
    const selectedSection = useProductDetailsStore(
        (state) => state.selectedSection,
    )
    const setSelectedSection = useProductDetailsStore(
        (state) => state.setSelectedSection,
    )
    const invalidFields = useProductDetailsStore((state) => state.invalidFields)

    const [message, setMessage] = useTimeOutMessage()

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href)
        setMessage('Copied')
    }

    const renderCopyLinkButton = () => (
        <Button onClick={() => handleCopy()}>
            {message ? message : 'Copy Link'}
        </Button>
    )

    return (
        <div className="pt-4 px-4 border-b border-gray-200 dark:border-gray-800">
            <Container size="md" className="md:px-4">
                <div className="flex flex-col md:flex-row md:justify-between gap-4">
                    {data && mode === 'edit' && (
                        <>
                            <div className="flex items-center gap-4">
                                {data.img && (
                                    <Avatar src={data.img.src} size={40} />
                                )}
                                <div>
                                    <h5 className="font-semibold">
                                        {data.name}
                                    </h5>
                                    <span className="font-medium">
                                        <span>SKU: </span>
                                        <span>{data.productCode}</span>
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {renderCopyLinkButton()}
                                <Button>Duplicate</Button>
                            </div>
                        </>
                    )}
                    {mode === 'create' && (
                        <>
                            <div className="flex items-center gap-4">
                                <IconFrame variant="layered">
                                    <LiBoxAdd className="text-xl heading-text" />
                                </IconFrame>
                                <div>
                                    <h5 className="font-semibold">
                                        Add new Product
                                    </h5>
                                    <span>
                                        Add and manage product details before
                                        publishing.
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {renderCopyLinkButton()}
                            </div>
                        </>
                    )}
                </div>
                <div className="mt-4">
                    <OverflowTabs
                        value={selectedSection}
                        onChange={setSelectedSection}
                        className="flex justify-between items-center"
                        tabListClass="border-0"
                        tabNavClass="min-w-[100px] text-center"
                        tabList={productDetailSectionList.map((item) => {
                            if (
                                item.fields.some((field) =>
                                    invalidFields.includes(field),
                                )
                            ) {
                                return {
                                    ...item,
                                    label: (
                                        <span>
                                            {item.label}{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </span>
                                    ),
                                }
                            }

                            return item
                        })}
                    ></OverflowTabs>
                </div>
            </Container>
        </div>
    )
}

export default ProductDetailsHeader
