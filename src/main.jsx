import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css'
import './index.css'
import App from './App.jsx'
import BankLoginStore from './contexts/BankLoginStore.jsx'

createRoot(document.getElementById('root')).render(
  <BankLoginStore>
    <App />
  </BankLoginStore>,
)
