import { FC } from 'react'
import { FaPlusCircle } from 'react-icons/fa'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { cn } from '../../shared/tailwind-helper'

export interface ILayout {
    language: string
    visible: boolean
    extraHeader: IKeyValue
    setExtraHeader?: (value: React.SetStateAction<IKeyValue>) => void
    title?: string
    isFullWidth?: boolean
}

export const KeyValue: FC<ILayout> = ({
    language,
    extraHeader = { value: '', key: '' },
    visible = false,
    setExtraHeader,
    title = 'Key Value (component)',
    isFullWidth = false,
}) => {
    const Tag = isFullWidth ? 'strong' : 'h2'
    // Function to add a new input field
    const handleAddFields = () => {
        try {
            const newExtraHeaderElement: IKeyValue = { key: 'value' }
            setExtraHeader({
                ...extraHeader,
                ...newExtraHeaderElement,
            })
        } catch (error) {
            console.error('Error adding a new input field', error)
        }
    }

    // Function to remove an input field by index
    const handleRemoveFields = (key: string) => {
        const newInputFields = { ...extraHeader }
        delete newInputFields[key]
        try {
            setExtraHeader(newInputFields)
        } catch (error) {
            console.error('Error removing an input field', error)
        }
    }

    // Function to update the value of an input field
    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const values: IKeyValue = { ...extraHeader }
        const newValue = event.currentTarget.value
        const key = event.currentTarget.dataset['key']
        values[key] = newValue
        try {
            setExtraHeader(values)
        } catch (error) {
            console.error('Error updating the value of an input field', error)
        }
    }
    const handleKeyChange = (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const values: IKeyValue = { ...extraHeader }
        const newKey = event.currentTarget.value
        const oldKey = event.currentTarget.dataset['oldKey']
        const order = Object.keys(extraHeader).map((key) => key)

        if (oldKey !== newKey) {
            Object.defineProperty(
                values,
                newKey,
                Object.getOwnPropertyDescriptor(values, oldKey)
            )
            // delete values[oldKey]
        }
        const tempValues: IKeyValue = {}
        order.forEach((element: string) => {
            if (element !== oldKey) {
                tempValues[element] = values[element]
            } else {
                tempValues[newKey] = values[element]
            }
        })
        try {
            setExtraHeader(tempValues)
        } catch (error) {
            console.error('Error updating the value of an input field', error)
        }
    }
    return (
        <div
            className={cn('flex w-full flex-col gap-4', {
                hidden: !visible,
                '!items-center': !isFullWidth,
                '!items-start': isFullWidth,
            })}
        >
            {title !== '' && (
                <Tag
                    className={cn({
                        'max-w-fit text-ecoindex-green': isFullWidth,
                        'text-center': !isFullWidth,
                    })}
                >
                    {title}
                </Tag>
            )}
            {Object.keys(extraHeader).map((extraHeaderKey, index) => {
                return (
                    <div
                        className={cn('flex items-center gap-4', {
                            'w-full': isFullWidth,
                            'w-2/3': !isFullWidth,
                        })}
                        key={index}
                        data-idx={index}
                    >
                        <input
                            type="text"
                            data-idx={index}
                            data-key={extraHeaderKey}
                            data-type="key"
                            data-old-key={extraHeaderKey}
                            placeholder="Enter a key"
                            value={extraHeaderKey}
                            onChange={(e) => handleKeyChange(index, e)}
                            className="block w-full rounded-md border-transparent bg-ecoindex-green-100 focus:border-ecoindex-green focus:bg-white focus:ring-0"
                        />
                        <input
                            type="text"
                            data-idx-value={index}
                            data-key={extraHeaderKey}
                            data-type="value"
                            placeholder="Enter a value"
                            value={extraHeader[extraHeaderKey]}
                            onChange={(e) => handleValueChange(e)}
                            className="block w-full rounded-md border-transparent bg-ecoindex-green-100 focus:border-ecoindex-green focus:bg-white focus:ring-0"
                        />

                        <button
                            type="button"
                            id="btn-remove-url"
                            className="btn-square btn-red"
                            title="delete"
                            onClick={() => handleRemoveFields(extraHeaderKey)}
                        >
                            <RiDeleteBin5Line
                                className="size-6"
                                aria-label="delete"
                            />
                            <span className="sr-only">delete</span>
                        </button>
                    </div>
                )
            })}

            <button
                type="button"
                id="btn-add-url"
                className="btn btn-green-outlined flex gap-2"
                title="add"
                onClick={handleAddFields}
            >
                <FaPlusCircle className="size-6" aria-label="add" />
                Add an ExtraHeader item
            </button>
        </div>
    )
}
