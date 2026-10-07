import { useState, useMemo } from 'react'
import Button from '@/components/ui/Button'
import { useAiImageStore } from '../store/aiImageStore'
import {
    styleOptions,
    lightingOptions,
    cameraOptions,
} from '@/views/apps/ai/AiImage/utils'
import { apiPostImages } from '@/services/AiService'
import { LuWandSparkles, LuX } from 'react-icons/lu'
import uniqueId from 'lodash/uniqueId'
import type { PostImageResponse, ConfigsVariant } from '../type'

type SelectedConfigProps = { label: string; image: string; value: string }

const SelectedConfigTag = ({
    label,
    image,
    onRemove,
}: {
    label: string
    image: string
    onRemove: () => void
}) => {
    return (
        <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md px-2 text-xs">
            <div className="flex items-center gap-1.5">
                <img src={image} className="h-5 rounded-md" />
                <span className="font-medium text-gray-900 dark:text-gray-100">
                    {label}
                </span>
            </div>
            <button
                type="button"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 px-1.5"
                onClick={onRemove}
            >
                <LuX />
            </button>
        </div>
    )
}

const GeneratorPrompt = () => {
    const {
        resetGeneratorConfig,
        onGenerateImage,
        onGenerateImageComplete,
        setGeneratedImage,
        isGeneratingImage,
        generatorConfig,
        setGeneratorConfig,
    } = useAiImageStore()

    const [prompt, setPrompt] = useState('')

    const handleClear = () => {
        resetGeneratorConfig()
    }

    const handleGenerate = async () => {
        onGenerateImage()
        const resp = await apiPostImages<PostImageResponse, { prompt: string }>(
            { prompt },
        )
        if (resp) {
            setGeneratedImage({
                id: uniqueId('generated-image-'),
                prompt,
                gallery: resp,
            })
        }
        onGenerateImageComplete()
    }

    const handleSetGeneratorConfig = (key: ConfigsVariant, value: string) => {
        setGeneratorConfig({ key, value })
    }

    const selectedStyle = useMemo(() => {
        return (
            styleOptions.find((item) => item.value === generatorConfig.style) ||
            ({} as SelectedConfigProps)
        )
    }, [generatorConfig.style])

    const selectedLighting = useMemo(() => {
        return (
            lightingOptions.find(
                (item) => item.value === generatorConfig.lighting,
            ) || ({} as SelectedConfigProps)
        )
    }, [generatorConfig.lighting])

    const selectedCamera = useMemo(() => {
        return (
            cameraOptions.find(
                (item) => item.value === generatorConfig.camera,
            ) || ({} as SelectedConfigProps)
        )
    }, [generatorConfig.camera])

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl shadow p-3">
            <div className="flex gap-4 mb-4">
                <div className="flex-1">
                    <div className="heading-text text-base font-semibold">
                        Prompt
                    </div>
                    <textarea
                        value={prompt}
                        className="w-full resize-none mt-1 placeholder:text-gray-400 bg-transparent focus:outline-hidden heading-text"
                        placeholder="Decribe the image you want to generate"
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-6 justify-between">
                <div className="inline-flex flex-wrap gap-2">
                    <Button shape="round" size="sm" onClick={handleClear}>
                        Clear
                    </Button>
                    {generatorConfig.style !== 'noStyle' && (
                        <SelectedConfigTag
                            label={selectedStyle.label || ''}
                            image={selectedStyle.image || ''}
                            onRemove={() => {
                                handleSetGeneratorConfig('style', 'noStyle')
                            }}
                        />
                    )}
                    {generatorConfig.lighting !== 'noLighting' && (
                        <SelectedConfigTag
                            label={selectedLighting.label || ''}
                            image={selectedLighting.image || ''}
                            onRemove={() => {
                                handleSetGeneratorConfig(
                                    'lighting',
                                    'noLighting',
                                )
                            }}
                        />
                    )}
                    {generatorConfig.camera !== 'noCamera' && (
                        <SelectedConfigTag
                            label={selectedCamera.label || ''}
                            image={selectedCamera.image || ''}
                            onRemove={() => {
                                handleSetGeneratorConfig('camera', 'noCamera')
                            }}
                        />
                    )}
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-end gap-4">
                    <Button
                        variant="solid"
                        shape="round"
                        size="sm"
                        icon={<LuWandSparkles />}
                        loading={isGeneratingImage}
                        disabled={!prompt}
                        onClick={handleGenerate}
                    >
                        {isGeneratingImage ? 'Generating...' : 'Generate'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default GeneratorPrompt
