import { Button } from '@/components/ui/button'
import { useState } from 'react'

function App() {
  const [counter, setCounter] = useState(0)

  window.electronAPI.onUpdateCounter((value: number) => {
    setCounter(counter + value)
  })

  return (
    <div className="flex h-full w-full flex-col place-content-center place-items-center gap-8 p-8 text-center">
      <p className="text-4xl font-bold underline">Electron React Starter</p>
      <div>
        Chrome (v{window.versions.chrome()}), Node.js (v
        {window.versions.node()}
        ), and Electron (v{window.versions.electron()})
      </div>
      <div className="flex w-full max-w-2xl flex-col gap-4 rounded-lg border border-zinc-200 p-4">
        <span className="text-xl font-bold">IPC</span>
        <Button
          onClick={() => {
            window.electronAPI.setTitle(
              'The title was last updated at ' +
                new Intl.DateTimeFormat('en-GB', {
                  dateStyle: 'full',
                  timeStyle: 'long',
                }).format(Date.now()),
            )
          }}
        >
          Set title (renderer to main(one-way))
        </Button>
        <Button
          onClick={async () => {
            const filePath = await window.electronAPI.openFolder()
            if (filePath) {
              alert('The file that you selected is:\n\n' + filePath)
            }
          }}
        >
          Get filepath (renderer to main (two-way))
        </Button>
        <Button
          onClick={async () => {
            const temps = await window.electronAPI.launchEcoindexSimpleCollect()
            if (temps) {
              alert('Pouet:\n\n' + temps)
            }
          }}
        >
          Ecoindex Demo mode
        </Button>
        <Button
          onClick={async () => {
            const temps = await window.electronAPI.installPuppeteerBrowser()
            if (temps) {
              alert('Pouet:\n\n' + temps)
            }
          }}
        >
          installPuppeteerBrowser
        </Button>
        <div>
          Go to the top left menu bar to update counter! (main to renderer)
        </div>
        <div>
          Current value:<strong>{counter}</strong>
        </div>
      </div>
    </div>
  )
}

export default App
