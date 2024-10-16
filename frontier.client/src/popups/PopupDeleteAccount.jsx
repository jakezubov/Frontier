import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import Path from '../common/Paths'

const PopupDeleteAccount = ({ isPopupOpen, setIsPopupOpen, onConfirm, }) => {
    const navigate = useNavigate()

    const handleClosePopup = () => {
        setIsPopupOpen(false)
    }

    const handleConfirmPopup = () => {
        setIsPopupOpen(false)
        onConfirm()
        navigate(Path.CONFIRMATION_SCREEN)
    }

    return (
         <div>
            {isPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <h2>Confirm Delete Account</h2>
                        <p>Are you sure you want to delete your account? This action cannot be undone.</p>

                        <button className="warning-button" onClick={handleConfirmPopup}>Yes, Delete</button>
                        <button className="general-button" onClick={handleClosePopup}>Cancel</button>
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