import FileIcon from '@/components/shared/FileIcon'

const Basic = () => {
    return (
        <div className="flex items-center gap-6 flex-wrap p-2">
            <FileIcon type="pdf" />
            <FileIcon type="xlsx" />
            <FileIcon type="docx" />
            <FileIcon type="ppt" />
            <FileIcon type="png" />
            <FileIcon type="directory" />
            <FileIcon type="txt" />
        </div>
    )
}

export default Basic
