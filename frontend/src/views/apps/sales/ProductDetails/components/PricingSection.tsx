import { useEffect, useMemo } from 'react'
import SectionCard from './SectionCard'
import Input from '@/components/ui/Input'
import InputGroup from '@/components/ui/InputGroup/InputGroup'
import Button from '@/components/ui/Button'
import MultiValueInput from '@/components/ui/MultiValueInput'
import { FormItem } from '@/components/ui/Form'
import NumericInput from '@/components/shared/NumericInput'
import EmptyState from '@/components/shared/EmptyState'
import IconFrame from '@/components/shared/IconFrame'
import { LiShapes, LiAdd, LiTrash } from '@/icons'
import { Controller, useFieldArray } from 'react-hook-form'
import type {
    FormSectionBaseProps,
    Variant,
    VariantCombination,
} from '../types'
import Divider from '@/components/shared/Divider'

type PricingSectionProps = FormSectionBaseProps

const VariantSection = ({ control, watch }: FormSectionBaseProps) => {
    const {
        fields: optionFields,
        append: appendOption,
        remove: removeOption,
    } = useFieldArray({
        control,
        name: 'variantOptions',
    })

    const { fields: combinationFields, replace: replaceCombinations } =
        useFieldArray({
            control,
            name: 'variantCombinations',
        })

    const watchedOptions = watch('variantOptions') as Variant[]

    const generateCombinations = (options: Variant[]): string[] => {
        const validOptions = options.filter(
            (option) =>
                option.attribute.trim() &&
                option.values.length > 0 &&
                option.values.some((value) => value.trim()),
        )

        if (validOptions.length === 0) return []

        const cartesianProduct = (arrays: string[][]): string[][] => {
            return arrays.reduce(
                (acc, curr) => {
                    const result: string[][] = []
                    acc.forEach((a) => {
                        curr.forEach((c) => {
                            result.push([...a, c])
                        })
                    })
                    return result
                },
                [[]] as string[][],
            )
        }

        const valueArrays = validOptions.map((option) =>
            option.values.filter((value) => value.trim()),
        )

        return cartesianProduct(valueArrays).map((combination) =>
            combination.join(' / '),
        )
    }

    const combinations = useMemo(() => {
        return generateCombinations(watchedOptions)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(watchedOptions)])

    useEffect(() => {
        const currentCombinations = watch(
            'variantCombinations',
        ) as VariantCombination[]

        if (combinations.length === 0) {
            return
        }

        const newCombinations: VariantCombination[] = combinations.map(
            (combo) => {
                const existing = currentCombinations.find(
                    (c) => c.combination === combo,
                )
                return (
                    existing || {
                        combination: combo,
                        price: 0,
                        stock: 0,
                        sku: '',
                    }
                )
            },
        )

        const currentCombinationNames = currentCombinations
            .map((c) => c.combination)
            .sort()
        const newCombinationNames = combinations.sort()

        if (
            JSON.stringify(currentCombinationNames) !==
            JSON.stringify(newCombinationNames)
        ) {
            replaceCombinations(newCombinations)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [combinations, replaceCombinations])

    const addVariantOption = () => {
        appendOption({ attribute: '', values: [] })
    }

    const removeVariantOption = (index: number) => {
        if (optionFields.length > 1) {
            removeOption(index)
        }
    }

    return (
        <SectionCard
            title="Product Variants"
            description="Manage different variations of your product"
            bordered={false}
            extra={
                <Button
                    variant="subtle"
                    icon={<LiAdd />}
                    type="button"
                    onClick={addVariantOption}
                >
                    Add variant
                </Button>
            }
        >
            <div>
                <span className="form-label mb-2">Variant Name</span>
                <div className="space-y-4">
                    {optionFields.map((field, optionIndex) => (
                        <div key={field.id} className="flex items-center gap-2">
                            <InputGroup className="flex-1">
                                <Controller
                                    name={`variantOptions.${optionIndex}.attribute`}
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="Attribute"
                                            className="w-[80px] sm:w-[200px]"
                                        />
                                    )}
                                />
                                <Controller
                                    name={`variantOptions.${optionIndex}.values`}
                                    control={control}
                                    render={({ field }) => (
                                        <MultiValueInput
                                            value={field.value}
                                            onChange={(value) => {
                                                field.onChange(value)
                                            }}
                                            placeholder="Enter attribute values and press enter"
                                            className="w-full"
                                        />
                                    )}
                                />
                            </InputGroup>
                            <div>
                                <Button
                                    type="button"
                                    onClick={() =>
                                        removeVariantOption(optionIndex)
                                    }
                                    icon={<LiTrash className="text-sm" />}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {combinations.length > 0 ? (
                <>
                    <Divider className="my-4" />
                    <div>
                        <table className="w-full">
                            <thead className="bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <tr>
                                    <th className="py-2 px-4 ltr:text-left rtl:text-right font-medium heading-text ltr:rounded-l-lg rtl:rounded-r-lg">
                                        Variants
                                    </th>
                                    <th className="py-2 px-4 ltr:text-left rtl:text-right font-medium heading-text">
                                        Price
                                    </th>
                                    <th className="py-2 px-4 ltr:text-left rtl:text-right font-medium heading-text">
                                        Stock
                                    </th>
                                    <th className="py-2 px-4 ltr:text-left rtl:text-right font-medium heading-text ltr:rounded-r-lg rtl:rounded-l-lg">
                                        SKU
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {combinationFields.map((field, index) => (
                                    <tr key={field.id}>
                                        <td className="px-4 py-2">
                                            <span className="font-medium heading-text">
                                                {field.combination}
                                            </span>
                                        </td>
                                        <td className="p-2">
                                            <Controller
                                                name={`variantCombinations.${index}.price`}
                                                control={control}
                                                render={({ field }) => (
                                                    <NumericInput
                                                        thousandSeparator
                                                        inputPrefix={
                                                            <span className="heading-text">
                                                                $
                                                            </span>
                                                        }
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </td>
                                        <td className="p-2">
                                            <Controller
                                                name={`variantCombinations.${index}.stock`}
                                                control={control}
                                                render={({ field }) => (
                                                    <NumericInput
                                                        {...field}
                                                        placeholder="Enter Stock"
                                                    />
                                                )}
                                            />
                                        </td>
                                        <td className="p-2">
                                            <Controller
                                                name={`variantCombinations.${index}.sku`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        placeholder="Enter SKU"
                                                    />
                                                )}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center mt-8">
                    <EmptyState
                        size={230}
                        variant="grid"
                        offset={-20}
                        illustration={
                            <IconFrame variant="thick">
                                <LiShapes className="text-xl heading-text" />
                            </IconFrame>
                        }
                    >
                        <div className="text-center space-y-2">
                            <h5>No Variants Added</h5>
                            <p className="max-w-[400px]">
                                Create a variant attribute & values to generate
                                combinations
                            </p>
                        </div>
                    </EmptyState>
                </div>
            )}
        </SectionCard>
    )
}

const PricingSection = ({
    control,
    errors,
    watch,
    setValue,
}: PricingSectionProps) => {
    return (
        <div className="space-y-4">
            <SectionCard
                title="Pricing Information"
                description="Set your product pricing and tax information"
            >
                <div>
                    <FormItem
                        label="Price"
                        invalid={Boolean(errors.price)}
                        errorMessage={errors.price?.message}
                    >
                        <Controller
                            name="price"
                            control={control}
                            render={({ field }) => (
                                <NumericInput
                                    thousandSeparator
                                    type="text"
                                    inputPrefix={<span>$</span>}
                                    autoComplete="off"
                                    placeholder="0.00"
                                    value={field.value}
                                    onValueChange={({ floatValue }) =>
                                        field.onChange(floatValue)
                                    }
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Cost price"
                        invalid={Boolean(errors.costPerItem)}
                        errorMessage={errors.costPerItem?.message}
                    >
                        <Controller
                            name="costPerItem"
                            control={control}
                            render={({ field }) => (
                                <NumericInput
                                    thousandSeparator
                                    type="text"
                                    inputPrefix={<span>$</span>}
                                    autoComplete="off"
                                    placeholder="0.00"
                                    value={field.value}
                                    onValueChange={({ floatValue }) =>
                                        field.onChange(floatValue)
                                    }
                                />
                            )}
                        />
                    </FormItem>
                </div>
                <div className="md:flex gap-4">
                    <FormItem
                        label="Bulk discount price"
                        invalid={Boolean(errors.bulkDiscountPrice)}
                        errorMessage={errors.bulkDiscountPrice?.message}
                        className="w-full"
                    >
                        <Controller
                            name="bulkDiscountPrice"
                            control={control}
                            render={({ field }) => (
                                <NumericInput
                                    thousandSeparator
                                    type="text"
                                    inputPrefix={<span>$</span>}
                                    autoComplete="off"
                                    placeholder="0.00"
                                    value={field.value}
                                    onValueChange={({ floatValue }) =>
                                        field.onChange(floatValue)
                                    }
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Tax rate(%)"
                        invalid={Boolean(errors.taxRate)}
                        errorMessage={errors.taxRate?.message}
                        className="w-full"
                    >
                        <Controller
                            name="taxRate"
                            control={control}
                            render={({ field }) => (
                                <NumericInput
                                    type="text"
                                    autoComplete="off"
                                    placeholder="0"
                                    value={field.value}
                                    isAllowed={(values) => {
                                        const { floatValue } = values
                                        return (floatValue || 0) <= 100
                                    }}
                                    onValueChange={({ floatValue }) => {
                                        field.onChange(floatValue)
                                    }}
                                />
                            )}
                        />
                    </FormItem>
                </div>
            </SectionCard>
            <VariantSection
                control={control}
                errors={errors}
                watch={watch}
                setValue={setValue}
            />
        </div>
    )
}

export default PricingSection
