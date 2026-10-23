import { PropsWithChildren } from 'react'
import { Navigate } from 'react-router'
import { OTHERS_PREFIX_PATH } from '@/constants/route.constant'
import useAuthority from '@/utils/hooks/useAuthority'

type AuthorityGuardProps = PropsWithChildren<{
    userAuthority?: string[]
    authority?: string[]
}>

const AuthorityGuard = (props: AuthorityGuardProps) => {
    const { userAuthority = [], authority = [], children } = props

    const roleMatched = useAuthority(userAuthority, authority)

    return (
        <>
            {roleMatched ? (
                children
            ) : (
                <Navigate to={`${OTHERS_PREFIX_PATH}/access-denied`} />
            )}
        </>
    )
}

export default AuthorityGuard
