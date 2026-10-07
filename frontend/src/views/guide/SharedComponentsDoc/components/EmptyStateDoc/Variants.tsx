import EmptyState from '@/components/shared/EmptyState'
import IconFrame from '@/components/shared/IconFrame'
import { LiFolderOpen, LiDocument, LiSearch } from '@/icons'

const Variants = () => {
    return (
        <div className="flex flex-wrap gap-2 justify-center">
            <EmptyState
                variant="wave"
                size={240}
                illustration={
                    <IconFrame>
                        <LiFolderOpen className="text-xl heading-text" />
                    </IconFrame>
                }
            >
                <p>Wave</p>
            </EmptyState>
            <EmptyState
                variant="grid"
                size={240}
                illustration={
                    <IconFrame>
                        <LiDocument className="text-xl heading-text" />
                    </IconFrame>
                }
            >
                <p>Grid</p>
            </EmptyState>
            <EmptyState
                variant="dots"
                size={240}
                illustration={
                    <IconFrame>
                        <LiSearch className="text-xl heading-text" />
                    </IconFrame>
                }
            >
                <p>Dots</p>
            </EmptyState>
        </div>
    )
}

export default Variants
