import { ChangeEvent, FC, useEffect, useState } from 'react'
import { RiDeleteBin5Line, RiRefreshLine, RiSave3Line } from 'react-icons/ri'

import { FaPlusCircle } from 'react-icons/fa'
import { SimpleUrlsList } from './simple-urls'

export interface ILayout {
  appReady: boolean
  isJsonFromDisk: boolean
  language: string
  setJsonDatas?: (jsonDatas: IJsonMesureData) => void
  jsonDatas?: IJsonMesureData
  className: string
  save: () => void
  reload: () => void
  mesure: () => void
  notify: (subTitle: string, message: string) => void
}

export const JsonPanMesure: FC<ILayout> = ({
  appReady,
  isJsonFromDisk,
  language,
  setJsonDatas,
  jsonDatas,
  className,
  save,
  reload,
  mesure,
  notify,
}) => {
  const [updated, setUpdated] = useState(false)
  const handlerAddCourse = () => {
    console.log('add course')
    const newCourse = {
      name: 'TBD',
      target: 'TBD',
      course: 'TBD',
      'is-best-pages': false,
      urls: [{ value: 'https://www.ecoindex.fr/' }],
    }
    setJsonDatas?.({
      ...jsonDatas,
      courses: [...jsonDatas.courses, newCourse],
    })
    notify('Courses Mesure (Full mode)', 'Course added')
    setUpdated(true)
  }
  const handlerDeleteCourse = (_: any, key: number) => {
    console.log('delete course', key)
    setJsonDatas?.({
      ...jsonDatas,
      courses: jsonDatas.courses.filter((_, index) => index !== key),
    })
    notify('Courses Mesure (Full mode)', `Course ${key + 1} deleted`)
    setUpdated(true)
  }
  const handlerOnUpdateSimpleUrlsList = (
    course: number,
    urlsList: SimpleUrlInput[],
  ) => {
    console.log('handlerOnUpdateSimpleUrlsList', course, urlsList)
    setJsonDatas?.({
      ...jsonDatas,
      courses: jsonDatas.courses.map((c, index) => {
        if (index === course) {
          return {
            ...c,
            urls: urlsList,
          }
        }
        return c
      }),
    })
    setUpdated(true)
  }
  const handlerOnChange = (
    course: number,
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const updateGeneric = (
      type: string,
      id: string,
      name: string,
      value: string | boolean,
      _c: number,
    ) => {
      console.log('updateGeneric', type, id, name, value, _c)
      if (_c === -1) {
        setJsonDatas?.({
          ...jsonDatas,
          [id]: value,
        })
      } else {
        setJsonDatas?.({
          ...jsonDatas,
          courses: jsonDatas.courses.map((course, index) => {
            if (index === _c) {
              return {
                ...course,
                [id]: value,
              }
            }
            return course
          }),
        })
      }
    }

    if (e.target.type === 'checkbox' && e.target.name === 'output') {
      const output = jsonDatas.output
      if ((e.target as HTMLInputElement).checked) {
        output.push(e.target.id)
      } else {
        const index = output.indexOf(e.target.id)
        output.splice(index, 1)
      }
      setJsonDatas?.({
        ...jsonDatas,
        output: output,
      })
    }

    if (e.target.type === 'checkbox') {
      updateGeneric(
        e.target.type,
        e.target.id,
        e.target.name,
        (e.target as HTMLInputElement).checked,
        course,
      )
    } else {
      updateGeneric(
        e.target.type,
        e.target.id,
        e.target.name,
        e.target.value,
        course,
      )
    }

    // console.log(`jsonDatas`, jsonDatas)
    setUpdated(true)
  }
  const handlerOnReload = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    console.log('handlerOnReload', e.target)
    reload()
    setUpdated(false)
  }
  const handlerOnSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    console.log('event', event)
    mesure()
    setUpdated(false)
  }
  const handlerOnSave = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    console.log('handlerOnSave', e.target)
    save()
    setUpdated(false)
  }

  const convertJSONOrStringToString = (value: object | string) => {
    if (value instanceof Object) {
      return JSON.stringify(value)
    }
    return value.toString()
  }
  // return (
  //   <>
  //     <p>Waiting fix reload JSON...</p>
  //     <pre>{JSON.stringify(jsonDatas, null, 2)}</pre>
  //   </>
  // )
  return (
    <div className={className}>
      <h2>2. Configuration of the courses</h2>
      <div className="flex gap-2">
        <button
          type="button"
          id="btn-reload-json"
          title="Reload the configuration"
          disabled={!appReady || !updated}
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
          disabled={!appReady || !updated}
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
                  ? convertJSONOrStringToString(jsonDatas['extra-header'])
                  : ''
              }
              onChange={e => handlerOnChange(-1, e)}
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
              checked={jsonDatas?.output.includes('html')}
              onChange={e => handlerOnChange(-1, e)}
            />
            <label htmlFor="html">HTML</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="json"
              name="output"
              checked={jsonDatas?.output.includes('json')}
              onChange={e => handlerOnChange(-1, e)}
            />
            <label htmlFor="json">JSON</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="statement"
              name="output"
              checked={jsonDatas?.output.includes('statement')}
              onChange={e => handlerOnChange(-1, e)}
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
            const innerSetUrlsList = (urlsList: SimpleUrlInput[]) => {
              handlerOnUpdateSimpleUrlsList(index, urlsList)
            }
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
                  <label htmlFor="name" className="mandatory">
                    Course name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={course.name}
                    onChange={e => handlerOnChange(index, e)}
                  />
                </div>
                <div className="flex-col !items-start">
                  <label htmlFor="target" className="">
                    Target
                  </label>
                  <input
                    type="text"
                    name="target"
                    id="target"
                    value={course.target}
                    onChange={e => handlerOnChange(index, e)}
                  />
                </div>
                <div className="flex-col !items-start">
                  <label htmlFor="course" className="">
                    Description
                  </label>
                  <input
                    type="text"
                    name="course"
                    id="course"
                    value={course.course}
                    onChange={e => handlerOnChange(index, e)}
                  />
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="is-best-pages"
                    name="is-best-pages"
                    checked={course['is-best-pages']}
                    onChange={e => handlerOnChange(index, e)}
                  />
                  <label htmlFor="is-best-pages">Is best pages?</label>
                </div>
                <div>
                  {course.urls && (
                    <SimpleUrlsList
                      setUrlsList={innerSetUrlsList}
                      language={language}
                      urlsList={course.urls as SimpleUrlInput[]}
                      visible={true}
                      isFullWidth
                    />
                  )}
                </div>
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
            onClick={handlerOnSubmit}
            className="btn btn-green"
          >
            Mesures
          </button>
        </div>
      </form>
    </div>
  )
}
