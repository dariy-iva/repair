import { v4 as uuidv4 } from 'uuid'

export default (comparisonList: { id: string }[]): string => {
  let id = uuidv4()
  while (comparisonList.some(c => c.id === id)) {
    id = uuidv4()
  }
  return id
}
