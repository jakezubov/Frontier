import { useState, createContext, useContext } from 'react'
import { useCreateErrorLog } from '../common/APIs'
import PopupError from '../popups/popup-error'

const ErrorContext = createContext()

export const ErrorProvider = ({ children }) => {
    const [errorContent, setErrorContent] = useState('')
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)

    // APIs
    const { createErrorLog } = useCreateErrorLog()

    const displayError = (message) => {
        setErrorContent(message)
        setIsErrorPopupOpen(true)
    }

    const logError = async (userDetails, title, message, stack) => {
        await createErrorLog(userDetails, title, message, stack)
    }

    return (
        <ErrorContext.Provider value={{ displayError, logError }}>
            {children}
            {isErrorPopupOpen && (
                <PopupError isPopupOpen={isErrorPopupOpen} setIsPopupOpen={setIsErrorPopupOpen} content={errorContent} />
            )}
        </ErrorContext.Provider>
    )
}

export const useError = () => useContext(ErrorContext)