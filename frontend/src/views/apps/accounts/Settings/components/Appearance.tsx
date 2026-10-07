import FormFieldWrapper from './FormFieldWrapper'
import LayoutSwitcher from '@/components/template/ThemeConfigurator/LayoutSwitcher'
import ModeSwitcher from '@/components/template/ThemeConfigurator/ModeSwitcher'
import ThemeSwitcher from '@/components/template/ThemeConfigurator/ColorSchemeSwitcher'
import DirectionSwitcher from '@/components/template/ThemeConfigurator/DirectionSwitcher'

const Appearance = () => {
    return (
        <div className="space-y-4">
            <div className="py-4">
                <div className="mb-4">
                    <h5>Appearance</h5>
                    <p>Personalize the look and feel of your interface</p>
                </div>
                <div>
                    <FormFieldWrapper
                        label="Display Mode"
                        description="Choose between light, dark, or system mode"
                    >
                        <ModeSwitcher wrapperClass="max-w-[600px] grid grid-cols-1 md:grid-cols-3" />
                    </FormFieldWrapper>

                    <FormFieldWrapper
                        label="Color Scheme"
                        description="Pick a color theme that suits your style"
                        className="md:items-center"
                    >
                        <ThemeSwitcher />
                    </FormFieldWrapper>

                    <FormFieldWrapper
                        label="Direction"
                        description="Set text direction: left-to-right or right-to-left"
                        className="md:items-center"
                    >
                        <DirectionSwitcher />
                    </FormFieldWrapper>

                    <FormFieldWrapper
                        label="Layout"
                        description="Switch between different layout structures"
                        border={false}
                    >
                        <LayoutSwitcher wrapperClass="max-w-[600px] grid grid-cols-1 md:grid-cols-3" />
                    </FormFieldWrapper>
                </div>
            </div>
        </div>
    )
}

export default Appearance
