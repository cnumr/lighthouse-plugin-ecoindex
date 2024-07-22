import { CirclePlus, Trash2 } from 'lucide-react'

import { Button } from '../ui/button'
import { FC } from 'react'
import { Input } from '../ui/input'
import { TypographyH2 } from '@/renderer/ui/typography/TypographyH2'
import { cn } from '../lib/utils'

export interface ILayout {
    language: string
    visible: boolean
    urlsList: ISimpleUrlInput[]
    setUrlsList?: (urlsList: ISimpleUrlInput[]) => void
    title?: string
    isFullWidth?: boolean
}

export const SimpleUrlsList: FC<ILayout> = ({
    language,
    urlsList = [{ value: '' }],
    visible = false,
    setUrlsList,
    title = 'Urls to mesure',
    isFullWidth = false,
}) => {
    const Tag = isFullWidth ? 'strong' : TypographyH2
    // Function to add a new input field
    const handleAddFields = () => {
        try {
            setUrlsList([...urlsList, { value: '' }])
        } catch (error) {
            console.error('Error adding a new input field', error)
        }
    }

    // Function to remove an input field by index
    const handleRemoveFields = (index: number) => {
        const newInputFields = [...urlsList]
        newInputFields.splice(index, 1)
        try {
            setUrlsList(newInputFields)
        } catch (error) {
            console.error('Error removing an input field', error)
        }
    }

    // Function to update the value of an input field
    const handleValueChange = (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const values = [...urlsList]
        values[index].value = event.target.value
        try {
            setUrlsList(values)
        } catch (error) {
            console.error('Error updating the value of an input field', error)
        }
    }
    return (
        <div
            className={cn('flex w-full flex-col justify-start gap-4', {
                hidden: !visible,
                '!items-center': !isFullWidth,
                '!items-start': isFullWidth,
            })}
        >
            {title !== '' && (
                <Tag
                    className={cn({
                        'text-primary dark:text-foreground max-w-fit':
                            isFullWidth,
                        'text-center': !isFullWidth,
                    })}
                >
                    {title}
                </Tag>
            )}
            <div
                className={cn('mx-auto flex flex-col items-center gap-4', {
                    'w-full': isFullWidth,
                    'w-2/3': !isFullWidth,
                })}
            >
                {urlsList.map((urlItem, index) => (
                    <div key={index} className="flex w-full gap-4">
                        <Input
                            type="text"
                            placeholder="Enter an url"
                            value={urlItem.value}
                            onChange={(e) => handleValueChange(index, e)}
                            className="block w-full"
                        />

                        <Button
                            variant="destructive"
                            type="button"
                            size="icon"
                            id="btn-remove-url"
                            className=""
                            title="delete"
                            onClick={() => handleRemoveFields(index)}
                        >
                            <Trash2 className="size-4" aria-label="delete" />
                            <span className="sr-only">delete</span>
                        </Button>
                    </div>
                ))}

                <Button
                    variant="secondary"
                    size="sm"
                    type="button"
                    id="btn-add-url"
                    className=""
                    title="add"
                    onClick={handleAddFields}
                >
                    <CirclePlus className="mr-2 size-4" aria-label="add" />
                    Add an URL
                </Button>
            </div>
        </div>
    )
}
