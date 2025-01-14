import PropTypes from 'prop-types'

const PopupDeleteAccount = ({ isPopupOpen, setIsPopupOpen, onConfirm, }) => {
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
                        <p>Are you sure you want to delete the account? This action cannot be undone.</p>

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