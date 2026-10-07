import { useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Upload from '@/components/ui/Upload'
import { HiOutlinePlus } from 'react-icons/hi'

const AvatarImage = () => {
    const [avatarImg, setAvatarImg] = useState<string | null>(null)

    const onFileUpload = (file: File) => {
        setAvatarImg(URL.createObjectURL(file))
    }

    const beforeUpload = (files: FileList | null) => {
        let valid: string | boolean = true

        const allowedFileType = ['image/jpeg', 'image/png']
        if (files) {
            for (const file of files) {
                if (!allowedFileType.includes(file.type)) {
                    valid = 'Please upload a .jpeg or .png file!'
                }
            }
        }

        return valid
    }

    return (
        <div>
            <Upload
                className="cursor-pointer"
                showList={false}
                uploadLimit={1}
                beforeUpload={beforeUpload}
                onChange={onFileUpload}
            >
                <Avatar
                    size={40}
                    src={avatarImg as string}
                    icon={<HiOutlinePlus />}
                />
            </Upload>
        </div>
    )
}

export default AvatarImage
