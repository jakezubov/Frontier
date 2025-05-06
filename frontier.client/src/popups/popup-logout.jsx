import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import Path from '../consts/paths'

const PopupLogout = ({ isPopupOpen, setIsPopupOpen, onConfirm, }) => {
    const navigate = useNavigate()

    const handleClosePopup = () => {
        setIsPopupOpen(false)
    }

    const handleConfirmPopup = () => {
        setIsPopupOpen(false)
        onConfirm()
        navigate(Path.CONFIRMATION_SCREEN)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleConfirmPopup(event)
        }
    }

    return (
        <div>
            {isPopupOpen && (
                <div className="popup-overlay" onKeyDown={handleKeyDown} >
                    <div className="popup-box">
                        <h2>Are you sure you want to Logout?</h2>

                        <button className="general-button" onClick={handleConfirmPopup}>Yes, Logout</button>
                        <button className="general-button" onClick={handleClosePopup}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    )
}

PopupLogout.propTypes = {
    isPopupOpen: PropTypes.bool.isRequired,
    setIsPopupOpen: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
}

export default PopupLogout