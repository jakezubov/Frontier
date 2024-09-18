import PropTypes from 'prop-types'
import Axios from 'axios'
import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import DeleteAccountButton from '../components/DeleteAccountButton'
import ClearHistoryButton from '../components/ClearHistoryButton'
import PopupError from '../popups/PopupError'
import URL from '../constants/URLs'

const UserSettings = ({ onDelete }) => {
    const { userId } = useContext(UserContext)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [originalEmail, setOriginalEmail] = useState('')
    const [historyAmount, setHistoryAmount] = useState('')
    const [emailChanged, setEmailChanged] = useState(false)

    // Popups
    const [validationMessage, setValidationMessage] = useState(' ')
    const [successMessage, setSuccessMessage] = useState(' ')
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)
    const [errorContent, setErrorContent] = useState('')

    useEffect(() => {
        getInfo()
    }, [userId])

    useEffect(() => {
        setValidationMessage(' ')
        setSuccessMessage(' ')
        if (email.toLowerCase() != originalEmail) {
            setEmailChanged(true)
        }
    }, [firstName, lastName, email, historyAmount])

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(String(email).toLowerCase())
    }

    const getInfo = async () => {
        try {
            const response = await Axios.get(URL.GET_USER(userId))

            setFirstName(response.data.firstName)
            setLastName(response.data.lastName)
            setEmail(response.data.email)
            setOriginalEmail(response.data.email)
            setHistoryAmount(response.data.historyAmount)
        }
        catch (error) {
            console.error({
                message: 'Failed to load user info',
                error: error.message,
                stack: error.stack,
                userId,
            })
            setErrorContent('Failed to load user info\n' + error.message)
            setIsErrorPopupOpen(true)
        }
    }

    const handleSubmit = async () => {
        if (!firstName || !lastName || !email || !historyAmount) {
            setValidationMessage('Please enter all information.')
            return
        }
        else if (!validateEmail(email)) {
            setValidationMessage('Invalid email address.')
            return
        }
        else if (historyAmount < 0) {
            setValidationMessage('History amount must be greater than zero.')
            return
        }

        if (emailChanged) {
            try {
                const response = await Axios.post(URL.CHECK_EMAIL(email.toLowerCase()))

                if (response.data) {
                    setValidationMessage('Email already exists.')
                    return
                }

                try {
                    await Axios.put(URL.UNVERIFY_EMAIL(originalEmail.toLowerCase()))
                }
                catch (error) {
                    console.error({
                        message: 'Failed to unverify account',
                        error: error.message,
                        stack: error.stack,
                        email,
                    })
                    setErrorContent('Failed to unverify account\n' + error.message)
                    setIsErrorPopupOpen(true)
                    return
                }
            }
            catch (error) {
                console.error({
                    message: 'Failed to check email',
                    error: error.message,
                    stack: error.stack,
                    firstName,
                    lastName,
                    email,
                    historyAmount,
                })
                setErrorContent('Failed to check email\n' + error.message)
                setIsErrorPopupOpen(true)
            }
        }

        try {
            await Axios.put(URL.UPDATE_USER(userId), {
                'FirstName': firstName,
                'LastName': lastName,
                'Email': email,
                'PasswordHash': '',
                'HistoryAmount': Math.round(historyAmount),
            })
            setSuccessMessage('Account details updated.')
        }
        catch (error) {
            console.error({
                message: 'Failed to save user info',
                error: error.message,
                stack: error.stack,
                userId,
                firstName,
                lastName,
                email,
                historyAmount,
            })
            setErrorContent('Failed to save user info\n' + error.message)
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
            <h1>User Settings</h1>

            <form onKeyDown={handleKeyDown}>
                <table>
                    <tbody>
                        <tr>
                            <td>First Name</td>
                            <td><input className="general-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td>Last Name</td>
                            <td><input className="general-input" value={lastName} onChange={(e) => setLastName(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td>Email</td>
                            <td><input className="general-input" value={email} type="email" onChange={(e) => setEmail(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td>History Amount</td>
                            <td><input className="general-input" type="number" step="5" min="5" value={historyAmount} onChange={(e) => setHistoryAmount(e.target.value)} /></td>
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

            <table>
                <tbody>
                    <tr>
                        <td><ClearHistoryButton onSuccess={setSuccessMessage} /></td>
                        <td><DeleteAccountButton onDelete={onDelete} /></td>
                    </tr>
                </tbody>
            </table>

            {isErrorPopupOpen && (
                <PopupError isPopupOpen={isErrorPopupOpen} setIsPopupOpen={setIsErrorPopupOpen} content={errorContent} />
            )}
        </div>
    )
}

UserSettings.propTypes = {
    onDelete: PropTypes.func.isRequired,
}

export default UserSettings