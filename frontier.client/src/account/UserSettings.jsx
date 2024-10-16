import PropTypes from 'prop-types'
import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import { useGetUser, useCheckEmailExists, useUnverifyAccount, useSendVerification, useUpdateUser } from '../common/APIs'
import DeleteAccountButton from '../components/DeleteAccountButton'
import ClearHistoryButton from '../components/ClearHistoryButton'

const UserSettings = ({ onDelete }) => {
    const { userId } = useContext(UserContext)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [originalEmail, setOriginalEmail] = useState('')
    const [historyAmount, setHistoryAmount] = useState('')
    const [emailChanged, setEmailChanged] = useState(false)
    const [validationMessage, setValidationMessage] = useState(' ')
    const [successMessage, setSuccessMessage] = useState(' ')

    // APIs
    const { getUser } = useGetUser()
    const { updateUser } = useUpdateUser()
    const { checkEmailExists } = useCheckEmailExists()
    const { unverifyAccount } = useUnverifyAccount()
    const { sendVerification } = useSendVerification()

    useEffect(() => {
        loadUser()
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

    const loadUser = async () => {
        const response = await getUser(userId)

        setFirstName(response.firstName)
        setLastName(response.lastName)
        setEmail(response.email)
        setOriginalEmail(response.email)
        setHistoryAmount(response.historyAmount)
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
            const response = await checkEmailExists(email.toLowerCase())

            if (response) {
                setValidationMessage('Email already exists.')
                return
            }
            setSuccessMessage('Updating...')
            await unverifyAccount(originalEmail.toLowerCase())

            await sendVerification(`${firstName} ${lastName}`, email)

            setOriginalEmail(email)
            setEmailChanged(false)
        }
        setSuccessMessage('Updating...')
        await updateUser(userId, firstName, lastName, email, historyAmount)

        setSuccessMessage('Details have been updated')
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
        </div>
    )
}

UserSettings.propTypes = {
    onDelete: PropTypes.func.isRequired,
}

export default UserSettings