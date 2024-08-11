/**
 * ISimpleUrlInput[] -> string[]
 * @param jsonDatas with urls ISimpleUrlInput[]
 */
export const convertJSONDatasFromISimpleUrlInput = (
    jsonDatas: IJsonMesureData
): IJsonMesureData => {
    const output = jsonDatas
    jsonDatas.courses.forEach((course, index) => {
        const urls: string[] = course.urls.map(
            (url: string | ISimpleUrlInput) =>
                typeof url === 'string' ? url : url.value
        )
        jsonDatas.courses[index].urls = urls
    })
    return output
}

/**
 * string[] -> ISimpleUrlInput[]
 * @param jsonDatas with urls string[]
 */
export const convertJSONDatasFromString = (
    jsonDatas: IJsonMesureData
): IJsonMesureData => {
    const output = jsonDatas
    jsonDatas.courses.forEach((course, index) => {
        const urls: ISimpleUrlInput[] = course.urls.map(
            (url: string | ISimpleUrlInput) => {
                if (typeof url === 'string') {
                    return {
                        value: url,
                    }
                } else return url
            }
        )
        jsonDatas.courses[index].urls = urls
    })
    // console.log(`_convertJSONDatasFromString`, output)
    return output
}
