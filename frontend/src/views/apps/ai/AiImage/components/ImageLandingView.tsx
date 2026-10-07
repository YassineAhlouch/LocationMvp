import GenerateImage from '@/components/svg/GenerateImage'

const ImageLandingView = () => {
    return (
        <div className="max-w-[550px] w-full mx-auto h-full flex items-center justify-center">
            <div>
                <div className="flex justify-center mb-4">
                    <GenerateImage height={75} width={75} />
                </div>
                <div className="heading-text text-3xl leading-snug text-center">
                    <span className="font-semibold">Let's make something!</span>
                    <br />
                </div>
                <div className="text-lg leading-snug text-center mt-4">
                    <span>
                        Describe what you'd like to see in the prompt field
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ImageLandingView
