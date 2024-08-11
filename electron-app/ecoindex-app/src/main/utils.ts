// /**
//  * TODO: Method to clean returned log from sh files
//  * @param stout any
//  * @returns any
//  */
// export const cleanLogString = (stout: any) => {
//     if (typeof stout !== 'string') return stout
//     // eslint-disable-next-line no-control-regex, no-useless-escape
//     const gm = new RegExp(']2;(.*)]1; ?(\n?)', 'gm')
//     if (stout.match(gm)) return stout.replace(gm, '')
//     else return stout
// }

// /**
//  * ISimpleUrlInput[] -> string[]
//  * @param jsonDatas with urls ISimpleUrlInput[]
//  */
// export const convertJSONDatasFromISimpleUrlInput = (
//     jsonDatas: IJsonMesureData
// ): IJsonMesureData => {
//     const output = jsonDatas
//     jsonDatas.courses.forEach((course, index) => {
//         const urls: string[] = course.urls.map((url: any) => url.value)
//         jsonDatas.courses[index].urls = urls
//     })
//     return output
// }

// /**
//  * string[] -> ISimpleUrlInput[]
//  * @param jsonDatas with urls string[]
//  */
// export const convertJSONDatasFromString = (
//     jsonDatas: IJsonMesureData
// ): IJsonMesureData => {
//     const output = jsonDatas
//     jsonDatas.courses.forEach((course, index) => {
//         const urls: ISimpleUrlInput[] = course.urls.map((url: any) => {
//             return {
//                 value: url,
//             }
//         })
//         jsonDatas.courses[index].urls = urls
//     })
//     // console.log(`_convertJSONDatasFromString`, output)
//     return output
// }
