import { FC } from 'react'
import { FaPlusCircle } from 'react-icons/fa'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { cn } from '../../shared/tailwind-helper'

export interface ILayout {
  language: string
  visible: boolean
  urlsList: SimpleUrlInput[]
  setUrlsList?: (urlsList: SimpleUrlInput[]) => void
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
  const Tag = isFullWidth ? 'strong' : 'h2'
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
    event: React.ChangeEvent<HTMLInputElement>,
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
      className={cn('flex flex-col gap-4 w-full', {
        hidden: !visible,
        '!items-center': !isFullWidth,
        '!items-start': isFullWidth,
      })}
    >
      <Tag
        className={cn({
          'text-ecoindex-green max-w-fit': isFullWidth,
          'text-center': !isFullWidth,
        })}
      >
        {title}
      </Tag>

      {urlsList.map((urlItem, index) => (
        <div
          className={cn('flex gap-4 items-center', {
            'w-full': isFullWidth,
            'w-2/3': !isFullWidth,
          })}
          key={index}
        >
          <input
            type="text"
            placeholder="Enter an url"
            value={urlItem.value}
            onChange={e => handleValueChange(index, e)}
            className="block w-full rounded-md bg-ecoindex-green-100 border-transparent focus:border-ecoindex-green focus:bg-white focus:ring-0"
          />

          <button
            type="button"
            id="btn-remove-url"
            className="btn-square btn-red"
            title="delete"
            onClick={() => handleRemoveFields(index)}
          >
            <RiDeleteBin5Line className="size-6" aria-label="delete" />
            <span className="sr-only">delete</span>
          </button>
        </div>
      ))}

      <button
        type="button"
        id="btn-add-url"
        className="btn btn-green-outlined flex gap-2"
        title="add"
        onClick={handleAddFields}
      >
        <FaPlusCircle className="size-6" aria-label="add" />
        Add an URL
      </button>
    </div>
  )
}
