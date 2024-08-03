import AppHello from './AppHello'
import { createRoot } from 'react-dom/client'

const container = document.getElementById('root') as HTMLElement
console.log(container)

const root = createRoot(container)
root.render(<AppHello />)
