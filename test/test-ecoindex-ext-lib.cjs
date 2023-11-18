const {
  computeEcoIndex,
  computeGreenhouseGasesEmissionfromEcoIndex,
  computeWaterConsumptionfromEcoIndex,
  getEcoIndexGrade,
} = require('ecoindex')
// Entry parameters
const input = {
  width: 1920,
  height: 1080,
  url: 'https://www.ecoindex.fr/',
  size: 31.245,
  nodes: 205,
  requests: 5,
}
// Expected output
const ouput = {
  ecoindex: 87.8876346614259,
  grade: 'A',
  ghg: 1.24,
  water: 1.86,
}
var assert = require('assert')
// Tests
describe('Ecoindex, from lib https://www.npmjs.com/package/ecoindex', function () {
  describe('#computeEcoIndex()', function () {
    it(`should return ${ouput.ecoindex} for ${input.nodes} nodes, ${input.requests} requests, ${input.size} size`, function () {
      assert.equal(
        computeEcoIndex(input.nodes, input.requests, input.size),
        87.8876346614259,
      )
    })
  })
  describe('#getEcoIndexGrade()', function () {
    it(`should return ${ouput.grade} for ${ouput.ecoindex}`, function () {
      assert.equal(getEcoIndexGrade(ouput.ecoindex), 'A')
    })
  })
  describe('#computeGreenhouseGasesEmissionfromEcoIndex()', function () {
    it(`should return ${ouput.ghg} for ${ouput.ecoindex}`, function () {
      assert.equal(
        computeGreenhouseGasesEmissionfromEcoIndex(ouput.ecoindex),
        1.24,
      )
    })
  })
  describe('#computeWaterConsumptionfromEcoIndex()', function () {
    it(`should return ${ouput.water} for ${ouput.ecoindex}`, function () {
      assert.equal(computeWaterConsumptionfromEcoIndex(ouput.ecoindex), 1.86)
    })
  })
})
