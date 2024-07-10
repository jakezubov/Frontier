import PropTypes from 'prop-types'
import { useEffect } from 'react'

const PopupError = ({ isPopupOpen, setIsPopupOpen, onConfirm, heading, content }) => {
    useEffect(() => {
        if (isPopupOpen) {
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [isPopupOpen])

    const handleConfirmPopup = () => {
        setIsPopupOpen(false)
        onConfirm()
    }

    return (
        <div>
            {isPopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-box-error">
                        <h2>{heading}</h2>
                        <p className="pre-wrap">{content}</p>

                        <button onClick={handleClosePopup} >Cancel</button>
                    </div>
                </div>
            )}
        </div>
    )
}

PopupError.propTypes = {
    isPopupOpen: PropTypes.bool.isRequired,
    setIsPopupOpen: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    heading: PropTypes.string.isRequired,
    content: PropTypes.string,
}

export default PopupError