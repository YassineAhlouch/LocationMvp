import SectionCard from './SectionCard'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import Checkbox from '@/components/ui/Checkbox'
import Select from '@/components/ui/Select'
import { FormItem } from '@/components/ui/Form'
import NumericInput from '@/components/shared/NumericInput'
import SelectInputWithPrefix from '@/components/shared/SelectInputWithPrefix'
import SelectOptionWithPrefix from '@/components/shared/SelectOptionWithPrefix'
import classNames from '@/utils/classNames'
import {
    wareHouseOptions,
    stockStatusOptions,
    lengthUnitOptions,
    weightUnitOptions,
    shippingClassOptions,
} from '../utils'
import { Controller } from 'react-hook-form'
import type { FormSectionBaseProps } from '../types'

type InventorySectionProps = FormSectionBaseProps

const InventorySection = ({ control, errors }: InventorySectionProps) => {
    return (
        <div className="space-y-4">
            <SectionCard
                title="Inventory Management"
                description="Track the product stock and availability"
            >
                <div className="grid grid-cols-2 gap-4">
                    <FormItem
                        label="SKU"
                        invalid={Boolean(errors.sku)}
                        errorMessage={errors.sku?.message}
                    >
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Enter SKU"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Stock Quantity"
                        invalid={Boolean(errors.stock)}
                        errorMessage={errors.stock?.message}
                    >
                        <Controller
                            name="stock"
                            control={control}
                            render={({ field }) => (
                                <NumericInput
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Enter Stock Quantity"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormItem
                        label="Stock Status"
                        invalid={Boolean(errors.stockStatus)}
                        errorMessage={errors.stockStatus?.message}
                    >
                        <Controller
                            name="stockStatus"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    value={stockStatusOptions.find(
                                        (option) =>
                                            option.value === field.value,
                                    )}
                                    options={stockStatusOptions}
                                    onChange={(option) =>
                                        field.onChange(option?.value)
                                    }
                                    placeholder="Select Stock Status"
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
                        label="Warehouse"
                        invalid={Boolean(errors.warehouse)}
                        errorMessage={errors.warehouse?.message}
                    >
                        <Controller
                            name="warehouse"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    options={wareHouseOptions}
                                    placeholder="Select Warehouse"
                                    value={wareHouseOptions.find(
                                        (option) =>
                                            option.value === field.value,
                                    )}
                                    onChange={(option) =>
                                        field.onChange(option.value)
                                    }
                                />
                            )}
                        />
                    </FormItem>
                </div>
                <Controller
                    name="allowBackorder"
                    control={control}
                    render={({ field }) => (
                        <Checkbox {...field}>
                            <span className="heading-text">
                                Allow backorders
                            </span>
                        </Checkbox>
                    )}
                />
            </SectionCard>
            <SectionCard
                title="Shipping Information"
                description="Configure shipping details for this product"
                bordered={false}
            >
                <div className="grid grid-cols-2 gap-4">
                    <FormItem
                        label="Length"
                        invalid={Boolean(errors.weight)}
                        errorMessage={errors.weight?.message}
                    >
                        <Controller
                            name="weight"
                            control={control}
                            render={({ field }) => (
                                <NumericInput
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Enter Weight"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Weight Unit"
                        invalid={Boolean(errors.weight)}
                        errorMessage={errors.weight?.message}
                    >
                        <Controller
                            name="weightUnit"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    options={weightUnitOptions}
                                    placeholder="Select Unit"
                                    value={weightUnitOptions.find(
                                        (option) =>
                                            option.value === field.value,
                                    )}
                                    onChange={(option) =>
                                        field.onChange(option.value)
                                    }
                                />
                            )}
                        />
                    </FormItem>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormItem
                        label="Height"
                        invalid={Boolean(errors.height)}
                        errorMessage={errors.height?.message}
                    >
                        <Controller
                            name="height"
                            control={control}
                            render={({ field }) => (
                                <NumericInput
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Enter Height"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Height Unit"
                        invalid={Boolean(errors.height)}
                        errorMessage={errors.height?.message}
                    >
                        <Controller
                            name="dimensionUnit"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    options={lengthUnitOptions}
                                    placeholder="Select Unit"
                                    value={lengthUnitOptions.find(
                                        (option) =>
                                            option.value === field.value,
                                    )}
                                    onChange={(option) =>
                                        field.onChange(option.value)
                                    }
                                />
                            )}
                        />
                    </FormItem>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormItem
                        label="Length"
                        invalid={Boolean(errors.length)}
                        errorMessage={errors.length?.message}
                    >
                        <Controller
                            name="length"
                            control={control}
                            render={({ field }) => (
                                <NumericInput
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Enter Length"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Length Unit"
                        invalid={Boolean(errors.height)}
                        errorMessage={errors.height?.message}
                    >
                        <Controller
                            name="dimensionUnit"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    options={lengthUnitOptions}
                                    placeholder="Select Unit"
                                    value={lengthUnitOptions.find(
                                        (option) =>
                                            option.value === field.value,
                                    )}
                                    onChange={(option) =>
                                        field.onChange(option.value)
                                    }
                                />
                            )}
                        />
                    </FormItem>
                </div>
                <FormItem
                    label="Shipping Class"
                    invalid={Boolean(errors.shippingClass)}
                    errorMessage={errors.shippingClass?.message}
                >
                    <Controller
                        name="shippingClass"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={shippingClassOptions}
                                placeholder="Select Shipping Class"
                                value={shippingClassOptions.find(
                                    (option) => option.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option.value)
                                }
                            />
                        )}
                    />
                </FormItem>
                <Controller
                    name="freeShipping"
                    control={control}
                    render={({ field }) => (
                        <Checkbox {...field}>
                            <span className="heading-text">
                                Free Shipping Eligible
                            </span>
                        </Checkbox>
                    )}
                />
            </SectionCard>
        </div>
    )
}

export default InventorySection
