import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useCheckEmailExists, useUpdatePassword } from '../../common/APIs'
import { validatePassword } from '../../common/Validation'
import { useCurrentPage } from '../../contexts/CurrentPageContext'
import PasswordRequirements from '../../components/PasswordRequirements'

const ResetPassword = () => {
    const { setCurrentPage, Pages } = useCurrentPage()
    const location = useLocation()

    const [email, setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setNewConfirmPassword] = useState('')
    const [validationMessage, setValidationMessage] = useState(' ')
    const [successMessage, setSuccessMessage] = useState(' ')

    // APIs
    const { checkEmailExists } = useCheckEmailExists()
    const { updatePassword } = useUpdatePassword()

    useEffect(() => {
        setCurrentPage(Pages.RESET_PASSWORD)
    }, [])

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
            setValidationMessage('Password does not meet complexity requirements.')
            return
        }
        const userId = await checkEmailExists(email)

        if (!userId) {
            setValidationMessage('No account found with that email.')
            return
        }
        clearPasswords()
        await updatePassword(userId, email, newPassword)

        setSuccessMessage('Password has been updated.')
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
                            <td colSpan="2">{validationMessage !== ' ' ? <p className="pre-wrap warning-text tight-top">{validationMessage}</p>
                                : <p className="pre-wrap success-text tight-top">{successMessage}</p>}</td>
                        </tr>
                    </tbody>
                </table>
            </form>
            <PasswordRequirements />
        </div>
    )
}

export default ResetPassword