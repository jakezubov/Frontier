import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCheckEmailExists, useCreateUser, useSendRegistration } from '../common/APIs'
import { validatePassword, validateEmail } from '../common/validation'
import { useCurrentPage } from '../contexts/current-page-context'
import Path from '../common/paths'
import PasswordRequirements from '../components/password-requirements'
import PopupVerification from '../popups/popup-verification'

const Register = () => {
    const navigate = useNavigate()
    const { setCurrentPage, Pages } = useCurrentPage()

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [validationMessage, setValidationMessage] = useState(' ')
    const [isVerificationPopupOpen, setIsVerificationPopupOpen] = useState(false)
    const [isSendingEmail, setIsSendingEmail] = useState(false)

    // APIs
    const { checkEmailExists } = useCheckEmailExists()
    const { createUser } = useCreateUser()
    const { sendRegistration } = useSendRegistration()

    useEffect(() => {
        setCurrentPage(Pages.REGISTER)
    }, [])

    useEffect(() => {
        setValidationMessage(' ')
    }, [firstName, lastName, email, password, confirmPassword])

    useEffect(() => {
        if (password !== confirmPassword) {
            setValidationMessage('Passwords do not match.')
        }
    }, [password, confirmPassword])

    const handleChecks = async (event) => {
        event.preventDefault()
        setValidationMessage(' ')
        setIsSendingEmail(true)

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            setValidationMessage('Please enter all information.')
            setIsSendingEmail(false)
            return
        }
        else if (!validateEmail(email)) {
            setValidationMessage('Invalid email address.')
            setIsSendingEmail(false)
            return
        }
        else if (password !== confirmPassword) {
            setValidationMessage('Passwords do not match.')
            setIsSendingEmail(false)
            return
        }
        else if (!validatePassword(password)) {
            setValidationMessage('Password does not meet complexity requirements.')
            setIsSendingEmail(false)
            return
        }
        const userId = await checkEmailExists(email.toLowerCase())

        if (userId) {
            setValidationMessage('Email already exists.')
            setIsSendingEmail(false)
            return
        }
        await sendRegistration(`${firstName} ${lastName}`, email)

        setIsVerificationPopupOpen(true)
        setIsSendingEmail(false)
    }

    const handleSubmit = async () => {
        const response = await createUser(firstName, lastName, email, password)
        if (!response) {
            setValidationMessage('User was not created.')
            return
        }

        navigate(Path.CONFIRMATION_SCREEN, {
            state: { message: 'Successfully registered account!' }
        })
    }

    const handleCancel = () => {
        setValidationMessage('Must verify email to register.')
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleChecks(event)
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
                            <td>Password</td>
                            <td><input className="general-input" value={password} type="password" onChange={(e) => setPassword(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td>Confirm Password</td>
                            <td><input className="general-input" value={confirmPassword} type="password" onChange={(e) => setConfirmPassword(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td className="tight-bottom" colSpan="2"><button className="general-button" onClick={handleChecks}>Submit</button></td>
                        </tr>
                        <tr>
                            <td className="message-container" colSpan="2">
                                {validationMessage !== ' ' ?
                                    <p className="pre-wrap warning-text">{validationMessage}</p>
                                    : isSendingEmail && <div className="email-loader-container tight-top"><div className="email-loader"></div></div>
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
            
            <PasswordRequirements />
            <br />
            <table>
                <tbody>
                    <tr>
                        <td><Link className="link-text" to={Path.LOGIN}>Login</Link></td>
                        <td><Link className="link-text" to={Path.FORGOT_PASSWORD}>Forgot Password</Link></td>
                    </tr>
                </tbody>
            </table>

            {isVerificationPopupOpen && (
                <PopupVerification isPopupOpen={isVerificationPopupOpen} setIsPopupOpen={setIsVerificationPopupOpen} onVerify={handleSubmit} onCancel={handleCancel} email={email} />
            )}
        </div>
    )
}

export default Register