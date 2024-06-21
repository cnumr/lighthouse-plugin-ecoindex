import './index.css';

import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';

import icon from '../../assets/icon.svg';

function Hello() {
  const [data, setdata] = useState("")
  const [workDir, setWorkDir] = useState("chargement...")
  // Run runFakeMesure on click on button fake
const fakeMesure = () => {
  console.log('fake button clicked');
  window.electronAPI.runFakeMesure()
}

// ipcRenderer.sendSync('chomp-result', function (event,store) {
//     console.log(store);
// });

const setTitle = () => {
  const title = document.getElementById('title') as HTMLInputElement;
  window.electronAPI.setTitle(title.value);
  }
  
  const openFile = async () => {
    const filePath = await window.electronAPI.handleSelectFolder()
    setWorkDir(filePath);
    // const filePathElement = document.getElementById('filePath') as HTMLElement;
    // filePathElement.innerText = filePath
}

useEffect(() => {
  const fetchNodeVersion = async () => {
    const result = await window.versions.getNodeVersion();
    setdata(result);
  };
  const fetchWorkDir = async () => {
    const result = await window.electronAPI.getWorkDir("");
    setWorkDir(result);
    // const filePathElement = document.getElementById('filePath') as HTMLElement;
    // filePathElement.innerText = result
  };

  fetchNodeVersion();
  fetchWorkDir();
}, []);


  return (
    <div>
      <main className='flex flex-col justify-between p-4 h-screen'>
      <div className="flex justify-center">
        <img width="100" alt="icon" src={icon} className="bg-slate-400" />
      </div>
      <div className='flex flex-col gap-2 items-center'>
        <h1 className="font-black text-2xl text-blue-700">Ecoindex app 👋</h1>
          {/* <input id="title" className='border border-blue-300 w-full'/>
          <button id="btn-title" type="button" onClick={setTitle} className='btn btn-red'>Set</button> */}
        <div className='flex gap-2 items-center w-full'>
        <p id="filePath" className='echo min-h-8'>{workDir}</p>
        <button type="button" id="btn-file" onClick={openFile} className='btn btn-red whitespace-nowrap'>Select output folder</button>
        </div>
        {/* <div className='flex gap-2 items-center'>
        Title: <input id="title" className='border border-blue-300'/>
          <button id="btn-title" type="button" onClick={setTitle} className='btn btn-red'>Set</button>
        </div> */}
        {/* run runFakeMesure with a button */}
          <button id="btn-fake" onClick={fakeMesure} className='btn btn-red'>Fake Measure</button>
          {/* display here the echoReadable line */}
          <p className='text-sm text-gray-500 font-medium'>console</p>
          <p id="echo" className='echo h-24'  ></p>
      </div>
      <div className='text-sm text-center'>
        <p className='text-xs text-gray-500'>Host Informations : Node.js({data ? data : 'loading...'})</p>
        <p className='text-xs text-gray-500'>
        Internal Electron informations : Chrome (v{window.versions.chrome()}), Node.js (v
        {window.versions.node()}), and Electron (v{window.versions.electron()})
        </p>
        <p className='mt-2'>© 2024 - Made with ❤️ by <a href="https://asso.greenit.fr">GreenIT</a>🌱</p>
      </div>
    </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}