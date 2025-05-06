import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserSession } from '../contexts/user-context'
import { useCheckEmailExists, useUpdateUser } from '../APIs/users'
import { useSendVerification } from '../APIs/email'
import { validateEmail } from '../consts/validation'
import { useCurrentPage } from '../contexts/current-page-context'
import DeleteAccountButton from '../components/delete-account-button'
import ClearHistoryButton from '../components/clear-history-button'
import CustomNumberInput from '../components/custom-number-input'
import PopupVerification from '../popups/popup-verification'
import Path from '../consts/paths'

const UserSettings = () => {
    const { userId, localFirstName, localLastName, localEmail, localHistoryAmount, updateUserSession } = useUserSession()
    const { setCurrentPage, Pages, isEmailSetup } = useCurrentPage()
    const { loggedInStatus } = useUserSession()
    const navigate = useNavigate()
    const historyMin = 5
    
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [originalEmail, setOriginalEmail] = useState('')
    const [historyAmount, setHistoryAmount] = useState('')
    const [emailChanged, setEmailChanged] = useState(false)
    const [validationMessage, setValidationMessage] = useState(' ')
    const [successMessage, setSuccessMessage] = useState(' ')
    const [isVerificationPopupOpen, setIsVerificationPopupOpen] = useState(false)
    const [isSendingEmail, setIsSendingEmail] = useState(false)

    // APIs
    const { updateUser } = useUpdateUser()
    const { checkEmailExists } = useCheckEmailExists()
    const { sendVerification } = useSendVerification()

    useEffect(() => {
        if (userId) {
            setCurrentPage(Pages.USER_SETTINGS)
            loadUser()
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
        if (email.toLowerCase() != originalEmail) {
            setEmailChanged(true)
        }
        else {
            setEmailChanged(false)
        }
    }, [firstName, lastName, email, historyAmount])

    const loadUser = async () => {
        setFirstName(localFirstName)
        setLastName(localLastName)
        setEmail(localEmail)
        setOriginalEmail(localEmail)
        setHistoryAmount(localHistoryAmount)
    }

    const handleChecks = async () => {
        setValidationMessage(' ')
        setIsSendingEmail(true)

        if (!firstName || !lastName || !email || !historyAmount) {
            setValidationMessage('Please enter all information.')
            setIsSendingEmail(false)
            return
        }
        else if (!validateEmail(email)) {
            setValidationMessage('Invalid email address.')
            setIsSendingEmail(false)
            return
        }
        else if (historyAmount <= 0) {
            setValidationMessage('History amount must be greater than zero.')
            setIsSendingEmail(false)
            return
        }

        if (emailChanged) {
            const response = await checkEmailExists(email.toLowerCase())

            if (response) {
                setValidationMessage('Email already exists.')
                setIsSendingEmail(false)
                return
            }
            if (isEmailSetup === "true") {
                await sendVerification(`${firstName} ${lastName}`, email)

                setIsVerificationPopupOpen(true)
                setIsSendingEmail(false)
            }
            else {
                setIsSendingEmail(false)
                handleSubmit()
            }
        }
        else {
            setIsSendingEmail(false)
            handleSubmit()
        }
    }

    const handleSubmit = async () => {
        if (emailChanged) {
            setOriginalEmail(email)
            setEmailChanged(false)
        }
        setSuccessMessage('Updating...')
        await updateUser(userId, firstName, lastName, email, historyAmount)

        setSuccessMessage('Details have been updated')
        await updateUserSession()
    }

    const handleCancel = () => {
        setValidationMessage('Must verify to save new email.')
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
                            <td><CustomNumberInput step={historyMin} min={historyMin} startingNumber={localHistoryAmount} onChange={(value) => setHistoryAmount(value)} /></td>
                        </tr>
                        <tr>
                            <td colSpan="2"><button className="general-button" type="button" onClick={handleChecks}>Save Changes</button></td>
                        </tr>
                        <tr>
                            <td className="message-container" colSpan="2">
                                {validationMessage !== ' ' ?
                                    <p className="pre-wrap warning-text tight-top">{validationMessage}</p>
                                    : successMessage !== ' ' ?
                                        <p className="pre-wrap success-text tight-top">{successMessage}</p>
                                        : isSendingEmail && isEmailSetup === "true" && <div className="email-loader-container"><div className="email-loader"></div></div>
                                }
                            </td>
                        </tr>
                        <tr>
                            <td><ClearHistoryButton onSuccess={setSuccessMessage} /></td>
                            <td><DeleteAccountButton /></td>
                        </tr>
                    </tbody>
                </table>
            </form>

            {isVerificationPopupOpen && (
                <PopupVerification isPopupOpen={isVerificationPopupOpen} setIsPopupOpen={setIsVerificationPopupOpen} onVerify={handleSubmit} onCancel={handleCancel} email={email} />
            )}
        </div>
    )
}

export default UserSettings