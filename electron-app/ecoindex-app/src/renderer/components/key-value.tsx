import { CirclePlus, Trash2 } from 'lucide-react'

import { Button } from '../ui/button'
import { FC } from 'react'
import { FaPlusCircle } from 'react-icons/fa'
import { Input } from '../ui/input'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { TypographyH2 } from '../ui/typography/TypographyH2'
import { cn } from '../lib/utils'
import { useTranslation } from 'react-i18next'

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
    const { t } = useTranslation()
    const Tag = isFullWidth ? 'strong' : TypographyH2
    // Function to add a new input field
    const handleAddFields = () => {
        try {
            const newExtraHeaderElement: IKeyValue = { key: 'value' }
            setExtraHeader({
                ...extraHeader,
                ...newExtraHeaderElement,
            })
        } catch (error) {
            console.error(t('Error adding a new input field'), error)
        }
    }

    // Function to remove an input field by index
    const handleRemoveFields = (key: string) => {
        const newInputFields = { ...extraHeader }
        delete newInputFields[key]
        try {
            setExtraHeader(newInputFields)
        } catch (error) {
            console.error(t('Error removing an input field'), error)
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
            console.error(
                t('Error updating the value of an input field'),
                error
            )
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
            console.error(
                t('Error updating the value of an input field'),
                error
            )
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
                        'max-w-fit text-primary dark:text-foreground':
                            isFullWidth,
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
                        <Input
                            type="text"
                            data-idx={index}
                            data-key={extraHeaderKey}
                            data-type="key"
                            data-old-key={extraHeaderKey}
                            placeholder={t('Enter a key')}
                            value={extraHeaderKey}
                            onChange={(e) => handleKeyChange(index, e)}
                            className="block w-full"
                        />
                        <Input
                            type="text"
                            data-idx-value={index}
                            data-key={extraHeaderKey}
                            data-type="value"
                            placeholder={t('Enter a value')}
                            value={extraHeader[extraHeaderKey]}
                            onChange={(e) => handleValueChange(e)}
                            className="block w-full"
                        />

                        <Button
                            variant="destructive"
                            type="button"
                            id="btn-remove-url"
                            title="delete"
                            onClick={() => handleRemoveFields(extraHeaderKey)}
                        >
                            <Trash2 className="size-4" aria-label="delete" />
                            <span className="sr-only">{t('delete')}</span>
                        </Button>
                    </div>
                )
            })}

            <Button
                variant="secondary"
                type="button"
                size="sm"
                id="btn-add-url"
                className=""
                title={t('add')}
                onClick={handleAddFields}
            >
                <CirclePlus className="mr-2 size-4" aria-label={t('add')} />
                {t('Add an ExtraHeader item')}
            </Button>
        </div>
    )
}
