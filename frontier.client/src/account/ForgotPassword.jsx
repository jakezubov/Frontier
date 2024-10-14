import Axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Path from '../constants/Paths'
import URL from '../constants/URLs'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [validationMessage, setValidationMessage] = useState(' ')
    const [successMessage, setSuccessMessage] = useState(' ')

    useEffect(() => {
        setValidationMessage(' ')
        setSuccessMessage(' ')
    }, [email])

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(String(email).toLowerCase())
    }

    const handleSubmit = async () => {
        if (!email) {
            setValidationMessage('Please enter an email.')
            return
        }
        else if (!validateEmail(email)) {
            setValidationMessage('Please enter a valid email address.')
            return
        }
        try {

            var response = await Axios.post(URL.CHECK_EMAIL(email))
            if (!response.data) {
                setValidationMessage('No account found with that email.')
                return
            }

            setSuccessMessage("Sending...")
            await Axios.post(URL.PASSWORD_RESET(email))
            setSuccessMessage('Email has been sent.')
            setValidationMessage(' ')
        } catch (error) {
            console.error({
                message: 'Failed to send password reset email',
                error: error.message,
                stack: error.stack,
                email,
            })
            setErrorContent('Failed to send password reset email\n' + error.message)
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
            <h1>Forgot Password</h1>

            <form onKeyDown={handleKeyDown}>
                <table>
                    <tbody>
                        <tr>
                            <td>Email</td>
                            <td><input className="general-input" value={email} type="email" onChange={(e) => setEmail(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td colSpan="2"><button className="general-button" type="button" onClick={handleSubmit}>Submit</button></td>
                        </tr>
                        <tr>
                            <td colSpan="3">{validationMessage !== ' ' ? <p className="pre-wrap warning-text">{validationMessage}</p>
                                : <p className="pre-wrap success-text">{successMessage}</p>}</td>
                        </tr>
                    </tbody>
                </table>
            </form>

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