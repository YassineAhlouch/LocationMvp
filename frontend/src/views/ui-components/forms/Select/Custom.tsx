import Select from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'

const countryOptions = [
    { value: 'us', label: 'United State', imgPath: '/img/countries/US.png' },
    { value: 'cn', label: 'China', imgPath: '/img/countries/CN.png' },
    { value: 'jp', label: 'Japan', imgPath: '/img/countries/JP.png' },
    { value: 'fr', label: 'French', imgPath: '/img/countries/FR.png' },
]

const Custom = () => {
    return (
        <div>
            <Select
                options={countryOptions}
                defaultValue={countryOptions[0]}
                className="mb-4"
                placeholder="Please select"
                customInputDisplay={(selectedItem) => (
                    <div className="flex items-center flex-1 gap-2 h-full relative">
                        <span className="h-full flex items-center z-0">
                            <Avatar
                                shape="circle"
                                size={18}
                                src={selectedItem?.imgPath}
                            />
                        </span>
                        {selectedItem?.label}
                    </div>
                )}
                customOption={({ option, selected, CheckIcon }) => (
                    <>
                        <div className="flex items-center gap-2">
                            <Avatar
                                shape="circle"
                                size={18}
                                src={option.imgPath}
                            />
                            {option.label}
                        </div>
                        {selected ? CheckIcon : null}
                    </>
                )}
            />
            <Select.Multi
                options={countryOptions}
                defaultValue={[countryOptions[1], countryOptions[2]]}
                placeholder="Please select"
                customLabel={(item) => (
                    <div className="flex items-center gap-2">
                        <Avatar shape="circle" size={12} src={item.imgPath} />
                        <span>{item.label}</span>
                    </div>
                )}
            />
        </div>
    )
}

export default Custom
