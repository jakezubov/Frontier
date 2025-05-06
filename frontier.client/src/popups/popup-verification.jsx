import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useCheckVerificationCode } from '../APIs/email'

const PopupVerification = ({ isPopupOpen, setIsPopupOpen, onVerify, onCancel, email }) => {
    const [validationMessage, setValidationMessage] = useState(' ')
    const [code, setCode] = useState('')

    // APIs
    const { checkVerificationCode } = useCheckVerificationCode()

    useEffect(() => {
        setValidationMessage(' ')
    }, [code])

    const handleClosePopup = () => {
        setIsPopupOpen(false)
        onCancel()
    }

    const handleConfirmPopup = async () => {
        const response = await checkVerificationCode(email, code)
        if (response != null && response.status !== 200) {
            setValidationMessage('Code is incorrect.')
            return
        }
        setIsPopupOpen(false)
        onVerify()
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
                        <h2>Verify Email</h2>
                        <p className="pre-wrap">Please enter the code to verify your email and create your account.</p>
                        <input className="popup-code-input" value={code} maxLength="6" onChange={(e) => setCode(e.target.value)} />
                        
                        {validationMessage && <p className="pre-wrap warning-text">{validationMessage}</p>}

                        <button className="general-button" onClick={handleConfirmPopup} >Submit</button>
                        <button className="general-button" onClick={handleClosePopup} >Cancel</button>
                    </div>
                </div>
            )}
        </div>
    )
}

PopupVerification.propTypes = {
    isPopupOpen: PropTypes.bool.isRequired,
    setIsPopupOpen: PropTypes.func.isRequired,
    onVerify: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired,
}

export default PopupVerification