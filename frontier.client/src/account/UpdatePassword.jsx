import Axios from 'axios'
import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import PopupError from '../components/PopupError'
import URL from '../constants/URLs'

const UpdatePassword = () => {
    const { userId } = useContext(UserContext)
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setNewConfirmPassword] = useState('')

    // Popups
    const [validationMessage, setValidationMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)
    const [errorContent, setErrorContent] = useState('')

    useEffect(() => {
        setValidationMessage('')
        setSuccessMessage('')
        if (newPassword !== confirmNewPassword) {
            setValidationMessage('New Password do not match.')
        }
    }, [oldPassword, newPassword, confirmNewPassword])

    const clearPasswords = () => {
        setOldPassword('')
        setNewPassword('')
        setNewConfirmPassword('')
    }

    const handleSubmit = async () => {
        if (newPassword !== confirmNewPassword) {
            setValidationMessage('New passwords do not match.')
            return
        }
        else if (!oldPassword || !newPassword || !confirmNewPassword) {
            setValidationMessage('Please enter all information.')
            return
        }
        try {
            const user = await Axios.get(URL.GET_USER(userId))
            var userEmail = user.data.email

            const response = await Axios.post(URL.VALIDATE_USER, {
                'Email': userEmail,
                'Password': oldPassword,
            })

            if (!response.data) {
                setValidationMessage('Old password is incorrect.')
                return
            }
            clearPasswords()

            await Axios.put(URL.UPDATE_PASSWORD(userId), {
                'Email': userEmail,
                'Password': newPassword,
            })
            setSuccessMessage('Password has been updated.')
        }
        catch (error) {
            console.error({
                message: 'Failed to save new password',
                error: error.message,
                stack: error.stack,
                userId,
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
            <h1>Update Password</h1>

            <form onKeyDown={handleKeyDown}>
                <table>
                    <tbody>
                        <tr>
                            <td>Old Password</td>
                            <td><input className="general-input" value={oldPassword} type="password" onChange={(e) => setOldPassword(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td>New Password</td>
                            <td><input className="general-input" value={newPassword} type="password" onChange={(e) => setNewPassword(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td>Confirm New Password</td>
                            <td><input className="general-input" value={confirmNewPassword} type="password" onChange={(e) => setNewConfirmPassword(e.target.value)} /></td>
                        </tr>
                    </tbody>
                </table>
                <button className="general-button" type="button" onClick={handleSubmit}>Save Changes</button>
                {validationMessage && <p className="pre-wrap warning-text">{validationMessage}</p>}
                {successMessage && <p className="pre-wrap success-text">{successMessage}</p>}
            </form> 

            {isErrorPopupOpen && (
                <PopupError isPopupOpen={isErrorPopupOpen} setIsPopupOpen={setIsErrorPopupOpen} content={errorContent} />
            )}
        </div>
    )
}

export default UpdatePassword