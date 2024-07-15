import PropTypes from 'prop-types'
import Axios from 'axios'
import { useState } from 'react'
import PopupDeleteAccount from './PopupDeleteAccount'
import PopupError from './PopupError'
import URL from '../constants/URLs'

const DeleteAccount = ({ userId, onDelete }) => {
    // Popups
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)
    const [errorContent, setErrorContent] = useState('')

    const handleConfirmDelete = async () => {
        try {
            await Axios.delete(URL.DELETE_USER(userId))
            onDelete()
        }
        catch (error) {
            console.error({
                message: 'Failed to delete account',
                error: error.message,
                stack: error.stack,
            })
            setErrorContent('Failed to delete account\n' + error.message)
            setIsErrorPopupOpen(true)
        }
    }

    return (
        <div>
            <button className="warning-button" type="button" onClick={() => setIsDeletePopupOpen(true)}>Delete Account</button>

            {isDeletePopupOpen && (
                <PopupDeleteAccount isPopupOpen={isDeletePopupOpen} setIsPopupOpen={setIsDeletePopupOpen} onConfirm={handleConfirmDelete} heading="Are you sure?" />
            )}

            {isErrorPopupOpen && (
                <PopupError isPopupOpen={isErrorPopupOpen} setIsPopupOpen={setIsErrorPopupOpen} content={errorContent} />
            )}
        </div>
    )
}

DeleteAccount.propTypes = {
    userId: PropTypes.string,
    onDelete: PropTypes.func.isRequired,
}

export default DeleteAccount