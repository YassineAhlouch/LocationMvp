import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import InputGroup from '@/components/ui/InputGroup'
import { LiExport, LiPapers } from '@/icons'
import { useReferralData } from '../hooks/useReferralData'

const ReferralTools = () => {
    const { data, copyToClipboard } = useReferralData()
    const [copyingLink, setCopyingLink] = useState(false)

    const handleCopyLink = async () => {
        if (!data?.referralLink) return

        setCopyingLink(true)
        try {
            await copyToClipboard(data.referralLink, 'link')
        } finally {
            setCopyingLink(false)
        }
    }

    return (
        <div className="space-y-6 px-4">
            <div>
                <h5 className="flex items-center gap-2 mb-1">
                    <LiExport />
                    Referral Link & Code
                </h5>
                <p>Easily copyable with a "Copy" button for online sharing.</p>
            </div>
            <div>
                <InputGroup>
                    <Input
                        value={data?.referralLink || ''}
                        readOnly
                        className="flex-1"
                        placeholder="Loading referral link..."
                    />
                    <Button
                        variant="default"
                        size="md"
                        icon={<LiPapers />}
                        onClick={handleCopyLink}
                        loading={copyingLink}
                        disabled={!data?.referralLink}
                        clickFeedback={false}
                    >
                        Copy
                    </Button>
                </InputGroup>
            </div>
        </div>
    )
}

export default ReferralTools
