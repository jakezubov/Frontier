import PropTypes from 'prop-types'

const PopupConfirmation = ({ isPopupOpen, setIsPopupOpen, onConfirm, heading, content }) => {
    const handleClosePopup = () => {
        setIsPopupOpen(false)
    }

    const handleConfirmPopup = () => {
        setIsPopupOpen(false)
        onConfirm()
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
                <div className="popup-overlay" onKeyDown={handleKeyDown}>
                    <div className="popup-box">
                        <h2>{heading}</h2>
                        <p className="pre-wrap">{content}</p>

                        <button className="general-button" onClick={handleConfirmPopup} >Confirm</button>
                        <button className="general-button" onClick={handleClosePopup} >Cancel</button>
                    </div>
                </div>
            )}
        </div>
    )
}

PopupConfirmation.propTypes = {
    isPopupOpen: PropTypes.bool.isRequired,
    setIsPopupOpen: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    heading: PropTypes.string.isRequired,
    content: PropTypes.string,
}

export default PopupConfirmation