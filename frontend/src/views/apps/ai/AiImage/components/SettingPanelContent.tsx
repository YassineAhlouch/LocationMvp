import classNames from '@/utils/classNames'
import Select from '@/components/ui/Select'
import Segment from '@/components/ui/Segment'
import Slider from '@/components/ui/Slider'
import Scroll from '@/components/ui/Scroll'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import { useAiImageStore } from '../store/aiImageStore'
import {
    aspectRatioOptions,
    styleOptions,
    modeOptions,
    lightingOptions,
    cameraOptions,
} from '@/views/apps/ai/AiImage/utils'
import { FaCheck } from 'react-icons/fa6'
import type { ReactNode } from 'react'
import type { ConfigsVariant } from '../type'
type SelectorProps = {
    active?: boolean
    children: ReactNode
    onClick?: () => void
}

const Section = ({
    title,
    children,
}: {
    title: string
    children: ReactNode
}) => {
    return (
        <div className="flex flex-col gap-2">
            <div className="font-semibold heading-text">{title}</div>
            <div>{children}</div>
        </div>
    )
}

const Selector = ({ active, children, onClick }: SelectorProps) => {
    return (
        <div
            className={classNames(
                'relative flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 p-0.75 ring-1 ring-transparent',
                active && 'border-primary ring-primary',
            )}
            role="button"
            onClick={onClick}
        >
            {children}
            {active && (
                <div className="absolute top-1 right-1 text-lg rounded-full bg-primary dark:bg-white h-4.5 w-4.5 p-1 flex items-center justify-center">
                    <FaCheck className="text-white" />
                </div>
            )}
        </div>
    )
}

const SettingPanelContent = () => {
    const { generatorConfig, setGeneratorConfig } = useAiImageStore()

    const handleSetGeneratorConfig = (key: ConfigsVariant, value: string) => {
        setGeneratorConfig({ key, value })
    }

    return (
        <Scroll className="h-full" scrollbars="vertical">
            <div className="flex flex-col gap-6 p-4">
                <Section title="Aspect ratio">
                    <Select
                        options={aspectRatioOptions}
                        value={aspectRatioOptions.find(
                            (item) =>
                                item.value === generatorConfig.aspectRatio,
                        )}
                        onChange={(selected) => {
                            handleSetGeneratorConfig(
                                'aspectRatio',
                                selected.value,
                            )
                        }}
                        customInputDisplay={(selectedItem) => (
                            <SelectInputWithPrefix
                                label={selectedItem?.label}
                                displayClass="ltr:pl-11 rtl:pr-11"
                                prefix={
                                    <>
                                        {selectedItem?.icon && (
                                            <span className="text-xl w-6 h-6 flex items-center">
                                                {selectedItem.icon}
                                            </span>
                                        )}
                                    </>
                                }
                            />
                        )}
                        customOption={({ option, selected, CheckIcon }) => (
                            <>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700">
                                        {option.icon}
                                    </span>
                                    <span>{option.label}</span>
                                </div>
                                {selected ? CheckIcon : null}
                            </>
                        )}
                    />
                </Section>
                <Section title="Mode">
                    <Segment
                        onChange={(value) =>
                            handleSetGeneratorConfig('mode', value)
                        }
                        value={generatorConfig.mode}
                    >
                        {modeOptions.map((item) => (
                            <Segment.Item key={item.value} value={item.value}>
                                {item.label}
                            </Segment.Item>
                        ))}
                    </Segment>
                </Section>
                <Section title="Intensity">
                    <Slider
                        value={parseInt(generatorConfig.intensity)}
                        classNames={{
                            bar: 'bg-gray-900 dark:bg-gray-200',
                            thumb: 'border-gray-900 dark:border-gray-300 dark:bg-gray-500',
                        }}
                        onChange={(value) =>
                            handleSetGeneratorConfig(
                                'intensity',
                                value.toString(),
                            )
                        }
                    />
                </Section>

                <Section title="Lighting">
                    <Select
                        options={lightingOptions}
                        value={lightingOptions.find(
                            (item) => item.value === generatorConfig.lighting,
                        )}
                        onChange={(selected) => {
                            handleSetGeneratorConfig('lighting', selected.value)
                        }}
                        customInputDisplay={(selectedItem) => (
                            <SelectInputWithPrefix
                                label={selectedItem?.label}
                                displayClass="ltr:pl-11 rtl:pr-11"
                                prefix={
                                    <>
                                        {selectedItem?.isIcon ? (
                                            <span className="text-xl w-6 h-6 flex items-center">
                                                {selectedItem.icon}
                                            </span>
                                        ) : (
                                            <img
                                                src={selectedItem?.image}
                                                className="w-6 h-6 rounded"
                                                alt={selectedItem?.label}
                                            />
                                        )}
                                    </>
                                }
                            />
                        )}
                        customOption={({ option, selected, CheckIcon }) => (
                            <>
                                <div className="flex items-center gap-2">
                                    {option.isIcon ? (
                                        <span className="text-xl w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700">
                                            {option.icon}
                                        </span>
                                    ) : (
                                        <img
                                            src={option.image}
                                            className="w-8 h-8 rounded"
                                            alt={option.label}
                                        />
                                    )}
                                    <span className="font-medium cursor-auto">
                                        {option.label}
                                    </span>
                                </div>
                                {selected ? CheckIcon : null}
                            </>
                        )}
                    />
                </Section>
                <Section title="Camera angle">
                    <Select
                        options={cameraOptions}
                        value={cameraOptions.find(
                            (item) => item.value === generatorConfig.camera,
                        )}
                        onChange={(selected) => {
                            handleSetGeneratorConfig('camera', selected.value)
                        }}
                        customInputDisplay={(selectedItem) => (
                            <SelectInputWithPrefix
                                label={selectedItem?.label}
                                displayClass="ltr:pl-11 rtl:pr-11"
                                prefix={
                                    <>
                                        {selectedItem?.isIcon ? (
                                            <span className="text-xl w-6 h-6 flex items-center">
                                                {selectedItem.icon}
                                            </span>
                                        ) : (
                                            <img
                                                src={selectedItem?.image}
                                                className="w-6 h-6 rounded"
                                                alt={selectedItem?.label}
                                            />
                                        )}
                                    </>
                                }
                            />
                        )}
                        customOption={({ option, selected, CheckIcon }) => (
                            <>
                                <div className="flex items-center gap-2">
                                    {option.isIcon ? (
                                        <span className="text-xl w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700">
                                            {option.icon}
                                        </span>
                                    ) : (
                                        <img
                                            src={option.image}
                                            className="w-8 h-8 rounded"
                                            alt={option.label}
                                        />
                                    )}
                                    <span className="font-medium cursor-auto">
                                        {option.label}
                                    </span>
                                </div>
                                {selected ? CheckIcon : null}
                            </>
                        )}
                    />
                </Section>
                <Section title="Styles">
                    <div className="grid grid-cols-4 gap-2">
                        {styleOptions.map((item) => (
                            <Selector
                                key={item.value}
                                active={generatorConfig.style === item.value}
                                onClick={() =>
                                    handleSetGeneratorConfig(
                                        'style',
                                        item.value,
                                    )
                                }
                            >
                                <img
                                    src={item.image}
                                    className="w-full h-full object-cover rounded-md"
                                    alt={item.label}
                                />
                            </Selector>
                        ))}
                    </div>
                </Section>
            </div>
        </Scroll>
    )
}

export default SettingPanelContent
