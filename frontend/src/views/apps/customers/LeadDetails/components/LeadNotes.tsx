import { useState, useMemo, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import Dialog from '@/components/ui/Dialog'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import { FormItem, Form } from '@/components/ui/Form'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import SelectOptionWithPrefix from '@/components/shared/SelectOptionWithPrefix'
import Loading from '@/components/shared/Loading'
import RichTextEditor from '@/components/shared/RichTextEditor'
import IconFrame from '@/components/shared/IconFrame'
import { LiCross, LiMenuBoard, LiEdit2, LiAdd } from '@/icons'
import { apiGetNotes } from '@/services/CustomersService'
import classNames from '@/utils/classNames'
import sleep from '@/utils/sleep'
import useSWR from 'swr'
import dayjs from 'dayjs'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Note } from '../types'

type LeadNotesProps = {
    leadId: string
}

type NewNoteDialogProps = {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: FormSchema) => void
}

type FormSchema = {
    title: string
    content: string
    category: string
    tags: {
        value: string
        label: string
    }[]
}

const tags = [
    { value: 'Feedback', label: 'Feedback' },
    { value: 'UI/UX', label: 'UI/UX' },
    { value: 'Dashboard', label: 'Dashboard' },
    { value: 'Requirements', label: 'Requirements' },
    { value: 'Integration', label: 'Integration' },
    { value: 'API', label: 'API' },
    { value: 'Budget', label: 'Budget' },
    { value: 'Planning', label: 'Planning' },
]

const categoryColor: Record<string, string> = {
    'Product Feedback': 'bg-[#f24195]',
    Requirements: 'bg-[#ff712c]',
    Financial: 'bg-[#7f37c3]',
}

const noteValidationSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    category: z.string().min(1, 'Category is required'),
    tags: z
        .array(
            z.object({
                value: z.string(),
                label: z.string(),
            }),
        )
        .max(3, 'You can only select up to 3 tags')
        .min(1, 'At least one tag is required'),
})

const NoteItem = ({
    data,
    index,
    total,
}: {
    data: Note
    index: number
    total: number
}) => {
    const [content, setContent] = useState(data.content)
    const [isEditing, setIsEditing] = useState(false)

    return (
        <>
            <div
                className={classNames(
                    'border-gray-200 dark:border-gray-700 p-4',
                    index !== total - 1 && 'border-b',
                )}
            >
                <div className="flex flex-col sm:flex-row justify-between gap-2 mb-2">
                    <div>
                        <h6 className="font-semibold flex items-center gap-2 leading-normal">
                            <span
                                className={classNames(
                                    'h-3 w-3 rounded',
                                    categoryColor[data.category],
                                )}
                            ></span>
                            {data.title}
                        </h6>
                        <p className="text-xs font-medium">
                            {dayjs(new Date())
                                .subtract(index, 'week')
                                .format('MMM DD, YYYY')}{' '}
                            by {data.author}
                        </p>
                    </div>
                </div>
                <p className="mt-4 line-clamp-2">{content}</p>
                <div className="flex justify-between items-center mt-3">
                    <div className="flex flex-wrap gap-2">
                        {data.tags.map((tag, index) => (
                            <Tag key={index}>{tag}</Tag>
                        ))}
                    </div>
                    <Button
                        variant="ghost"
                        icon={<LiEdit2 />}
                        onClick={() => setIsEditing(true)}
                    >
                        Edit
                    </Button>
                </div>
            </div>
            <Dialog isOpen={isEditing} onClose={() => setIsEditing(false)}>
                <div>
                    <h5 className="mb-4">Edit Note</h5>
                    <RichTextEditor
                        content={content}
                        onChange={({ text }) => setContent(text)}
                    />
                </div>
                <div className="flex justify-end mt-4">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="subtle"
                        onClick={() => setIsEditing(false)}
                    >
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={() => setIsEditing(false)}>
                        Save
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

const NewNoteDialog = ({ isOpen, onClose, onSubmit }: NewNoteDialogProps) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormSchema>({
        resolver: zodResolver(noteValidationSchema),
        defaultValues: {
            title: '',
            content: '',
            category: '',
            tags: [],
        },
    })

    const options = useMemo(() => {
        return Object.entries(categoryColor).map(([key, value]) => ({
            label: key,
            value: key,
            color: value,
        }))
    }, [])

    useEffect(() => {
        if (isOpen) {
            reset()
        }
    }, [isOpen, reset])

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            className="p-0"
            closable={false}
        >
            <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-4">
                    <IconFrame variant="thick">
                        <LiMenuBoard className="text-xl heading-text" />
                    </IconFrame>
                    <div>
                        <h5>Add Note</h5>
                        <p className="pr-12">Add a new note to this lead</p>
                    </div>
                </div>
                <Button
                    variant="subtle"
                    size="sm"
                    type="button"
                    icon={<LiCross className="text-2xl" />}
                    onClick={onClose}
                />
            </div>
            <div className="p-4">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormItem
                        label="Title"
                        errorMessage={errors.title?.message}
                        invalid={Boolean(errors.title)}
                    >
                        <Controller
                            name="title"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Enter note title"
                                    className="w-full"
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Content"
                        errorMessage={errors.content?.message}
                        invalid={Boolean(errors.content)}
                    >
                        <Controller
                            name="content"
                            control={control}
                            render={({ field }) => (
                                <RichTextEditor
                                    value={field.value}
                                    placeholder="Enter note content"
                                    className="w-full"
                                    onChange={(value) =>
                                        field.onChange(value.text)
                                    }
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Category"
                        errorMessage={errors.category?.message}
                        invalid={Boolean(errors.category)}
                    >
                        <Controller
                            name="category"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    options={options}
                                    onChange={(option) =>
                                        field.onChange(option?.value)
                                    }
                                    value={options.find(
                                        (option) =>
                                            option.value === field.value,
                                    )}
                                    placeholder="Select Category"
                                    customInputDisplay={(selectedItem) => (
                                        <SelectInputWithPrefix
                                            label={selectedItem?.label}
                                            showPrefix={Boolean(
                                                selectedItem?.value,
                                            )}
                                            prefix={
                                                <span
                                                    className={`w-3 h-3 rounded ${selectedItem?.color}`}
                                                ></span>
                                            }
                                        />
                                    )}
                                    customOption={({
                                        option,
                                        selected,
                                        CheckIcon,
                                    }) => (
                                        <SelectOptionWithPrefix
                                            selected={selected}
                                            checkIcon={CheckIcon}
                                            label={option.label}
                                            prefix={
                                                <span
                                                    className={classNames(
                                                        'w-3 h-3 rounded',
                                                        option.color,
                                                    )}
                                                ></span>
                                            }
                                        />
                                    )}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Tags"
                        errorMessage={errors.tags?.message}
                        invalid={Boolean(errors.tags)}
                    >
                        <Controller
                            name="tags"
                            control={control}
                            render={({ field }) => (
                                <Select.Multi
                                    options={tags}
                                    onChange={(selected) =>
                                        field.onChange(selected)
                                    }
                                    value={field.value}
                                    placeholder="Select Tags"
                                />
                            )}
                        />
                    </FormItem>
                    <div className="flex justify-end mt-4">
                        <Button
                            className="ltr:mr-2 rtl:ml-2"
                            variant="subtle"
                            onClick={onClose}
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="solid"
                            loading={isSubmitting}
                            type="submit"
                        >
                            Save
                        </Button>
                    </div>
                </Form>
            </div>
        </Dialog>
    )
}

const LeadNotes = ({ leadId }: LeadNotesProps) => {
    const [newNoteDialogOpen, setNewNoteDialogOpen] = useState(false)

    const { data, isLoading, mutate } = useSWR(
        [`/api/customers/notes`, { id: leadId as string }],
        ([, params]) => apiGetNotes<Note[], { id: string }>(params),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            evalidateOnFocus: false,
        },
    )

    const handleNewNoteSubmit = async (formData: FormSchema) => {
        await sleep(1000)
        mutate(
            [
                {
                    id: Math.random().toString(36).substring(2, 15),
                    title: formData.title,
                    content: formData.content,
                    category: formData.category,
                    tags: formData.tags.map((tag) => tag.value),
                    author: 'John Doe',
                },
                ...(data as Note[]),
            ],
            false,
        )
        setNewNoteDialogOpen(false)
    }

    return (
        <>
            <Loading loading={isLoading}>
                {data && (
                    <>
                        <div className="flex items-center justify-end mb-2">
                            <Button
                                variant="subtle"
                                icon={<LiAdd />}
                                onClick={() => setNewNoteDialogOpen(true)}
                            >
                                Add Note
                            </Button>
                        </div>
                        <Card bodyClass="p-0">
                            <div>
                                {data.map((note, index) => (
                                    <NoteItem
                                        key={note.id}
                                        data={note}
                                        index={index}
                                        total={data.length}
                                    />
                                ))}
                            </div>
                        </Card>
                    </>
                )}
            </Loading>
            <NewNoteDialog
                isOpen={newNoteDialogOpen}
                onClose={() => setNewNoteDialogOpen(false)}
                onSubmit={handleNewNoteSubmit}
            />
        </>
    )
}

export default LeadNotes
