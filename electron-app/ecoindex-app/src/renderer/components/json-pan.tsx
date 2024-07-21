import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../ui/card'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import { RiDeleteBin5Line, RiRefreshLine, RiSave3Line } from 'react-icons/ri'

import { Button } from '../ui/button'
import { FaPlusCircle } from 'react-icons/fa'
import { Input } from '../ui/input'
import { KeyValue } from './key-value'
import { SimpleUrlsList } from './simple-urls'
import { Switch } from '../ui/switch'
import { TypographyH2 } from '@/renderer/ui/typography/TypographyH2'

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
        urlsList: ISimpleUrlInput[]
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
        e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | boolean,
        id?: string,
        name?: string
    ) => {
        const updateGeneric = (
            type: string,
            id: string,
            name: string,
            value: string | boolean,
            _c: number
        ) => {
            console.log('updateGeneric', type, id, name, value, _c)
            if (_c === -1) {
                if (name !== 'output') {
                    setJsonDatas?.({
                        ...jsonDatas,
                        [id]: value,
                    })
                } else {
                    console.log(`is output`)
                    if (e) {
                        const _jsonDatas = {
                            ...jsonDatas,
                        }
                        _jsonDatas['output'].push(id)
                        setJsonDatas?.(_jsonDatas)
                    } else {
                        setJsonDatas?.({
                            ...jsonDatas,
                            output: jsonDatas['output'].filter(
                                (val) => val !== id
                            ),
                        })
                    }
                }
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
        if (typeof e !== 'boolean') {
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
            } else {
                updateGeneric(
                    e.target.type,
                    e.target.id,
                    e.target.name,
                    e.target.type === 'checkbox'
                        ? (e.target as HTMLInputElement).checked
                        : e.target.value,
                    course
                )
            }
        } else {
            // todo
            console.log(`handlerOnChange`, id, name, e, course)

            updateGeneric('checkbox', id, name ? name : id, e, course)
        }

        // console.log(`jsonDatas`, jsonDatas)
        setUpdated(true)
    }
    const handlerOnReload = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        // console.log('handlerOnReload', event.target)
        reload()
        setUpdated(false)
    }
    const handlerOnSubmit = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        // console.log('handlerOnSubmit', event.target)
        mesure()
        setUpdated(false)
    }
    const handlerOnSave = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        // console.log('handlerOnSave', event.target)
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
    // useEffect(() => {
    //     console.log(JSON.stringify(jsonDatas, null, 2))
    // }, [jsonDatas])

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>2. Configuration of the courses</CardTitle>
                <CardDescription>
                    Mesure courses and generate JSON file to relaunch mesures.
                </CardDescription>
            </CardHeader>
            {/* <TypographyH2>2. Configuration of the courses</TypographyH2> */}
            <CardContent>
                <div className="mb-4 flex gap-2">
                    <Button
                        variant="secondary"
                        type="button"
                        id="btn-reload-json"
                        title="Reload the configuration"
                        disabled={!appReady || !updated}
                        className="btn-small"
                        onClick={handlerOnReload}
                    >
                        <RiRefreshLine
                            className="mr-2 size-4"
                            aria-label="reload"
                        />
                        <span>Reload</span>
                    </Button>
                    <Button
                        variant="secondary"
                        type="button"
                        id="btn-save-json"
                        title="Save the configuration"
                        disabled={!appReady || !updated}
                        className="btn-small"
                        onClick={handlerOnSave}
                    >
                        <RiSave3Line
                            className="mr-2 size-4"
                            aria-label="save"
                        />
                        <span>Save</span>
                    </Button>
                </div>
                <form id="json-form">
                    <fieldset>
                        <legend>Extra header</legend>
                        <p>
                            Header to add cookies, Authentication...{' '}
                            <strong>
                                JSON format mandatory, with curly brackets{' '}
                                {'{}'}
                            </strong>
                        </p>
                        <div>
                            <KeyValue
                                extraHeader={
                                    jsonDatas?.['extra-header'] as IKeyValue
                                }
                                language={language}
                                visible={true}
                                isFullWidth={true}
                                title=""
                                setExtraHeader={(e: IKeyValue) => {
                                    setJsonDatas({
                                        ...jsonDatas,
                                        'extra-header': e,
                                    })
                                    setUpdated(true)
                                }}
                            />
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend className="mandatory">
                            Choose the reports you want to generate
                        </legend>
                        <div>
                            {/* <input
                                type="checkbox"
                                id="html"
                                name="output"
                                checked={jsonDatas?.output.includes('html')}
                                onChange={(e) => handlerOnChange(-1, e)}
                            /> */}
                            <Switch
                                id="html"
                                name="output"
                                checked={jsonDatas?.output.includes('html')}
                                onCheckedChange={(e) => {
                                    handlerOnChange(-1, e, 'html', 'output')
                                }}
                            />
                            <label htmlFor="html">HTML</label>
                        </div>
                        <div>
                            {/* <input
                                type="checkbox"
                                id="json"
                                name="output"
                                checked={jsonDatas?.output.includes('json')}
                                onChange={(e) => handlerOnChange(-1, e)}
                            /> */}
                            <Switch
                                id="json"
                                name="output"
                                checked={jsonDatas?.output.includes('json')}
                                onCheckedChange={(e) => {
                                    handlerOnChange(-1, e, 'json', 'output')
                                }}
                            />
                            <label htmlFor="json">JSON</label>
                        </div>
                        <div>
                            {/* <input
                                type="checkbox"
                                id="statement"
                                name="output"
                                checked={jsonDatas?.output.includes(
                                    'statement'
                                )}
                                onChange={(e) => handlerOnChange(-1, e)}
                            /> */}
                            <Switch
                                id="statement"
                                name="output"
                                checked={jsonDatas?.output.includes(
                                    'statement'
                                )}
                                onCheckedChange={(e) => {
                                    handlerOnChange(
                                        -1,
                                        e,
                                        'statement',
                                        'output'
                                    )
                                }}
                            />
                            <label htmlFor="statement">
                                Statement{' '}
                                <em className="text-xs">
                                    (JSON output mandatory)
                                </em>
                            </label>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>
                            <span>Courses</span>
                            <Button
                                type="button"
                                id="btn-add-course"
                                title="Add a course"
                                disabled={!appReady}
                                className="btn btn-green-outlined btn-small"
                                onClick={handlerAddCourse}
                            >
                                <FaPlusCircle
                                    className="size-4"
                                    aria-label="add"
                                />
                                <span>Add a course</span>
                            </Button>
                        </legend>
                        {jsonDatas?.courses.map((course, index) => {
                            const innerSetUrlsList = (
                                urlsList: ISimpleUrlInput[]
                            ) => {
                                handlerOnUpdateSimpleUrlsList(index, urlsList)
                            }
                            return (
                                <fieldset key={index}>
                                    <legend>
                                        <span>Course {index + 1}</span>
                                        <Button
                                            variant="destructive"
                                            type="button"
                                            id="btn-delete-course"
                                            title="Delete this course"
                                            disabled={!appReady}
                                            className="btn btn-red btn-small"
                                            onClick={() =>
                                                handlerDeleteCourse(null, index)
                                            }
                                        >
                                            <RiDeleteBin5Line
                                                className="size-4"
                                                aria-label="delete"
                                            />
                                            <span className="sr-only">
                                                Delete course
                                            </span>
                                        </Button>
                                    </legend>
                                    <div className="flex-col !items-start">
                                        <label
                                            htmlFor="name"
                                            className="mandatory"
                                        >
                                            Course name
                                        </label>
                                        <Input
                                            type="text"
                                            name="name"
                                            id="name"
                                            value={course.name}
                                            onChange={(e) =>
                                                handlerOnChange(index, e)
                                            }
                                        />
                                    </div>
                                    <div className="flex-col !items-start">
                                        <label htmlFor="target" className="">
                                            Target
                                        </label>
                                        <Input
                                            type="text"
                                            name="target"
                                            id="target"
                                            value={course.target}
                                            onChange={(e) =>
                                                handlerOnChange(index, e)
                                            }
                                        />
                                    </div>
                                    <div className="flex-col !items-start">
                                        <label htmlFor="course" className="">
                                            Description
                                        </label>
                                        <Input
                                            type="text"
                                            name="course"
                                            id="course"
                                            value={course.course}
                                            onChange={(e) =>
                                                handlerOnChange(index, e)
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Switch
                                            id="is-best-pages"
                                            name="is-best-pages"
                                            checked={course['is-best-pages']}
                                            onCheckedChange={(e) =>
                                                handlerOnChange(
                                                    index,
                                                    e,
                                                    'is-best-pages'
                                                )
                                            }
                                        />
                                        <label htmlFor="is-best-pages">
                                            Is best pages?
                                        </label>
                                    </div>
                                    <div>
                                        {course.urls && (
                                            <SimpleUrlsList
                                                setUrlsList={innerSetUrlsList}
                                                language={language}
                                                urlsList={
                                                    course.urls as ISimpleUrlInput[]
                                                }
                                                visible={true}
                                                isFullWidth
                                            />
                                        )}
                                    </div>
                                </fieldset>
                            )
                        })}
                    </fieldset>
                    {/* <div className="flex flex-col items-center gap-2">
                        <TypographyH2>3. Launch the mesures</TypographyH2>
                    </div> */}
                </form>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4">
                <CardTitle>3. Launch the mesures</CardTitle>
                <Button
                    variant="default"
                    type="button"
                    id="btn-simple-mesures"
                    title="Launch the mesures"
                    disabled={!appReady}
                    onClick={handlerOnSubmit}
                    className="btn btn-green"
                >
                    Mesures
                </Button>
            </CardFooter>
        </Card>
    )
}
