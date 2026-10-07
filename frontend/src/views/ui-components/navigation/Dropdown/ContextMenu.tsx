import Dropdown from '@/components/ui/Dropdown'

const ContextMenu = () => {
    return (
        <Dropdown.ContextMenu
            areaClass="bg-gray-100 dark:bg-gray-700 rounded-lg h-[150px] flex items-center justify-center"
            areaContent={<span className="font-medium">Right click here</span>}
        >
            <Dropdown.Item>Item 1</Dropdown.Item>
            <Dropdown.Menu title="Right Item 2">
                <Dropdown.Menu title="Item 2-1">
                    <Dropdown.Item active>Item 2-1-1</Dropdown.Item>
                    <Dropdown.Item>Item 2-1-2</Dropdown.Item>
                    <Dropdown.Item>Item 2-1-3</Dropdown.Item>
                </Dropdown.Menu>
                <Dropdown.Item>Item 2-2</Dropdown.Item>
                <Dropdown.Item>Item 2-3</Dropdown.Item>
            </Dropdown.Menu>
            <Dropdown.Menu title="Right Item 3">
                <Dropdown.Menu title="Item 3-1">
                    <Dropdown.Item>Item 3-1-1</Dropdown.Item>
                    <Dropdown.Item>Item 3-1-2</Dropdown.Item>
                    <Dropdown.Item>Item 3-1-3</Dropdown.Item>
                </Dropdown.Menu>
                <Dropdown.Item>Item 3-2</Dropdown.Item>
                <Dropdown.Item>Item 3-3</Dropdown.Item>
            </Dropdown.Menu>
            <Dropdown.Item>Item 4</Dropdown.Item>
        </Dropdown.ContextMenu>
    )
}

export default ContextMenu
