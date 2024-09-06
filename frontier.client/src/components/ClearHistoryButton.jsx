import PropTypes from 'prop-types'
import Axios from 'axios'
import { useState, useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import PopupConfirmation from '../popups/PopupConfirmation'
import PopupError from '../popups/PopupError'
import URL from '../constants/URLs'

const ClearHistoryButton = ({ onSuccess }) => {
    const { userId } = useContext(UserContext)

    // Popups
    const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false)
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)
    const [errorContent, setErrorContent] = useState('')

    const handleClearHistory = async () => {
        try {
            await Axios.delete(URL.DELETE_HISTORY(userId))
            onSuccess('History has been cleared.')
        }
        catch (error) {
            console.error({
                message: 'Failed to clear history',
                error: error.message,
                stack: error.stack,
                userId,
            })
            setErrorContent('Failed to clear history\n' + error.message)
            setIsErrorPopupOpen(true)
        }
    }

    return (
        <div>
            <button className="general-button" type="button" onClick={() => setIsConfirmationPopupOpen(true)}>Clear History</button>

            {isConfirmationPopupOpen && (
                <PopupConfirmation isPopupOpen={isConfirmationPopupOpen} setIsPopupOpen={setIsConfirmationPopupOpen} onConfirm={handleClearHistory} heading="Are you sure you want to clear history?" />
            )}

            {isErrorPopupOpen && (
                <PopupError isPopupOpen={isErrorPopupOpen} setIsPopupOpen={setIsErrorPopupOpen} content={errorContent} />
            )}
        </div>
    )
}

ClearHistoryButton.propTypes = {
    onSuccess: PropTypes.func.isRequired,
}

export default ClearHistoryButton