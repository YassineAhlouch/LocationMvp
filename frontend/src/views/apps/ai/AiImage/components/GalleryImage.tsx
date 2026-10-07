import { useState } from 'react'
import Button from '@/components/ui/Button'
import Tooltip from '@/components/ui/Tooltip'
import { TbDownload, TbHeart, TbHeartFilled } from 'react-icons/tb'
import type { GelleryItem } from '../type'

type GalleryImageProps = {
    galleryItem: GelleryItem
}

const GalleryImage = (props: GalleryImageProps) => {
    const { galleryItem } = props

    const [liked, setLiked] = useState(false)

    const downloadFile = () => {
        const fileSegment = galleryItem.image?.split('/') as string[]
        const fileName = fileSegment[fileSegment?.length - 1]
        const link = document.createElement('a')
        link.href = galleryItem.image || ''
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        link.parentNode?.removeChild(link)
    }

    return (
        <div
            key={galleryItem.id}
            className="rounded-lg cursor-pointer relative group ring-2 ring-transparent hover:ring-black dark:hover:ring-white p-1"
        >
            <img className="rounded-lg w-full" src={galleryItem.image} />
            <div className="flex gap-2 absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100 duration-150 ease-in-out">
                <Tooltip title={liked ? 'Dislike' : 'Like'} placement="top">
                    <Button
                        className={() =>
                            'bg-white hover:bg-gray-100 text-gray-900'
                        }
                        icon={
                            liked ? (
                                <TbHeartFilled className="text-pink-500" />
                            ) : (
                                <TbHeart />
                            )
                        }
                        onClick={() => setLiked(!liked)}
                    />
                </Tooltip>
                <Tooltip title="Download" placement="top">
                    <Button
                        className={() =>
                            'bg-white hover:bg-gray-100 text-gray-900'
                        }
                        icon={<TbDownload />}
                        onClick={downloadFile}
                    />
                </Tooltip>
            </div>
        </div>
    )
}

export default GalleryImage
