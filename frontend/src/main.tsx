import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RecoilRoot } from 'recoil';
import App from './App.tsx'
import './index.css'


// MAIN RUNNING VERSION
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </StrictMode>
);