import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import YoloHomeLogin from './pages/YoloHomeLogin.jsx'
import YoloHomeSignUp from './pages/YoloHomeSignUp.jsx'
createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
)
