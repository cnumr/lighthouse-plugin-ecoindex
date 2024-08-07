import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../ui/card'
import { ChangeEvent, FC, useState } from 'react'
import { CirclePlus, RotateCcw, Save, Trash2 } from 'lucide-react'
import { RiRefreshLine, RiSave3Line } from 'react-icons/ri'

import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { KeyValue } from './key-value'
import { SimpleUrlsList } from './simple-urls'
import { Switch } from '../ui/switch'
import { useTranslation } from 'react-i18next'

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
    const { t } = useTranslation()

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
        notify(t('Courses Mesure (Full mode)'), t('Course added'))
        setUpdated(true)
    }
    const handlerDeleteCourse = (_: any, key: number) => {
        console.log('delete course', key)
        setJsonDatas?.({
            ...jsonDatas,
            courses: jsonDatas.courses.filter((_, index) => index !== key),
        })
        // to translate
        notify(t('Courses Mesure (Full mode)'), `Course ${key + 1} deleted`)
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
        let count = 0
        jsonDatas?.courses.forEach((course) => {
            if (course['is-best-pages'] === true) count++
        })
        if (count === 0) {
            alert(t('You must set 1 best-page on courses.'))
            return
        } else if (count > 1) {
            alert(t('You must set only 1 best-page on courses.'))
            return
        }
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
                        size="sm"
                        id="btn-reload-json"
                        title={t('Reload the configuration')}
                        disabled={!appReady || !updated}
                        onClick={handlerOnReload}
                    >
                        <RotateCcw
                            className="mr-2 size-4"
                            aria-label={t('reload')}
                        />
                        <span>{t('Reload')}</span>
                    </Button>
                    <Button
                        variant="secondary"
                        type="button"
                        size="sm"
                        id="btn-save-json"
                        title="Save the configuration"
                        disabled={!appReady || !updated}
                        onClick={handlerOnSave}
                    >
                        <Save className="mr-2 size-4" aria-label={t('save')} />
                        <span>{t('Save')}</span>
                    </Button>
                </div>
                <form id="json-form">
                    <fieldset>
                        <legend>{t('Extra header')}</legend>
                        <p>
                            {t('Header to add cookies, Authentication...')}{' '}
                            <strong>
                                {t(
                                    'JSON format mandatory, with curly brackets'
                                )}{' '}
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
                            {t('Choose the reports you want to generate')}
                        </legend>
                        <div>
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
                                {t('Statement')}{' '}
                                <em className="text-xs">
                                    {t('(JSON output mandatory)')}
                                </em>
                            </label>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>
                            <span>{t('Courses')}</span>
                            <Button
                                type="button"
                                size="sm"
                                variant="default"
                                id="btn-add-course"
                                title={t('Add a course')}
                                disabled={!appReady}
                                onClick={handlerAddCourse}
                            >
                                <CirclePlus
                                    className="mr-2 size-4"
                                    aria-label={t('add')}
                                />
                                <span>{t('Add a course')}</span>
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
                                        <span>
                                            {t('Course')} {index + 1}
                                        </span>
                                        <Button
                                            variant="destructive"
                                            type="button"
                                            size="sm"
                                            id="btn-delete-course"
                                            title={t('Delete this course')}
                                            disabled={!appReady}
                                            className="btn btn-red btn-small"
                                            onClick={() =>
                                                handlerDeleteCourse(null, index)
                                            }
                                        >
                                            <Trash2
                                                className="size-4"
                                                aria-label={t('delete')}
                                            />
                                            <span className="sr-only">
                                                {t('Delete course')}
                                            </span>
                                        </Button>
                                    </legend>
                                    <div className="flex-col !items-start">
                                        <label
                                            htmlFor="name"
                                            className="mandatory"
                                        >
                                            {t('Course name')}
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
                                            {t('Target')}
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
                                            {t('Description')}
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
                                            {t('Is best pages?')}
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
                </form>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4">
                <CardTitle>{t('3. Launch the mesures')}</CardTitle>
                <CardDescription>
                    {t('Generates reports files in seleted dir.')}
                </CardDescription>
                <Button
                    variant="default"
                    type="button"
                    id="btn-simple-mesures"
                    title={t('Launch the mesures')}
                    disabled={!appReady}
                    onClick={handlerOnSubmit}
                    className="btn btn-green"
                >
                    {t('Mesures')}
                </Button>
            </CardFooter>
        </Card>
    )
}
