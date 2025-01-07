import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserSession } from '../contexts/user-context'
import { useValidateUser, useUpdatePassword } from '../common/APIs'
import { validatePassword } from '../common/validation'
import { useCurrentPage } from '../contexts/current-page-context'
import PasswordRequirements from '../components/password-requirements'
import Path from '../common/paths'

const UpdatePassword = () => {
    const { userId, localEmail } = useUserSession()
    const { setCurrentPage, Pages } = useCurrentPage()
    const { loggedInStatus } = useUserSession()
    const navigate = useNavigate()

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setNewConfirmPassword] = useState('')
    const [validationMessage, setValidationMessage] = useState(' ')
    const [successMessage, setSuccessMessage] = useState(' ')

    // APIs
    const { validateUser } = useValidateUser()
    const { updatePassword } = useUpdatePassword()

    useEffect(() => {
        if (userId) {
            setCurrentPage(Pages.UPDATE_PASSWORD)
        }     
    }, [])

    useEffect(() => {
        if (!loggedInStatus) {
            navigate(Path.CONFIRMATION_SCREEN, {
                state: { message: 'You need to be logged in to access that page!' }
            })
        }
    }, [loggedInStatus])

    useEffect(() => {
        setValidationMessage(' ')
        setSuccessMessage(' ')
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
        if (!oldPassword || !newPassword || !confirmNewPassword) {
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
        const validatedUserId = await validateUser(localEmail, oldPassword)

        if (!validatedUserId) {
            setValidationMessage('Old password is incorrect.')
            return
        }
        clearPasswords()
        await updatePassword(userId, localEmail, newPassword)

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

export default UpdatePassword