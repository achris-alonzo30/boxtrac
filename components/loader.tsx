import { Blocks } from "react-loader-spinner"

export const Loader = ({ text }: { text: string}) => {
    return (
        <div className="flex flex-col items-center justify-center mx-auto space-y-4 w-full py-24">
            <Blocks
                height="100"
                width="100"
                color="#4fa94d"
                ariaLabel="blocks-loading"
                wrapperStyle={{}}
                wrapperClass="blocks-wrapper"
                visible={true}
            />
            <p className="text-2xl font-semibold">{text}</p>
        </div>
    )
}