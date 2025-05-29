declare module 'ecoindex' {
  export function computeEcoIndex(
    domSize: number,
    requestCount: number,
    totalSize: number,
  ): number
  export function computeWaterConsumptionfromEcoIndex(ecoIndex: number): number
  export function computeGreenhouseGasesEmissionfromEcoIndex(
    ecoIndex: number,
  ): number
  export function getEcoIndexGrade(ecoIndex: number): string
}
