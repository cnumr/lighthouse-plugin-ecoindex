import { FC, ReactNode } from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip'

interface ILayout {
    tooltipContent: ReactNode | string
    children?: ReactNode | string
}
export const SimpleTooltip: FC<ILayout> = ({ children, tooltipContent }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent>{tooltipContent}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
