import PropTypes from 'prop-types'
import { useState } from 'react'
import { useUserSession } from '../contexts/user-context'
import { useDeleteUserHistory } from '../APIs/history'
import PopupConfirmation from '../popups/popup-confirmation'

const ClearHistoryButton = ({ onSuccess }) => {
    const { userId } = useUserSession()
    const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false)

    // APIs
    const { deleteUserHistory } = useDeleteUserHistory()

    const handleClearHistory = async () => {
        await deleteUserHistory(userId)
        onSuccess('History has been cleared.')
    }

    return (
        <div>
            <button className="general-button" type="button" onClick={() => setIsConfirmationPopupOpen(true)}>Clear History</button>

            {isConfirmationPopupOpen && (
                <PopupConfirmation isPopupOpen={isConfirmationPopupOpen} setIsPopupOpen={setIsConfirmationPopupOpen} onConfirm={handleClearHistory} heading="Are you sure you want to clear history?" />
            )}
        </div>
    )
}

ClearHistoryButton.propTypes = {
    onSuccess: PropTypes.func.isRequired,
}

export default ClearHistoryButton