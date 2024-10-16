import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ErrorProvider } from './contexts/ErrorPopupContext.jsx'
import { UserProvider } from './contexts/UserContext'
import { JewelleryPageProvider } from './contexts/JewelleryPageContext'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorProvider>
            <UserProvider>
                <JewelleryPageProvider>
                    <App />
                </JewelleryPageProvider>
            </UserProvider>
        </ErrorProvider>
    </React.StrictMode>,
)
