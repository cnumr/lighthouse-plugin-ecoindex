import { FC, ReactNode, useEffect, useState } from 'react'

import { FaPlusCircle } from 'react-icons/fa'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { cn } from '../../shared/tailwind-helper'

export interface ILayout {
  appReady: boolean
  className: string
}

export const JsonPanMesure: FC<ILayout> = ({ appReady, className }) => {
  return (
    <div className={className}>
      <h2>2. Configuration of the courses</h2>
      <form id="json-form">
        <fieldset>
          <legend>Extra header</legend>
          <p>
            Header to add cookies, Authentication...{' '}
            <strong>JSON format mandatory, with curly brackets {'{}'}</strong>
          </p>
          <div>
            <textarea
              name="extra-header"
              id="extra-header"
              placeholder="Extra header"
            ></textarea>
          </div>
        </fieldset>
        <fieldset>
          <legend>Choose the reports you want to generate</legend>
          <div>
            <input type="checkbox" id="html" name="output" checked />
            <label htmlFor="html">HTML</label>
          </div>
          <div>
            <input type="checkbox" id="json" name="output" />
            <label htmlFor="json">JSON</label>
          </div>
          <div>
            <input type="checkbox" id="statement" name="output" />
            <label htmlFor="statement">
              Statement <em className="text-xs">(JSON output mandatory)</em>
            </label>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <span>Courses</span>
            <button className="btn btn-green-outlined btn-small">
              <FaPlusCircle className="size-4" aria-label="add" />
              <span>Add a course</span>
            </button>
          </legend>
          <fieldset>
            <legend>
              <span>Course 1</span>
              <button
                className="btn btn-red btn-small"
                title="Delete this course"
              >
                <RiDeleteBin5Line className="size-4" aria-label="delete" />
                <span className="sr-only">Delete course</span>
              </button>
            </legend>
            <div className="flex-col !items-start">
              <label htmlFor="course-name" className="mandatory">
                Course name
              </label>
              <input type="text" name="course-name" id="course-name" />
            </div>
            <div>URL Selector</div>
          </fieldset>
        </fieldset>
        <div className="flex flex-col items-center gap-2">
          <h2>3. Launch the mesures</h2>
          <button
            type="button"
            id="btn-simple-mesures"
            title="Launch the mesures"
            disabled={!appReady}
            // onClick={simpleMesures}
            className="btn btn-green"
          >
            Mesures
          </button>
        </div>
      </form>
    </div>
  )
}
