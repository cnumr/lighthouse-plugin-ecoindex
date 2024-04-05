const DOMInformations = async function DOMInformations() {
  const { default: DOMInformations } = await import('./dom-informations.js')
  return DOMInformations()
}
module.exports = DOMInformations
