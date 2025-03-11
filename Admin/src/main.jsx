import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { StoreProvider } from './components/Context/Store.jsx'

createRoot(document.getElementById('root')).render(
    <StoreProvider>
    <App />
    </StoreProvider>

)
