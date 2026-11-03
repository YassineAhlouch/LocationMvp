import { useMemo } from 'react'
import FleetPage from './pages/FleetPage'
import BuilderPage from './pages/BuilderPage'
import WhatsAppButton from './components/WhatsAppButton'

type View = { kind: 'fleet' } | { kind: 'builder' }

/**
 * Routes served by this standalone page:
 *  /r/{slug}      → fleet view for a saved poster
 *  /r?cars={...}  → fleet view for an ad-hoc slug selection
 *  /  (or an unknown path, normalized back to /) → QR link builder
 */
function resolveView(): View {
    const { pathname, search } = window.location

    if (pathname.startsWith('/r/')) {
        return { kind: 'fleet' }
    }

    if (pathname === '/r' || pathname === '/') {
        const cars = (new URLSearchParams(search).get('cars') ?? '')
            .split(',')
            .map((value) => value.trim())
            .filter(Boolean)

        return { kind: cars.length > 0 ? 'fleet' : 'builder' }
    }

    window.history.replaceState(null, '', '/')

    return { kind: 'builder' }
}

const App = () => {
    const view = useMemo(resolveView, [])

    return (
        <>
            {view.kind === 'fleet' ? <FleetPage /> : <BuilderPage />}
            <WhatsAppButton />
        </>
    )
}

export default App
