import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RecoilRoot } from 'recoil'
import { SnackbarProvider } from 'notistack'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecoilRoot>
      <SnackbarProvider>
        <App />
      </SnackbarProvider>
    </RecoilRoot>

  </React.StrictMode>,
)
