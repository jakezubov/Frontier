import PropTypes from 'prop-types'
import Axios from 'axios'
import { useState, useEffect } from 'react'
import DeleteAccount from '../components/DeleteAccount'
import PopupConfirmation from '../components/PopupConfirmation'
import PopupError from '../components/PopupError'
import URL from '../constants/URLs'

const UserSettings = ({ userId, onDelete }) => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [historyAmount, setHistoryAmount] = useState('')

    // Popups
    const [validationMessage, setValidationMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false)
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)
    const [errorContent, setErrorContent] = useState('')

    useEffect(() => {
        getInfo()
    }, [userId])

    useEffect(() => {
        setValidationMessage('')
        setSuccessMessage('')
    }, [firstName, lastName, email, historyAmount])

    const getInfo = async () => {
        try {
            const response = await Axios.get(URL.GET_USER(userId))

            setFirstName(response.data.firstName)
            setLastName(response.data.lastName)
            setEmail(response.data.email)
            setHistoryAmount(response.data.historyAmount)
        }
        catch (error) {
            console.error({
                message: 'Failed to load user info',
                error: error.message,
                stack: error.stack,
            })
            setErrorContent('Failed to load user info\n' + error.message)
            setIsErrorPopupOpen(true)
        }
    }

    const handleSubmit = async () => {
        if (historyAmount < 0) {
            setValidationMessage('History amount must be greater than zero.')
            return
        }
        else if (!firstName || !lastName || !email || !historyAmount) {
            setValidationMessage('Please enter all information.')
            return
        }
        try {
            await Axios.put(URL.UPDATE_USER(userId), {
                'FirstName': firstName,
                'LastName': lastName,
                'Email': email,
                'PasswordHash': '',
                'HistoryAmount': historyAmount,
            })
            setSuccessMessage('Account details updated.')
        }
        catch (error) {
            console.error({
                message: 'Failed to save user info',
                error: error.message,
                stack: error.stack,
                firstName,
                lastName,
                email,
                historyAmount,
            })
            setErrorContent('Failed to save user info\n' + error.message)
            setIsErrorPopupOpen(true)
        }
        
    }

    const handleClearHistory = async () => {
        try {
            await Axios.delete(URL.DELETE_HISTORY(userId))
            setSuccessMessage('History has been cleared.')
        }
        catch (error) {
            console.error({
                message: 'Failed to clear history',
                error: error.message,
                stack: error.stack,
            })
            setErrorContent('Failed to clear history\n' + error.message)
            setIsErrorPopupOpen(true)
        }
    }

    return (
        <div>
            <h1>User Settings</h1>
            <table>
                <tbody>
                    <tr>
                        <td>First Name</td>
                        <td><input value={firstName} onChange={(e) => setFirstName(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Last Name</td>
                        <td><input value={lastName} onChange={(e) => setLastName(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td><input value={email} type="email" onChange={(e) => setEmail(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>History Amount</td>
                        <td><input type="number" step="5" min="5" max="20" value={historyAmount} onChange={(e) => setHistoryAmount(e.target.value)} /></td>
                    </tr>
                </tbody>
            </table>
            <button type="button" onClick={handleSubmit}>Save Changes</button>
            <button type="button" onClick={() => setIsConfirmationPopupOpen(true)}>Clear History</button>
            {validationMessage && <p className="pre-wrap warning-text">{validationMessage}</p>}
            {successMessage && <p className="pre-wrap success-text">{successMessage}</p>}

            <DeleteAccount userId={userId} onDelete={onDelete} />

            {isConfirmationPopupOpen && (
                <PopupConfirmation isPopupOpen={isConfirmationPopupOpen} setIsPopupOpen={setIsConfirmationPopupOpen} onConfirm={handleClearHistory} heading="Are you sure?" />
            )}

            {isErrorPopupOpen && (
                <PopupError isPopupOpen={isErrorPopupOpen} setIsPopupOpen={setIsErrorPopupOpen} content={errorContent} />
            )}
        </div>
    )
}

UserSettings.propTypes = {
    userId: PropTypes.string.isRequired,
}

export default UserSettings