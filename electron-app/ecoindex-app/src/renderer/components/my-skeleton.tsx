import { Skeleton } from '../ui/skeleton'

export const MySkeleton = () => {
    return (
        <div className="w-full space-y-6">
            <div className="flex w-full flex-col space-y-3">
                <Skeleton className="h-[125px] w-full" />
                <div className="w-full space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-4 w-[calc(100%_-_4rem)]" />
                </div>
            </div>
            <div className="flex w-full flex-col space-y-3">
                <Skeleton className="h-[125px] w-full" />
                <div className="w-full space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-4 w-[calc(100%_-_4rem)]" />
                </div>
            </div>
        </div>
    )
}
