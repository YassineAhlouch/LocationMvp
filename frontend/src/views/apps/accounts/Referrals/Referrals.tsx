import Card from '@/components/ui/Card'
import Container from '@/components/shared/Container'
import ReferralContext from './components/ReferralContext'
import ReferralHeader from './components/ReferralHeader'
import ReferralProcess from './components/ReferralProcess'
import ReferralTools from './components/ReferralTools'
import InviteFriends from './components/InviteFriends'
import ReferralStats from './components/ReferralStats'
import ReferralHistory from './components/ReferralHistory'

const Referrals = () => {
    return (
        <ReferralContext>
            <Container size="md">
                <div className="space-y-8">
                    <ReferralHeader />
                    <ReferralProcess />
                    <Card bodyClass="py-6 px-0">
                        <div className="grid grid-cols-1 lg:grid-cols-2 lg:divide-x divide-y lg:divide-y-0 divide-gray-200 dark:divide-gray-800">
                            <div className="pb-6 lg:pb-0">
                                <ReferralTools />
                            </div>
                            <div className="pt-6 lg:pt-0">
                                <InviteFriends />
                            </div>
                        </div>
                    </Card>
                    <ReferralStats />
                    <ReferralHistory />
                </div>
            </Container>
        </ReferralContext>
    )
}

export default Referrals
