import { FC, useState } from 'react'

import { FaPlusCircle } from 'react-icons/fa'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { cn } from '../../shared/tailwind-helper'

export interface ILayout {
  language: string
  visible: boolean
  urlsList: SimpleUrlInput[]
  setUrlsList: (urlsList: SimpleUrlInput[]) => void
}

export const SimpleUrlsList: FC<ILayout> = ({
  language,
  urlsList = [{ value: '' }],
  visible = false,
  setUrlsList,
}) => {
  // Function to add a new input field
  const handleAddFields = () => {
    setUrlsList([...urlsList, { value: '' }])
  }

  // Function to remove an input field by index
  const handleRemoveFields = (index: number) => {
    const newInputFields = [...urlsList]
    newInputFields.splice(index, 1)
    setUrlsList(newInputFields)
  }

  // Function to update the value of an input field
  const handleValueChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const values = [...urlsList]
    values[index].value = event.target.value
    setUrlsList(values)
  }
  return (
    <div
      className={cn('flex flex-col items-center gap-4 w-full', {
        hidden: !visible,
      })}
    >
      <h2>2. Urls to mesure</h2>

      {urlsList.map((urlItem, index) => (
        <div className="flex gap-4 items-center w-2/3" key={index}>
          <input
            type="text"
            placeholder="Enter an url"
            value={urlItem.value}
            onChange={e => handleValueChange(index, e)}
            className="block w-full rounded-md bg-ecoindex-green-100 border-transparent focus:border-ecoindex-green focus:bg-white focus:ring-0"
          />

          <button
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
