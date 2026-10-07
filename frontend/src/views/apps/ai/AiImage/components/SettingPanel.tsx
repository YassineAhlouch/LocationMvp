import SettingPanelContent from './SettingPanelContent'
const SettingPanel = () => {
    return (
        <div className="relative flex-1 lg:max-w-[320px] ltr:border-r rtl:border-l border-gray-200 dark:border-gray-800">
            <div className="h-full absolute w-full">
                <SettingPanelContent />
            </div>
        </div>
    )
}

export default SettingPanel
