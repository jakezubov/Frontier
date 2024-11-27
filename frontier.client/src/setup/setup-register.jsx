import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentPage } from '../contexts/current-page-context'
import { useCreateUser, useGetInitialisedStatus } from '../common/APIs'
import { validatePassword, validateEmail } from '../common/validation'
import Path from '../common/paths'
import PasswordRequirements from '../components/password-requirements'

const SetupRegister = ({ onRegisterComplete }) => {
    const navigate = useNavigate()
    const { setCurrentPage, Pages } = useCurrentPage()

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [validationMessage, setValidationMessage] = useState(' ')

    // APIs
    const { createUser } = useCreateUser()
    const { getInitialisedStatus } = useGetInitialisedStatus()

    useEffect(() => {
        setCurrentPage(Pages.SETUP_REGISTER)
        const checkInitialization = async () => {
            const isInitialized = await getInitialisedStatus()
            if (isInitialized) {
                navigate(Path.HOME)
            }
        }
        checkInitialization()
    }, [])

    useEffect(() => {
        setValidationMessage(' ')
    }, [firstName, lastName, email, password, confirmPassword])

    useEffect(() => {
        if (password !== confirmPassword) {
            setValidationMessage('Passwords do not match.')
        }
    }, [password, confirmPassword])

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
            setValidationMessage('Password does not meet complexity requirements.')
            return
        }
        await createUser(firstName, lastName, email, password, true)

        onRegisterComplete()
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
                        <tr>
                            <td colSpan="2"><button className="general-button" onClick={handleSubmit}>Submit</button></td>
                        </tr>
                        <tr>
                            <td colSpan="2">{validationMessage && <p className="pre-wrap warning-text tight-text">{validationMessage}</p>}</td>
                        </tr>
                    </tbody>
                </table>
            </form>
            <br />
            <PasswordRequirements />
        </div>
    )
}

SetupRegister.propTypes = {
    onRegisterComplete: PropTypes.func.isRequired,
}

export default SetupRegister