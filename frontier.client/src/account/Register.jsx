import Axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Path from '../constants/Paths'
import URL from '../constants/URLs'
import PopupError from '../popups/PopupError'

const Register = ({ onRegister }) => {
    const navigate = useNavigate()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // Popups
    const [validationMessage, setValidationMessage] = useState(' ')
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)
    const [errorContent, setErrorContent] = useState('')

    useEffect(() => {
        setValidationMessage(' ')
    }, [firstName, lastName, email, password, confirmPassword])

    useEffect(() => {
        if (password !== confirmPassword) {
            setValidationMessage('Passwords do not match.')
        }
    }, [password, confirmPassword])

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(String(email).toLowerCase())
    }

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/
        return regex.test(String(password));
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            setValidationMessage('Please enter all information.')
            return
        }
        else if (!validateEmail(email)) {
            setValidationMessage('Invalid email address.')
            return
        }
        else if (password !== confirmPassword) {
            setValidationMessage('Passwords do not match.')
            return
        }
        else if (!validatePassword(password)) {
            setValidationMessage('Password must include the following:\n- At least 8 characters\n- An uppercase letter\n- A lowercase letter\n- A number')
            return
        }

        try {
            const response = await Axios.post(URL.CHECK_EMAIL(email.toLowerCase()))

            if (response.data) {
                setValidationMessage('Email already exists.')
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
            })
            setErrorContent('Failed to check email\n' + error.message)
            setIsErrorPopupOpen(true)
        }

        try {
            await Axios.post(URL.CREATE_USER, {
                'FirstName': firstName,
                'LastName': lastName,
                'Email': email,
                'PasswordHash': password
            })
            onRegister()
            navigate(Path.CONFIRMATION_SCREEN)
        }
        catch (error) {
            console.error({
                message: 'Failed to create account',
                error: error.message,
                stack: error.stack,
                firstName,
                lastName,
                email,
            })
            setErrorContent('Failed to create account\n' + error.message)
            setIsErrorPopupOpen(true)
        }

        try {
            await Axios.post(URL.VERIFICATION(`${firstName} ${lastName}`, email))
        } catch (error) {
            console.error({
                message: 'Failed to send verification email',
                error: error.message,
                stack: error.stack,
                firstName,
                lastName,
                email,
            })
            setErrorContent('Failed to send verification email\n' + error.message)
            setIsErrorPopupOpen(true)
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleSubmit(event)
        }
    }

    return (
        <div>
            <h1>Register</h1>

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
                    </tbody>
                </table>

                <button className="general-button" onClick={handleSubmit}>Submit</button>
            </form>

            {validationMessage && <p className="pre-wrap warning-text">{validationMessage}</p>}

            <table>
                <tbody>
                    <tr>
                        <td><Link className="link-text" to={Path.LOGIN}>Login</Link></td>
                        <td><Link className="link-text" to={Path.FORGOT_PASSWORD}>Forgot Password</Link></td>
                    </tr>
                </tbody>
            </table>

            {isErrorPopupOpen && (
                <PopupError isPopupOpen={isErrorPopupOpen} setIsPopupOpen={setIsErrorPopupOpen} content={errorContent} />
            )}
        </div>
    )
}

export default Register