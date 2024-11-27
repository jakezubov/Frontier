import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ErrorProvider } from './contexts/error-popup-context.jsx'
import { UserProvider } from './contexts/user-context.jsx'
import { CurrentPageProvider } from './contexts/current-page-context.jsx'
import { HistoryProvider } from './contexts/history-context.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorProvider>
            <UserProvider>
                <CurrentPageProvider>
                    <HistoryProvider>
                        <App />
                    </HistoryProvider>
                </CurrentPageProvider>
            </UserProvider>
        </ErrorProvider>
    </React.StrictMode>
)
