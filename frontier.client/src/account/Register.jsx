import Axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Path from '../constants/Paths'
import URL from '../constants/URLs'
import PopupError from '../components/PopupError'

const Register = ({ onRegister }) => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // Popups
    const [validationMessage, setValidationMessage] = useState('')
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)
    const [errorContent, setErrorContent] = useState('')

    useEffect(() => {
        setValidationMessage('')
    }, [firstName, lastName, email, password, confirmPassword])

    useEffect(() => {
        if (password !== confirmPassword) {
            setValidationMessage('Passwords do not match.')
        }
    }, [password, confirmPassword])

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            setValidationMessage('Passwords do not match.')
            return
        }
        else if (!firstName || !lastName || !email || !password || !confirmPassword) {
            setValidationMessage('Please enter all information.')
            return
        }

        try {
            await Axios.post(URL.CREATE_USER, {
                'FirstName': firstName,
                'LastName': lastName,
                'Email': email,
                'PasswordHash': password
            })
            onRegister()
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
    }

    return (
        <div>
            <h1>Register</h1>
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
                        <td>Password</td>
                        <td><input value={password} type="password" onChange={(e) => setPassword(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Confirm Password</td>
                        <td><input value={confirmPassword} type="password" onChange={(e) => setConfirmPassword(e.target.value)} /></td>
                    </tr>
                </tbody>
            </table>

            <button type="button" onClick={handleSubmit}>Submit</button>
            {validationMessage && <p className="pre-wrap warning-text">{validationMessage}</p>}

            <table>
                <tbody>
                    <tr>
                        <td><Link to={Path.LOGIN}>Login</Link></td>
                        <td><Link to={Path.FORGOT_PASSWORD}>Forgot Password</Link></td>
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