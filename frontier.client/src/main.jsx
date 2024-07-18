import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { UserProvider } from './contexts/UserContext'
import { JewelleryPageProvider } from './contexts/JewelleryPageContext'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <UserProvider>
            <JewelleryPageProvider>
                <App />
            </JewelleryPageProvider>
        </UserProvider>
    </React.StrictMode>,
)
