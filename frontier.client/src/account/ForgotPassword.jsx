import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Path from '../constants/Paths'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [validationMessage, setValidationMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(() => {
        setValidationMessage('')
        setSuccessMessage('')
    }, [email])

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(String(email).toLowerCase())
    }

    const handleSubmit = () => {
        if (!email) {
            setValidationMessage('Please enter an email.')
            return
        }
        else if (!validateEmail(email)) {
            setValidationMessage('Please enter a valid email address.')
            return
        }

        setSuccessMessage('Email has been sent. (not really)')
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleSubmit()
        }
    }

    return (
        <div>
            <h1>Forgot Password</h1>

            <form onKeyDown={handleKeyDown}>
                <table>
                    <tbody>
                        <tr>
                            <td>Email</td>
                            <td><input className="general-input" value={email} type="email" onChange={(e) => setEmail(e.target.value)} /></td>
                        </tr>
                    </tbody>
                </table>

                <button className="general-button" type="button" onClick={handleSubmit}>Submit</button>
            </form>

            {validationMessage && <p className="pre-wrap warning-text">{validationMessage}</p>}
            {successMessage && <p className="pre-wrap success-text">{successMessage}</p>}

            <table>
                <tbody>
                    <tr>
                        <td><Link className="link-text" to={Path.LOGIN}>Login</Link></td>
                        <td><Link className="link-text" to={Path.REGISTER}>Register</Link></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default ForgotPassword