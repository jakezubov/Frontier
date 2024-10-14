import Axios from 'axios'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import URL from '../../constants/URLs'
import PopupError from '../../popups/PopupError'

const ResetPassword = () => {
    const [email, setEmail] = useState('')
    const location = useLocation()
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setNewConfirmPassword] = useState('')

    // Popups
    const [validationMessage, setValidationMessage] = useState(' ')
    const [successMessage, setSuccessMessage] = useState(' ')
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)
    const [errorContent, setErrorContent] = useState('')

    useEffect(() => {
        setValidationMessage(' ')
        setSuccessMessage(' ')
        if (newPassword !== confirmNewPassword) {
            setValidationMessage('New Password do not match.')
        }
    }, [newPassword, confirmNewPassword])

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search)
        const emailFromURL = searchParams.get('email')
        setEmail(emailFromURL)
    }, [location])

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/
        return regex.test(String(password));
    }

    const clearPasswords = () => {
        setNewPassword('')
        setNewConfirmPassword('')
    }

    const handleSubmit = async () => {
        if (!newPassword || !confirmNewPassword) {
            setValidationMessage('Please enter all information.')
            return
        }
        else if (newPassword !== confirmNewPassword) {
            setValidationMessage('New passwords do not match.')
            return
        }
        else if (!validatePassword(newPassword)) {
            setValidationMessage('Password must include the following:\n- At least 8 characters\n- An uppercase letter\n- A lowercase letter\n- A number')
            return
        }
        try {
            var response = await Axios.post(URL.CHECK_EMAIL(email))
            if (!response.data) {
                setValidationMessage('No account found with that email.')
                return
            }
            clearPasswords()
            
            await Axios.put(URL.UPDATE_PASSWORD(response.data), {
                'Email': email,
                'Password': newPassword,
            })
            setSuccessMessage('Password has been updated.')
        }
        catch (error) {
            console.error({
                message: 'Failed to save new password',
                error: error.message,
                stack: error.stack,
                email,
            })
            setErrorContent('Failed to save new password\n' + error.message)
            setIsErrorPopupOpen(true)
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleSubmit()
        }
    }

    return (
        <div>
            <h1>Reset Password</h1>

            <form onKeyDown={handleKeyDown}>
                <table>
                    <tbody>
                        <tr>
                            <td>New Password</td>
                            <td><input className="general-input" value={newPassword} type="password" onChange={(e) => setNewPassword(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td>Confirm New Password</td>
                            <td><input className="general-input" value={confirmNewPassword} type="password" onChange={(e) => setNewConfirmPassword(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td colSpan="2"><button className="general-button" type="button" onClick={handleSubmit}>Save Changes</button></td>
                        </tr>
                        <tr>
                            <td colSpan="2">{validationMessage !== ' ' ? <p className="pre-wrap warning-text">{validationMessage}</p>
                                : <p className="pre-wrap success-text">{successMessage}</p>}</td>
                        </tr>
                    </tbody>
                </table>
            </form>

            {isErrorPopupOpen && (
                <PopupError isPopupOpen={isErrorPopupOpen} setIsPopupOpen={setIsErrorPopupOpen} content={errorContent} />
            )}
        </div>
    )
}

export default ResetPassword