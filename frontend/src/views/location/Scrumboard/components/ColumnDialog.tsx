import { useEffect, useMemo } from 'react'
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
import {
    apiCreateTaskGroup,
    apiUpdateTaskGroup,
} from '@/services/TaskService'
import { columnColorMap } from '../utils'
import classNames from '@/utils/classNames'
import useTranslation from '@/utils/hooks/useTranslation'
import { LiGridEdit, LiAlignVertical2, LiCross } from '@/icons'
import sleep from '@/utils/sleep'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

type FormSchema = {
    name: string
    color: string
}

const makeColumnDialogSchema = (t: ReturnType<typeof useTranslation>['t']) =>
    z.object({
        name: z.string().min(1, t('tasks.columnDialog.nameRequired')),
        color: z.string().min(1, t('tasks.columnDialog.colorRequired')),
    })

const ColumnDialog = () => {
    const { t } = useTranslation()
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
        defaultValues: { name: '', color: '' },
        resolver: zodResolver(makeColumnDialogSchema(t)),
    })

    // Prefill the form with the actual column values each time the edit
    // dialog opens (the dialog stays mounted, so defaultValues alone
    // would leave the inputs empty).
    useEffect(() => {
        if (!columnDialog.open) {
            return
        }

        if (columnDialog.type === 'edit') {
            const column = columns.find(
                (column) => column.id === selectedColumn,
            )
            reset({
                name: column?.name ?? '',
                color: column?.color ?? '',
            })
        } else {
            reset({ name: '', color: '' })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnDialog.open, columnDialog.type, selectedColumn])

    const colorOptions = useMemo(() => {
        return Object.entries(columnColorMap).map(([key]) => ({
            value: key,
            label: t(`tasks.color.${key}`, key),
        }))
    }, [t])

    const handleClose = () => {
        setSelectedColumn('')
        setColumnDialog({ open: false, type: '' })
        reset()
    }

    const handleFormSubmit = async (payload: FormSchema) => {
        if (columnDialog.type === 'edit') {
            const updated = await apiUpdateTaskGroup<{ id: string }>({
                id: selectedColumn,
                ...payload,
            })

            setColumns((data) =>
                data.map((column) =>
                    column.id === selectedColumn
                        ? { ...column, ...payload, id: updated.id }
                        : column,
                ),
            )
        }

        if (columnDialog.type === 'add') {
            const created = await apiCreateTaskGroup<{ id: string }>(payload)

            const newData = {
                id: created.id,
                name: payload.name,
                color: payload.color,
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
                            <h5>{t('tasks.columnDialog.addTitle')}</h5>
                            <p className="pr-12 hidden sm:block">
                                {t('tasks.columnDialog.addSubtitle')}
                            </p>
                        </div>
                    )}
                    {columnDialog.type === 'edit' && (
                        <div>
                            <h5>{t('tasks.board.editColumn')}</h5>
                            <p className="pr-12 hidden sm:block">
                                {t('tasks.columnDialog.editSubtitle')}
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
                    <FormItem
                        label={t('tasks.columnDialog.name')}
                        invalid={Boolean(errors.name)}
                    >
                        <Controller
                            control={control}
                            name="name"
                            render={({ field }) => (
                                <Input
                                    autoComplete="off"
                                    placeholder={t('tasks.columnDialog.namePlaceholder')}
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label={t('tasks.columnDialog.color')}
                        invalid={Boolean(errors.color)}
                    >
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
                                    placeholder={t('tasks.columnDialog.colorPlaceholder')}
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
                            {t('common.cancel')}
                        </Button>
                        <Button
                            variant="solid"
                            type="submit"
                            loading={isSubmitting}
                        >
                            {t('common.save')}
                        </Button>
                    </div>
                </Form>
            </div>
        </Dialog>
    )
}

export default ColumnDialog
