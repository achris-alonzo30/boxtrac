import { TabsList, TabsTrigger } from "@/components/ui/tabs"

export const TabsLists = () => {
    return (
        <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">In Stock</TabsTrigger>
            <TabsTrigger value="draft">Low Stock</TabsTrigger>
            <TabsTrigger value="archived" className="hidden sm:flex">
                Out of Stock
            </TabsTrigger>
        </TabsList>
    )
}