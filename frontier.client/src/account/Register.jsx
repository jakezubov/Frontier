import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCheckEmailExists, useCreateUser, useSendRegistration } from '../common/APIs'
import Path from '../common/Paths'

const Register = ({ onRegister }) => {
    const navigate = useNavigate()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [validationMessage, setValidationMessage] = useState(' ')

    // APIs
    const { checkEmailExists } = useCheckEmailExists()
    const { createUser } = useCreateUser()
    const { sendRegistration } = useSendRegistration()

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
        const userId = await checkEmailExists(email.toLowerCase())

        if (userId) {
            setValidationMessage('Email already exists.')
            return
        }
        await createUser(firstName, lastName, email, password)

        await sendRegistration(`${firstName} ${lastName}`, email)

        onRegister()
        navigate(Path.CONFIRMATION_SCREEN)
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
        </div>
    )
}

export default Register