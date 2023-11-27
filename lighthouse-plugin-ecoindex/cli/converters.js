const base = {
  gesToKm: {
    label:
      'Converting GHGs (expressed in eqCo2) into kilometers traveled in a combustion-powered car',
    coef: 0.216,
    description:
      '(Data > Datasets > 3. Indirect emissions from transport > Passenger transport > Passenger transport - Road > Passenger car > Fleet average - all engines (9) > Average car/engine/2018',
  },
}

const gesToKm = ges => {
  return ges * base.gesToKm.coef
}

const scoreToGrade = score => {
  if (score >= 81) {
    return 'A'
  } else if (score >= 71) {
    return 'B'
  } else if (score >= 56) {
    return 'C'
  } else if (score >= 41) {
    return 'D'
  } else if (score >= 26) {
    return 'E'
  } else if (score >= 11) {
    return 'F'
  } else {
    return 'G'
  }
}

export { gesToKm, scoreToGrade }
