import { useState, useMemo } from 'react'
import SectionCard from './SectionCard'
import Input from '@/components/ui/Input'
import Upload from '@/components/ui/Upload'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import Select from '@/components/ui/Select'
import { FormItem } from '@/components/ui/Form'
import Dialog from '@/components/ui/Dialog'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import RichTextEditor from '@/components/shared/RichTextEditor'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import SelectOptionWithPrefix from '@/components/shared/SelectOptionWithPrefix'
import { visibilityOptions, statusOptions, categoryMap } from '../utils'
import classNames from '@/utils/classNames'
import { HiEye, HiTrash } from 'react-icons/hi'
import { PiImagesThin } from 'react-icons/pi'
import cloneDeep from 'lodash/cloneDeep'
import { Controller } from 'react-hook-form'
import type { FormSectionBaseProps } from '../types'

type BasicInfoSectionProps = FormSectionBaseProps

type Image = {
    id: string
    name: string
    src: string
}

type ImageListProps = {
    imgList: Image[]
    onImageDelete: (img: Image) => void
}

const ImageList = (props: ImageListProps) => {
    const { imgList, onImageDelete } = props

    const [selectedImg, setSelectedImg] = useState<Image>({} as Image)
    const [viewOpen, setViewOpen] = useState(false)
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

    const onViewOpen = (img: Image) => {
        setSelectedImg(img)
        setViewOpen(true)
    }

    const onDialogClose = () => {
        setViewOpen(false)
        setTimeout(() => {
            setSelectedImg({} as Image)
        }, 300)
    }

    const onDeleteConfirmation = (img: Image) => {
        setSelectedImg(img)
        setDeleteConfirmationOpen(true)
    }

    const onDeleteConfirmationClose = () => {
        setSelectedImg({} as Image)
        setDeleteConfirmationOpen(false)
    }

    const onDelete = () => {
        onImageDelete?.(selectedImg)
        setDeleteConfirmationOpen(false)
    }

    return (
        <>
            {imgList.map((img) => (
                <div
                    key={img.id}
                    className="group relative rounded-xl border border-gray-200 dark:border-gray-600 p-2 flex w-[140px]"
                >
                    <img
                        className="rounded-lg max-h-[140px] mx-auto max-w-full dark:bg-transparent"
                        src={img.src}
                        alt={img.name}
                    />
                    <div className="absolute inset-2 bg-[#000000ba] group-hover:flex hidden text-xl items-center justify-center rounded-lg">
                        <span
                            className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
                            onClick={() => onViewOpen(img)}
                        >
                            <HiEye />
                        </span>
                        <span
                            className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
                            onClick={() => onDeleteConfirmation(img)}
                        >
                            <HiTrash />
                        </span>
                    </div>
                </div>
            ))}
            <Dialog isOpen={viewOpen} onClose={onDialogClose}>
                <h5 className="mb-4">{selectedImg.name}</h5>
                <img
                    className="w-full"
                    src={selectedImg.src}
                    alt={selectedImg.name}
                />
            </Dialog>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove image"
                onClose={onDeleteConfirmationClose}
                onCancel={onDeleteConfirmationClose}
                onConfirm={onDelete}
            >
                <p> Are you sure you want to remove this image? </p>
            </ConfirmDialog>
        </>
    )
}

const BasicInfoSection = ({ control, errors }: BasicInfoSectionProps) => {
    const categoryOptions = useMemo(
        () =>
            Object.entries(categoryMap).map(([key, value]) => ({
                label: value.label,
                value: key,
            })),
        [],
    )

    const beforeUpload = (file: FileList | null) => {
        let valid: boolean | string = true

        const allowedFileType = ['image/jpeg', 'image/png']
        const maxFileSize = 500000

        if (file) {
            for (const f of file) {
                if (!allowedFileType.includes(f.type)) {
                    valid = 'Please upload a .jpeg or .png file!'
                }

                if (f.size >= maxFileSize) {
                    valid = 'Upload image cannot more then 500kb!'
                }
            }
        }

        return valid
    }

    const handleUpload = (
        onChange: (images: Image[]) => void,
        originalImageList: Image[] = [],
        files: File[],
    ) => {
        let imageId = '1-img-0'
        const latestUpload = files.length - 1
        if (originalImageList.length > 0) {
            const prevImgId = originalImageList[originalImageList.length - 1].id
            const splitImgId = prevImgId.split('-')
            const newIdNumber = parseInt(splitImgId[splitImgId.length - 1]) + 1
            splitImgId.pop()
            const newIdArr = [...splitImgId, ...[newIdNumber]]
            imageId = newIdArr.join('-')
        }
        const image = {
            id: imageId,
            name: files[latestUpload].name,
            src: URL.createObjectURL(files[latestUpload]),
        }
        const imageList = [...originalImageList, ...[image]]
        onChange(imageList)
    }

    const handleImageDelete = (
        onChange: (images: Image[]) => void,
        originalImageList: Image[] = [],
        deletedImg: Image,
    ) => {
        let imgList = cloneDeep(originalImageList)
        imgList = imgList.filter((img) => img.id !== deletedImg.id)
        onChange(imgList)
    }

    return (
        <div className="space-y-4">
            <SectionCard
                title="Product Information"
                description="Basic details about your product"
            >
                <FormItem
                    label="Product name"
                    invalid={Boolean(errors.name)}
                    errorMessage={errors.name?.message}
                >
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Product Name"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <div className="grid grid-cols-2 gap-4">
                    <FormItem
                        label="Product code"
                        invalid={Boolean(errors.productCode)}
                        errorMessage={errors.productCode?.message}
                    >
                        <Controller
                            name="productCode"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Product Code"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Slug"
                        invalid={Boolean(errors.slug)}
                        errorMessage={errors.slug?.message}
                    >
                        <Controller
                            name="slug"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    autoComplete="off"
                                    placeholder="Product Slug"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                </div>
                <FormItem
                    label="Category"
                    invalid={Boolean(errors.category)}
                    errorMessage={errors.category?.message}
                >
                    <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={categoryOptions}
                                value={categoryOptions.find(
                                    (option) => option.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option.value)
                                }
                                placeholder="Select status"
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Description"
                    invalid={Boolean(errors.description)}
                    errorMessage={errors.description?.message}
                >
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <RichTextEditor
                                content={field.value}
                                invalid={Boolean(errors.description)}
                                onChange={({ html }) => {
                                    field.onChange(html)
                                }}
                            />
                        )}
                    />
                </FormItem>
            </SectionCard>
            <SectionCard
                title="Product Images"
                description="JPEG, PNG or WebP. Max 300 KB"
            >
                <FormItem
                    invalid={Boolean(errors.imgList)}
                    errorMessage={errors.imgList?.message}
                    className="mb-4"
                >
                    <Controller
                        name="imgList"
                        control={control}
                        render={({ field }) => (
                            <>
                                {field.value && field.value.length ? (
                                    <div className="inline-flex flex-wrap gap-2">
                                        <ImageList
                                            imgList={field.value}
                                            onImageDelete={(img: Image) =>
                                                handleImageDelete(
                                                    field.onChange,
                                                    field.value,
                                                    img,
                                                )
                                            }
                                        />
                                        <Upload
                                            draggable
                                            className="min-h-fit bg-gray-50 dark:bg-gray-900"
                                            beforeUpload={beforeUpload}
                                            showList={false}
                                            onChange={(_, files) =>
                                                handleUpload(
                                                    field.onChange,
                                                    field.value,
                                                    files,
                                                )
                                            }
                                        >
                                            <div className="max-w-full flex flex-col px-4 py-2 justify-center items-center w-[140px]">
                                                <div className="text-[50px]">
                                                    <PiImagesThin />
                                                </div>
                                                <p className="text-center mt-1 text-xs">
                                                    <span className="text-gray-800 dark:text-white">
                                                        Drop your image here, or{' '}
                                                        {''}
                                                    </span>
                                                    <span className="text-primary">
                                                        Click to browse
                                                    </span>
                                                </p>
                                            </div>
                                        </Upload>
                                    </div>
                                ) : (
                                    <Upload
                                        draggable
                                        beforeUpload={beforeUpload}
                                        showList={false}
                                        className="bg-gray-50 dark:bg-gray-900"
                                        onChange={(_, files) =>
                                            handleUpload(
                                                field.onChange,
                                                field.value,
                                                files,
                                            )
                                        }
                                    >
                                        <div className="max-w-full flex flex-col px-4 py-8 justify-center items-center">
                                            <div className="text-[60px]">
                                                <PiImagesThin />
                                            </div>
                                            <p className="flex flex-col items-center mt-2">
                                                <span className="text-gray-800 dark:text-white">
                                                    Drop your image here, or{' '}
                                                    {''}
                                                </span>
                                                <span className="text-primary">
                                                    Click to browse
                                                </span>
                                            </p>
                                        </div>
                                    </Upload>
                                )}
                            </>
                        )}
                    />
                </FormItem>
            </SectionCard>
            <SectionCard
                title="Status & Visibility"
                description="Control product availability and visibility settings"
                bordered={false}
            >
                <FormItem
                    label="Status"
                    invalid={Boolean(errors.status)}
                    errorMessage={errors.status?.message}
                >
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder="Select status"
                                value={statusOptions.find(
                                    (option) => option.value === field.value,
                                )}
                                options={statusOptions}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                                customInputDisplay={(selectedItem) => (
                                    <SelectInputWithPrefix
                                        label={selectedItem?.label}
                                        prefix={
                                            selectedItem && (
                                                <Badge
                                                    className={classNames(
                                                        'h-3.5 w-3.5',
                                                        selectedItem.color,
                                                    )}
                                                />
                                            )
                                        }
                                    />
                                )}
                                customOption={({
                                    option,
                                    selected,
                                    CheckIcon,
                                }) => (
                                    <SelectOptionWithPrefix
                                        label={option.label}
                                        prefix={
                                            <Badge
                                                className={classNames(
                                                    'h-3 w-3',
                                                    option.color,
                                                )}
                                            />
                                        }
                                        selected={selected}
                                        checkIcon={CheckIcon}
                                    />
                                )}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Visibility"
                    invalid={Boolean(errors.visibility)}
                    errorMessage={errors.visibility?.message}
                >
                    <Controller
                        name="visibility"
                        control={control}
                        render={({ field }) => (
                            <div className="space-y-2 mt-2">
                                {visibilityOptions.map((option) => {
                                    const active = option.value === field.value
                                    return (
                                        <button
                                            className={classNames(
                                                'flex  items-center justify-between gap-2 p-2 w-full border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800',
                                                active
                                                    ? 'border-primary dark:border-primary'
                                                    : 'border-gray-200 dark:border-gray-700',
                                            )}
                                            key={option.value}
                                            type="button"
                                            onClick={() =>
                                                field.onChange(option.value)
                                            }
                                        >
                                            <span className="flex items-center gap-2">
                                                <span>
                                                    <Avatar
                                                        className={classNames(
                                                            'border-0',
                                                            active
                                                                ? 'bg-primary-subtle text-primary'
                                                                : 'heading-text',
                                                        )}
                                                        icon={
                                                            <span className="text-lg">
                                                                {option.icon}
                                                            </span>
                                                        }
                                                    />
                                                </span>
                                                <span className="flex flex-col items-start">
                                                    <span className="font-medium heading-text">
                                                        {option.label}
                                                    </span>
                                                    <span className="text-xs font-medium">
                                                        {option.description}
                                                    </span>
                                                </span>
                                            </span>
                                            {active && (
                                                <span className="rounded-full border-6 border-primary flex">
                                                    <span className="h-1.5 w-1.5 bg-white rounded-full"></span>
                                                </span>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    />
                </FormItem>
            </SectionCard>
        </div>
    )
}

export default BasicInfoSection
