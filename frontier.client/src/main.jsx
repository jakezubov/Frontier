import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ErrorProvider } from './contexts/ErrorPopupContext'
import { UserProvider } from './contexts/UserContext'
import { JewelleryPageProvider } from './contexts/JewelleryPageContext'
import { HistoryProvider } from './contexts/HistoryContext'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorProvider>
            <UserProvider>
                <JewelleryPageProvider>
                    <HistoryProvider>
                        <App />
                    </HistoryProvider>
                </JewelleryPageProvider>
            </UserProvider>
        </ErrorProvider>
    </React.StrictMode>,
)
