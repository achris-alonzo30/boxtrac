import { Blocks } from "react-loader-spinner"

export const Loader = ({ text }: { text: string}) => {
    return (
        <div className="flex flex-col h-screen items-center justify-center mx-auto space-y-4 w-full">
            <Blocks
                height="100"
                width="100"
                color="#2ca9bc"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                visible={true}
            />
            <p className="text-2xl font-semibold">{text}</p>
        </div>
    )
}