import type { Framework } from '../types'

const DEMO_LINK_REACT = 'https://eyris-react.themenate.net'
const DEMO_LINK_NEXT = 'https://eyris-next.themenate.net'

const useDemoUrl = (framework: Framework) => {
    if (framework === 'vite') {
        return DEMO_LINK_REACT
    }
    return DEMO_LINK_NEXT
}

export default useDemoUrl
