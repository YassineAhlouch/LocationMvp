import { useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Table from '@/components/ui/Table'
import MultiValueInput from '@/components/ui/MultiValueInput'
import { Form, FormItem } from '@/components/ui/Form'
import SegmentProgressBar from '@/components/shared/SegmentProgressBar'
import RichTextEditor from '@/components/shared/RichTextEditor'
import StatisticCard from '@/components/shared/StatisticCard'
import IconFrame from '@/components/shared/IconFrame'
import { LiDollarCircle, LiShoppingCart, LiStar, LiAdd, LiEdit2 } from '@/icons'
import formatCurrency from '@/utils/formatCurrency'
import classNames from '@/utils/classNames'
import sleep from '@/utils/sleep'
import dayjs from 'dayjs'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { KeyedMutator } from 'swr'
import type { Customer, Note } from '../types'

type CustomerOverviewProps = {
    data: Customer
    mutate: KeyedMutator<Customer>
}

type NoteFormSchema = {
    title: string
    category: string
    content: string
    tags: string[]
}

const validationSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    category: z.string().min(1, 'Category is required'),
    content: z.string().min(1, 'Content is required'),
    tags: z.array(z.string()),
})

const { Tr, Th, Td, THead, TBody } = Table

const categoryColor: Record<string, string> = {
    'Product Feedback': 'bg-[#f24195]',
    Requirements: 'bg-[#ff712c]',
    Financial: 'bg-[#7f37c3]',
}

const categoryOptions = [
    { value: 'Product Feedback', label: 'Product Feedback' },
    { value: 'Requirements', label: 'Requirements' },
    { value: 'Financial', label: 'Financial' },
]

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
                <h5 className="mb-4">Edit Note</h5>
                <RichTextEditor
                    content={content}
                    onChange={({ text }) => setContent(text)}
                />
                <div className="flex justify-end mt-4 gap-2">
                    <Button
                        variant="default"
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

const CustomerOverview = ({ data, mutate }: CustomerOverviewProps) => {
    const [isAddNoteOpen, setIsAddNoteOpen] = useState(false)

    const {
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        control,
    } = useForm<NoteFormSchema>({
        defaultValues: {
            title: '',
            category: '',
            content: '',
            tags: [],
        },
        resolver: zodResolver(validationSchema),
    })

    const getEngagementScoreColor = (score: number) => {
        if (score >= 80) return 'bg-success'
        if (score >= 50) return 'bg-warning'
        if (score >= 0) return 'bg-error'
        return ''
    }

    const handleClose = () => {
        setIsAddNoteOpen(false)
        reset()
    }

    const handleFormSubmit = async (values: NoteFormSchema) => {
        await sleep(500)

        const newNote: Note = {
            id: crypto.randomUUID(),
            title: values.title,
            category: values.category,
            content: values.content,
            author: 'Current User',
            tags: values.tags,
        }

        mutate(
            {
                ...data,
                notes: [newNote, ...data.notes],
            },
            false,
        )

        handleClose()
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatisticCard>
                    <div className="flex items-center gap-2 mb-4">
                        <IconFrame size={32}>
                            <LiDollarCircle className="text-lg heading-text" />
                        </IconFrame>
                        <span className="font-medium">Total Spending</span>
                    </div>
                    <h4 className="font-semibold">
                        {formatCurrency(data.totalSpending, 'USD')}
                    </h4>
                </StatisticCard>
                <StatisticCard>
                    <div className="flex items-center gap-2 mb-4">
                        <IconFrame size={32}>
                            <LiShoppingCart className="text-lg heading-text" />
                        </IconFrame>
                        <span className="font-medium">Purchases</span>
                    </div>
                    <h4 className="font-semibold">{data.purchases.length}</h4>
                </StatisticCard>
                <StatisticCard>
                    <div className="flex items-center gap-2 mb-4">
                        <IconFrame size={32}>
                            <LiStar className="text-lg heading-text" />
                        </IconFrame>
                        <span className="font-medium">Engagement Score</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <h4 className="font-semibold">
                            {data.engagementScore}%
                        </h4>
                        <SegmentProgressBar
                            gap={2}
                            segments={30}
                            percent={data.engagementScore}
                            filledClass={getEngagementScoreColor(
                                data.engagementScore,
                            )}
                        />
                    </div>
                </StatisticCard>
            </div>
            <Card bodyClass="p-0">
                <div className="flex justify-between items-center p-4">
                    <h5 className="font-semibold">Purchase History</h5>
                </div>
                <Table className="border-t border-gray-200 dark:border-gray-700">
                    <THead>
                        <Tr>
                            <Th>Order ID</Th>
                            <Th>Date</Th>
                            <Th>Product</Th>
                            <Th>Qty</Th>
                            <Th>Amount</Th>
                            <Th>Payment</Th>
                        </Tr>
                    </THead>
                    <TBody className="heading-text">
                        {data.purchases.map((purchase) => (
                            <Tr key={purchase.id}>
                                <Td>
                                    <span className="heading-text font-medium">
                                        {purchase.id}
                                    </span>
                                </Td>
                                <Td>
                                    <span>
                                        {dayjs(purchase.date).format(
                                            'MMM DD, YYYY',
                                        )}
                                    </span>
                                </Td>
                                <Td>{purchase.product}</Td>
                                <Td>{purchase.quantity}</Td>
                                <Td>
                                    {formatCurrency(purchase.amount, 'USD')}
                                </Td>
                                <Td>{purchase.paymentMethod}</Td>
                            </Tr>
                        ))}
                    </TBody>
                </Table>
            </Card>
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h5 className="font-semibold">Notes</h5>
                    <Button
                        variant="subtle"
                        icon={<LiAdd />}
                        onClick={() => setIsAddNoteOpen(true)}
                    >
                        Add Note
                    </Button>
                </div>
                <Card bodyClass="p-0">
                    <div>
                        {data.notes.map((note, index) => (
                            <NoteItem
                                key={note.id}
                                data={note}
                                index={index}
                                total={data.notes.length}
                            />
                        ))}
                    </div>
                </Card>
            </div>

            <Dialog isOpen={isAddNoteOpen} onClose={handleClose}>
                <h5 className="mb-4">Add Note</h5>
                <Form onSubmit={handleSubmit(handleFormSubmit)}>
                    <FormItem
                        label="Title"
                        invalid={Boolean(errors.title)}
                        errorMessage={errors.title?.message}
                    >
                        <Controller
                            name="title"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    placeholder="Enter note title"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
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
                                    placeholder="Select category"
                                    options={categoryOptions}
                                    value={categoryOptions.find(
                                        (opt) => opt.value === field.value,
                                    )}
                                    onChange={(opt) =>
                                        field.onChange(opt?.value || '')
                                    }
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Content"
                        invalid={Boolean(errors.content)}
                        errorMessage={errors.content?.message}
                    >
                        <Controller
                            name="content"
                            control={control}
                            render={({ field }) => (
                                <RichTextEditor
                                    content={field.value}
                                    onChange={({ text }) =>
                                        field.onChange(text)
                                    }
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Tags"
                        invalid={Boolean(errors.tags)}
                        errorMessage={errors.tags?.message}
                    >
                        <Controller
                            name="tags"
                            control={control}
                            render={({ field }) => (
                                <MultiValueInput
                                    placeholder="Type and press Enter to add tags"
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </FormItem>
                    <div className="flex justify-end gap-2">
                        <Button type="button" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            variant="solid"
                            loading={isSubmitting}
                            type="submit"
                        >
                            Add Note
                        </Button>
                    </div>
                </Form>
            </Dialog>
        </div>
    )
}

export default CustomerOverview
