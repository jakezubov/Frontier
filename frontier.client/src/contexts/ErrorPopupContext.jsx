import { useState, createContext, useContext } from 'react'
import PopupError from '../popups/PopupError'

const ErrorContext = createContext()

export const ErrorProvider = ({ children }) => {
    const [errorContent, setErrorContent] = useState('')
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)

    const handleError = (message) => {
        setErrorContent(message)
        setIsErrorPopupOpen(true)
    }

    return (
        <ErrorContext.Provider value={{ handleError }}>
            {children}
            {isErrorPopupOpen && (
                <PopupError isPopupOpen={isErrorPopupOpen} setIsPopupOpen={setIsErrorPopupOpen} content={errorContent} />
            )}
        </ErrorContext.Provider>
    )
}

export const useError = () => useContext(ErrorContext)