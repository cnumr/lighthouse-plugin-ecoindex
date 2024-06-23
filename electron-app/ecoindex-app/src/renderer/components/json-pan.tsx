import { FC, ReactNode, useEffect, useState } from 'react'
import { RiDeleteBin5Line, RiRefreshLine, RiSave3Line } from 'react-icons/ri'

import { FaPlusCircle } from 'react-icons/fa'
import { SimpleUrlsList } from './simple-urls'

export interface ILayout {
  appReady: boolean
  setJsonDatas?: (jsonDatas: IJsonMesureData) => void
  jsonDatas?: IJsonMesureData
  className: string
}

export const JsonPanMesure: FC<ILayout> = ({
  appReady,
  setJsonDatas,
  jsonDatas,
  className,
}) => {
  const handlerAddCourse = () => {
    console.log('add course')
    const newCourse = {
      name: '',
      target: '',
      course: '',
      'is-best-pages': false,
      urls: [''],
    }
    setJsonDatas?.({
      ...jsonDatas,
      courses: [...jsonDatas.courses, newCourse],
    })
  }
  const handlerDeleteCourse = (_: any, key: number) => {
    console.log('delete course', key)
    setJsonDatas?.({
      ...jsonDatas,
      courses: jsonDatas.courses.filter((_, index) => index !== key),
    })
  }
  const handlerOnSave = () => {
    console.log('save')
  }
  const handlerOnChange = (e: any) => {
    console.log('change', e.target.value)
  }
  const handlerOnReload = (e: any) => {
    console.log('change', e.target.value)
  }
  return (
    <div className={className}>
      <h2>2. Configuration of the courses</h2>
      <div className="flex gap-2">
        <button
          type="button"
          id="btn-reload-json"
          title="Reload the configuration"
          disabled={true}
          className="btn btn-green btn-small"
          onClick={handlerOnReload}
        >
          <RiRefreshLine className="size-4" aria-label="reload" />
          <span>Reload</span>
        </button>
        <button
          type="button"
          id="btn-save-json"
          title="Save the configuration"
          disabled={!appReady}
          className="btn btn-green btn-small"
          onClick={handlerOnSave}
        >
          <RiSave3Line className="size-4" aria-label="save" />
          <span>Save</span>
        </button>
      </div>
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
              value={
                jsonDatas?.['extra-header']
                  ? JSON.stringify(jsonDatas['extra-header'])
                  : ''
              }
              onChange={handlerOnChange}
            ></textarea>
          </div>
        </fieldset>
        <fieldset>
          <legend className="mandatory">
            Choose the reports you want to generate
          </legend>
          <div>
            <input
              type="checkbox"
              id="html"
              name="output"
              checked
              onChange={handlerOnChange}
            />
            <label htmlFor="html">HTML</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="json"
              name="output"
              onChange={handlerOnChange}
            />
            <label htmlFor="json">JSON</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="statement"
              name="output"
              onChange={handlerOnChange}
            />
            <label htmlFor="statement">
              Statement <em className="text-xs">(JSON output mandatory)</em>
            </label>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <span>Courses</span>
            <button
              type="button"
              id="btn-add-course"
              title="Add a course"
              disabled={!appReady}
              className="btn btn-green-outlined btn-small"
              onClick={handlerAddCourse}
            >
              <FaPlusCircle className="size-4" aria-label="add" />
              <span>Add a course</span>
            </button>
          </legend>
          {jsonDatas?.courses.map((course, index) => {
            return (
              <fieldset key={index}>
                <legend>
                  <span>Course {index + 1}</span>
                  <button
                    type="button"
                    id="btn-delete-course"
                    title="Delete this course"
                    disabled={!appReady}
                    className="btn btn-red btn-small"
                    onClick={() => handlerDeleteCourse(null, index)}
                  >
                    <RiDeleteBin5Line className="size-4" aria-label="delete" />
                    <span className="sr-only">Delete course</span>
                  </button>
                </legend>
                <div className="flex-col !items-start">
                  <label htmlFor="course-name" className="mandatory">
                    Course name
                  </label>
                  <input
                    type="text"
                    name="course-name"
                    id="course-name"
                    value={course.name}
                    onChange={handlerOnChange}
                  />
                </div>
                <div className="flex-col !items-start">
                  <label htmlFor="course-target" className="">
                    Target
                  </label>
                  <input
                    type="text"
                    name="course-target"
                    id="course-target"
                    value={course.target}
                    onChange={handlerOnChange}
                  />
                </div>
                <div className="flex-col !items-start">
                  <label htmlFor="course-description" className="">
                    Description
                  </label>
                  <input
                    type="text"
                    name="course-description"
                    id="course-description"
                    value={course.course}
                    onChange={handlerOnChange}
                  />
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="is-best-page"
                    name="is-best-page"
                    checked={course['is-best-pages']}
                    onChange={handlerOnChange}
                  />
                  <label htmlFor="is-best-page">Is best pages?</label>
                </div>
                <div>{/* <SimpleUrlsList visible={true} /> */}</div>
              </fieldset>
            )
          })}
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
