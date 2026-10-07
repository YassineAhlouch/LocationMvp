import { useMemo } from 'react'
import Dialog from '@/components/ui/Dialog'
import { Form, FormItem } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import SelectOptionWithPrefix from '@/components/shared/SelectOptionWithPrefix'
import IconFrame from '@/components/shared/IconFrame'
import useScrumboard from '../hooks/useScrumboardData'
import { useScrumboardStore } from '../store/scrumboardStore'
import { columnColorMap } from '../utils'
import classNames from '@/utils/classNames'
import { LiGridEdit, LiAlignVertical2, LiCross } from '@/icons'
import sleep from '@/utils/sleep'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

type FormSchema = {
    name: string
    color: string
}

const validationSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    color: z.string().min(1, 'Color is required'),
})

const ColumnDialog = () => {
    const { columns, setColumns } = useScrumboard()
    const columnDialog = useScrumboardStore((state) => state.columnDialog)
    const displayedColumns = useScrumboardStore(
        (state) => state.displayedColumns,
    )
    const selectedColumn = useScrumboardStore((state) => state.selectedColumn)
    const setSelectedColumn = useScrumboardStore(
        (state) => state.setSelectedColumn,
    )
    const setColumnDialog = useScrumboardStore((state) => state.setColumnDialog)
    const setDisplayedColumns = useScrumboardStore(
        (state) => state.setDisplayedColumns,
    )

    const {
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        control,
    } = useForm<FormSchema>({
        defaultValues: {
            name:
                columnDialog.type === 'edit'
                    ? columns?.find((column) => column.id === selectedColumn)
                          ?.name
                    : '',
            color:
                columnDialog.type === 'edit'
                    ? columns?.find((column) => column.id === selectedColumn)
                          ?.color
                    : '',
        },
        resolver: zodResolver(validationSchema),
    })

    const colorOptions = useMemo(() => {
        return Object.entries(columnColorMap).map(([key]) => ({
            value: key,
            label: key.replace(/\b\w/g, (char) => char.toUpperCase()),
        }))
    }, [])

    const handleClose = () => {
        setSelectedColumn('')
        setColumnDialog({ open: false, type: '' })
        reset()
    }

    const handleFormSubmit = async (payload: FormSchema) => {
        await sleep(1000)

        if (columnDialog.type === 'edit') {
            setColumns((data) =>
                data.map((column) =>
                    column.id === selectedColumn
                        ? { ...column, ...payload }
                        : column,
                ),
            )
        }

        if (columnDialog.type === 'add') {
            const newData = {
                // eslint-disable-next-line react-hooks/purity
                id: Date.now().toString(),
                name: payload.name,
                color: payload.color,
                tasks: [],
            }
            setColumns((data) => [...data, newData])
            setDisplayedColumns([...displayedColumns, newData.id])
        }

        handleClose()
    }

    return (
        <Dialog
            isOpen={columnDialog.open}
            onClose={handleClose}
            closable={false}
            className="p-0"
        >
            <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-4">
                    <IconFrame>
                        {columnDialog.type === 'add' ? (
                            <LiAlignVertical2 className="text-xl heading-text" />
                        ) : (
                            <LiGridEdit className="text-xl heading-text" />
                        )}
                    </IconFrame>
                    {columnDialog.type === 'add' && (
                        <div>
                            <h5>Add new column</h5>
                            <p className="pr-12 hidden sm:block">
                                Add a new column to the board
                            </p>
                        </div>
                    )}
                    {columnDialog.type === 'edit' && (
                        <div>
                            <h5>Edit column</h5>
                            <p className="pr-12 hidden sm:block">
                                Change the column name or color
                            </p>
                        </div>
                    )}
                </div>
                <Button
                    size="sm"
                    variant="subtle"
                    icon={<LiCross className="text-2xl" />}
                    type="button"
                    onClick={handleClose}
                />
            </div>
            <div className="p-4">
                <Form onSubmit={handleSubmit(handleFormSubmit)}>
                    <FormItem label="Name" invalid={Boolean(errors.name)}>
                        <Controller
                            control={control}
                            name="name"
                            render={({ field }) => (
                                <Input
                                    autoComplete="off"
                                    placeholder="Enter column name"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem label="Color" invalid={Boolean(errors.color)}>
                        <Controller
                            control={control}
                            name="color"
                            render={({ field }) => (
                                <Select
                                    options={colorOptions}
                                    value={colorOptions.find(
                                        (option) =>
                                            option.value === field.value,
                                    )}
                                    onChange={(option) =>
                                        field.onChange(option.value)
                                    }
                                    placeholder="Select color"
                                    customInputDisplay={(selectedItem) => (
                                        <SelectInputWithPrefix
                                            label={selectedItem?.label}
                                            prefix={
                                                selectedItem && (
                                                    <span
                                                        className={classNames(
                                                            'h-3.5 w-3.5 rounded-sm',
                                                            columnColorMap[
                                                                selectedItem
                                                                    .value
                                                            ],
                                                        )}
                                                    ></span>
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
                                            selected={selected}
                                            checkIcon={CheckIcon}
                                            label={option?.label}
                                            prefix={
                                                <span
                                                    className={classNames(
                                                        'h-3.5 w-3.5 rounded-sm',
                                                        columnColorMap[
                                                            option.value
                                                        ],
                                                    )}
                                                ></span>
                                            }
                                        />
                                    )}
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
                            type="submit"
                            loading={isSubmitting}
                        >
                            Save
                        </Button>
                    </div>
                </Form>
            </div>
        </Dialog>
    )
}

export default ColumnDialog
