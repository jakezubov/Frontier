import PropTypes from 'prop-types'

const PopupError = ({ isPopupOpen, setIsPopupOpen, content }) => {
    const handleClosePopup = () => {
        setIsPopupOpen(false)
    }

    return (
        <div>
            {isPopupOpen && ( <button className="pre-wrap popup-box popup-box-error" onClick={handleClosePopup}>{content}</button>)}
        </div>
    )
}

PopupError.propTypes = {
    isPopupOpen: PropTypes.bool.isRequired,
    setIsPopupOpen: PropTypes.func.isRequired,
    content: PropTypes.string,
}

export default PopupError