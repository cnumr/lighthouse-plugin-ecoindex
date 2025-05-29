import { isDate } from 'util/types'
async function dateToFileString(date: string | Date) {
  let _date: string | null | Date = undefined
  if (date === undefined) {
    _date = new Date().toISOString()
  } else {
    _date = date
  }
  if (isDate(_date)) {
    return _date.toISOString().replace(/:/g, '-')
  }
  return _date.replace(/:/g, '-')
}

export { dateToFileString }
