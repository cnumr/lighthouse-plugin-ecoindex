import {
  computeEcoIndex,
  computeGreenhouseGasesEmissionfromEcoIndex,
  computeWaterConsumptionfromEcoIndex,
  getEcoIndexGrade,
} from 'ecoindex'

const input = {
  width: 1920,
  height: 1080,
  url: 'https://www.ecoindex.fr/',
  size: 31.245,
  nodes: 205,
  requests: 5,
  grade: 'A',
  score: 88.0,
  ges: 1.24,
  water: 1.86,
  ecoindex_version: '5.4.3',
  date: '2023-11-02 13:22:44.916523',
  page_type: null,
}
// {domSize:205},
// {size:31245},
// {requests:5},
const ecoindex = computeEcoIndex(input.nodes, input.requests, input.size)
console.log(`Inputs`)
console.log(
  JSON.stringify({
    size: input.size,
    node: input.nodes,
    requests: input.requests,
  }),
)
console.log(`Outputs`)
console.log(
  JSON.stringify({
    ecoindex: ecoindex,
    grade: getEcoIndexGrade(ecoindex),
    ghg: computeGreenhouseGasesEmissionfromEcoIndex(ecoindex),
    water: computeWaterConsumptionfromEcoIndex(ecoindex),
  }),
)
