import { useState, useEffect } from 'react'
import { useUserSession } from '../contexts/UserContext'
import { useCheckEmailExists, useUnverifyAccount, useSendVerification, useUpdateUser } from '../common/APIs'
import { validateEmail } from '../common/Validation'
import { useCurrentPage } from '../contexts/CurrentPageContext'
import DeleteAccountButton from '../components/DeleteAccountButton'
import ClearHistoryButton from '../components/ClearHistoryButton'

const UserSettings = () => {
    const { userId, verifiedStatus, localFirstName, localLastName, localEmail, localHistoryAmount, updateUserSession } = useUserSession()
    const { setCurrentPage, Pages } = useCurrentPage()
    
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [originalEmail, setOriginalEmail] = useState('')
    const [historyAmount, setHistoryAmount] = useState('')
    const [emailChanged, setEmailChanged] = useState(false)
    const [validationMessage, setValidationMessage] = useState(' ')
    const [successMessage, setSuccessMessage] = useState(' ')

    // APIs
    const { updateUser } = useUpdateUser()
    const { checkEmailExists } = useCheckEmailExists()
    const { unverifyAccount } = useUnverifyAccount()
    const { sendVerification } = useSendVerification()

    useEffect(() => {
        if (userId) {
            setCurrentPage(Pages.USER_SETTINGS)
            loadUser()
        }
    }, [])

    useEffect(() => {
        setValidationMessage(' ')
        setSuccessMessage(' ')
        if (email.toLowerCase() != originalEmail) {
            setEmailChanged(true)
        }
    }, [firstName, lastName, email, historyAmount])

    const loadUser = async () => {
        setFirstName(localFirstName)
        setLastName(localLastName)
        setEmail(localEmail)
        setOriginalEmail(localEmail)
        setHistoryAmount(localHistoryAmount)
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
        await updateUserSession()
    }

    const handleSendVerification = async () => {
        await sendVerification(`${firstName} ${lastName}`, email)
        setSuccessMessage('Email has been sent.')
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
                            <td colSpan="2">{validationMessage !== ' ' ? <p className="pre-wrap warning-text tight-text">{validationMessage}</p>
                                : <p className="pre-wrap success-text tight-text">{successMessage}</p>}</td>
                        </tr>
                    </tbody>
                </table>
            </form>

            <table>
                <tbody>
                    <tr>
                        <td><ClearHistoryButton onSuccess={setSuccessMessage} /></td>
                        <td><DeleteAccountButton /></td>
                        {!verifiedStatus ?
                            <td><button className="general-button" type="button" onClick={handleSendVerification}>Verifiy Email</button></td>
                            : null
                        }
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default UserSettings