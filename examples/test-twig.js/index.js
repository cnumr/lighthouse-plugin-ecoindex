import Twig from 'twig'
Twig.renderFile('./model.twig', { foo: 'bar' }, (err, html) => {
  html // compiled string
  console.log(html)
})
