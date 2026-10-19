import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import { LiTick } from '@/icons'
import { changeLanguage, supportedLanguages } from '@/locales'

const LanguageSelector = ({ className }: { className?: string }) => {
    const { i18n } = useTranslation()
    const locale = i18n.resolvedLanguage ?? i18n.language

    const selectedFlag = useMemo(
        () =>
            supportedLanguages.find((lang) => lang.value === locale)?.flag ??
            'US',
        [locale],
    )

    const selectedLanguage = (
        <div className={classNames(className, 'flex items-center')}>
            <Avatar
                size={24}
                shape="circle"
                src={`/img/countries/${selectedFlag}.png`}
            />
        </div>
    )

    return (
        <Dropdown renderTitle={selectedLanguage} placement="bottom-end">
            {supportedLanguages.map((lang) => (
                <Dropdown.Item
                    key={lang.value}
                    className="justify-between"
                    eventKey={lang.value}
                    onClick={() => changeLanguage(lang.value)}
                >
                    <span className="flex items-center">
                        <Avatar
                            size={18}
                            shape="circle"
                            src={`/img/countries/${lang.flag}.png`}
                        />
                        <span className="ltr:ml-2 rtl:mr-2">{lang.label}</span>
                    </span>
                    {locale === lang.value && (
                        <LiTick className="text-primary text-lg" />
                    )}
                </Dropdown.Item>
            ))}
        </Dropdown>
    )
}

export default LanguageSelector
