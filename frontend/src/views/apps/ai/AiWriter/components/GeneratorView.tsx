import { useState } from 'react'
import Button from '@/components/ui/Button'
import Scroll from '@/components/ui/Scroll'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { FormItem, Form } from '@/components/ui/Form'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import SelectOptionWithPrefix from '@/components/shared/SelectOptionWithPrefix'
import { useAiWriterStore } from '../store/aiWriterStore'
import { apiPostWriter } from '@/services/AiService'
import classNames from '@/utils/classNames'
import { LuSparkles, LuWandSparkles } from 'react-icons/lu'
import uniqueId from 'lodash/uniqueId'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Editor } from '@tiptap/react'

type GeneratorViewProps = {
    editor: Editor
}

const languageOptions = [
    { value: 'English', label: 'English', flag: 'UK' },
    { value: 'Spanish', label: 'Spanish', flag: 'ES' },
    { value: 'French', label: 'French', flag: 'FR' },
    { value: 'German', label: 'German', flag: 'DE' },
    { value: 'Italian', label: 'Italian', flag: 'IT' },
    { value: 'Portuguese', label: 'Portuguese', flag: 'PT' },
    { value: 'Chinese', label: 'Chinese', flag: 'CN' },
    { value: 'Japanese', label: 'Japanese', flag: 'JP' },
    { value: 'Korean', label: 'Korean', flag: 'KR' },
]

const articleTypeOptions = [
    { value: 'article', label: 'Article' },
    { value: 'blog', label: 'Blog' },
    { value: 'essay', label: 'Essay' },
    { value: 'journal', label: 'Journal' },
    { value: 'letter', label: 'Letter' },
    { value: 'news', label: 'News' },
    { value: 'poem', label: 'Poem' },
    { value: 'speech', label: 'Speech' },
    { value: 'story', label: 'Story' },
]

const toneOptions = [
    { value: 'noTone', label: 'No tone' },
    { value: 'blackAndWhite', label: 'Black & White' },
    { value: 'coolTone', label: 'Cool Tone' },
    { value: 'golden', label: 'Golden' },
    { value: 'mutedColor', label: 'Muted Color' },
    { value: 'pastel', label: 'Pastel' },
    { value: 'warmTone', label: 'Warm Tone' },
]

type FormSchema = {
    topic: string
    language: string
    keyword?: string
    articleType: string
    tone: string
}

const validationSchema = z.object({
    topic: z.string().min(1, { message: 'Topic is required' }),
    language: z.string().min(1, { message: 'Language is required' }),
    articleType: z.string().min(1, { message: 'Article type is required' }),
    tone: z.string().min(1, { message: 'Tone is required' }),
})

const GeneratorView = ({ editor }: GeneratorViewProps) => {
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean
        payload: FormSchema | null
    }>({
        open: false,
        payload: null,
    })

    const generated = useAiWriterStore((state) => state.generated)
    const setView = useAiWriterStore((state) => state.setView)
    const setContent = useAiWriterStore((state) => state.setContent)
    const setGenerating = useAiWriterStore((state) => state.setGenerating)
    const setGenerated = useAiWriterStore((state) => state.setGenerated)
    const promptResultList = useAiWriterStore((state) => state.promptResultList)
    const setPromptResultList = useAiWriterStore(
        (state) => state.setPromptResultList,
    )

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<FormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            topic: '',
            language: 'English',
            keyword: '',
            articleType: 'article',
            tone: 'noTone',
        },
    })

    const handleProceedGenerate = async (values: FormSchema) => {
        setContent('')
        setGenerating(true)

        const resp = await apiPostWriter<
            {
                content: string
            },
            FormSchema
        >(values)

        if (resp) {
            setContent(resp.content)
        }
        setGenerated(true)
        setGenerating(false)
        setPromptResultList([
            ...(promptResultList || []),
            {
                id: uniqueId('generated-article'),
                content: values.topic,
                prompt: 'Generate an article',
                showButton: false,
                selectedText: '',
                type: 'generate',
            },
        ])
        setView('assistant')
    }

    const handlePickForMe = () => {
        setValue(
            'topic',
            'How Different Countries are Addressing Income Inequality',
        )
    }

    const onSubmit = async (values: FormSchema) => {
        if (!editor.isEmpty) {
            setConfirmDialog({
                open: true,
                payload: values,
            })
            return
        }

        await handleProceedGenerate(values)
    }

    const handleConfirmDialogClose = () => {
        setConfirmDialog({
            open: false,
            payload: null,
        })
    }

    const handleConfirmDialogConfirm = () => {
        handleProceedGenerate(confirmDialog.payload!)
        setConfirmDialog({
            open: false,
            payload: null,
        })
    }

    return (
        <>
            <div className="h-[60px] flex items-center justify-between px-4">
                <h5>{generated ? 'New article' : 'Quick start'}</h5>
                {generated && (
                    <div className="flex items-center gap-1">
                        <Button
                            size="sm"
                            className={({ active, unclickable }) =>
                                classNames(
                                    'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500  border-0 hover:ring-0 p-0.5',
                                    active
                                        ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600'
                                        : '',
                                    unclickable &&
                                        'opacity-50 cursor-not-allowed',
                                    !active &&
                                        !unclickable &&
                                        'hover:bg-gradient-to-r hover:from-pink-400 hover:via-purple-400 hover:to-blue-400',
                                )
                            }
                            onClick={() => setView('assistant')}
                        >
                            <span className="relative px-5 h-full w-full flex items-center transition-all bg-white dark:bg-gray-900 rounded text-gray-900 dark:text-gray-100 gap-1">
                                <LuSparkles className="text-base text-pink-500" />
                                <span className="text-sm font-semibold  bg-gradient-to-r from-pink-500 via-purple-500 to-blue-600 text-transparent bg-clip-text flex">
                                    Ask Ai
                                </span>
                            </span>
                        </Button>
                    </div>
                )}
            </div>
            <ConfirmDialog
                isOpen={confirmDialog.open}
                type="danger"
                title="Generate new content?"
                onClose={handleConfirmDialogClose}
                onCancel={handleConfirmDialogClose}
                onConfirm={handleConfirmDialogConfirm}
            >
                <p>
                    {' '}
                    Are you sure you want to override current content? This
                    action can&apos;t be undo.{' '}
                </p>
            </ConfirmDialog>
            <Scroll
                className="h-full"
                contentClassName="h-full"
                scrollbars="vertical"
            >
                <div className="flex flex-col h-full px-4 pt-4">
                    <Form id="generator-form" onSubmit={handleSubmit(onSubmit)}>
                        <FormItem
                            label="Topic"
                            invalid={Boolean(errors.topic)}
                            errorMessage={errors.topic?.message}
                        >
                            <Controller
                                name="topic"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder="Enter your article topic here"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="Language"
                            invalid={Boolean(errors.language)}
                            errorMessage={errors.language?.message}
                        >
                            <Controller
                                name="language"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={languageOptions}
                                        customInputDisplay={(selectedItem) => (
                                            <SelectInputWithPrefix
                                                label={selectedItem?.label}
                                                prefix={
                                                    selectedItem && (
                                                        <img
                                                            src={`/img/countries/${selectedItem?.flag}.png`}
                                                            className="w-4 h-4"
                                                            alt={
                                                                selectedItem?.label
                                                            }
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
                                                selected={selected}
                                                checkIcon={CheckIcon}
                                                label={option?.label}
                                                prefix={
                                                    <img
                                                        src={`/img/countries/${option?.flag}.png`}
                                                        className="w-4 h-4"
                                                        alt={option?.label}
                                                    />
                                                }
                                            />
                                        )}
                                        onChange={(selectedItem) =>
                                            field.onChange(selectedItem?.value)
                                        }
                                        value={languageOptions.find(
                                            (item) =>
                                                item.value === field.value,
                                        )}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label={
                                <span>
                                    Keyword{' '}
                                    <span className="font-normal">
                                        (optional)
                                    </span>
                                </span>
                            }
                            invalid={Boolean(errors.keyword)}
                            errorMessage={errors.keyword?.message}
                        >
                            <Controller
                                name="keyword"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        placeholder="Enter your keyword here..."
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="Article Type"
                            invalid={Boolean(errors.articleType)}
                            errorMessage={errors.articleType?.message}
                        >
                            <Controller
                                name="articleType"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={articleTypeOptions}
                                        value={articleTypeOptions.find(
                                            (option) =>
                                                option.value === field.value,
                                        )}
                                        onChange={(selectedItem) =>
                                            field.onChange(selectedItem?.value)
                                        }
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem label="Tone">
                            <Controller
                                name="tone"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={toneOptions}
                                        {...field}
                                        value={toneOptions.find(
                                            (option) =>
                                                option.value === field.value,
                                        )}
                                    />
                                )}
                            />
                        </FormItem>
                    </Form>
                </div>
            </Scroll>
            <div className="flex justify-end gap-2 p-2">
                <Button icon={<LuWandSparkles />} onClick={handlePickForMe}>
                    Pick for me
                </Button>
                <Button
                    variant="solid"
                    type="submit"
                    form="generator-form"
                    loading={isSubmitting}
                >
                    Generate
                </Button>
            </div>
        </>
    )
}

export default GeneratorView
