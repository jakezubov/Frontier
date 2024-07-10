import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Path from '../constants/Paths'

const PopupDeleteAccount = ({ isPopupOpen, setIsPopupOpen, onConfirm, }) => {
    useEffect(() => {
        if (isPopupOpen) {
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [isPopupOpen])

    const handleClosePopup = () => {
        setIsPopupOpen(false)
    }

    const handleConfirmPopup = () => {
        setIsPopupOpen(false)
        onConfirm()
    }

    return (
         <div>
            {isPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <h2>Confirm Delete Account</h2>
                        <p>Are you sure you want to delete your account? This action cannot be undone.</p>

                        <Link className='warning-button link-button' onClick={handleConfirmPopup} to={Path.ACCOUNT_DELETE_CONFIRMATION}>Yes, Delete</Link>
                        <button onClick={handleClosePopup}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    )
}

PopupDeleteAccount.propTypes = {
    isPopupOpen: PropTypes.bool.isRequired,
    setIsPopupOpen: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
}

export default PopupDeleteAccount