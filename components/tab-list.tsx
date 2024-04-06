import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Fragment } from "react"


export const TabLists = ({ tabs }: { tabs: string[] }) => {
    return (
        <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {tabs.map((tab, index) => {
                const tabName = tab.split(/(?=[A-Z])/).join(' ')
                return (
                    <Fragment key={index}>
                        <TabsTrigger value={tab} className="capitalize sm:block hidden">{tabName}</TabsTrigger>
                    </Fragment>
                )
            })}
        </TabsList>
    )
}