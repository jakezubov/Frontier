import Axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Path from '../constants/Paths'
import URL from '../constants/URLs'
import PopupError from '../components/PopupError'

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // Popups
    const [validationMessage, setValidationMessage] = useState('')
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)
    const [errorContent, setErrorContent] = useState('')

    useEffect(() => {
        setValidationMessage('')
    }, [email, password])

    const handleSubmit = async () => {
        if (!email || !password) {
            setValidationMessage('Please enter all information.')
            return
        }

        try {
            const response = await Axios.post(URL.VALIDATE_USER, { email, password })
            if (!response.data) {
                setValidationMessage('Email and/or Password is incorrect.')
                return
            }
            onLogin(response.data)
        }
        catch (error) {
            console.error({
                message: 'Failed to login',
                error: error.message,
                stack: error.stack,
                email,
            })
            setErrorContent('Failed to login\n' + error.message)
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
            <h1>Login</h1>

            <form onKeyDown={handleKeyDown}>
                <table>
                    <tbody>
                        <tr>
                            <td>Email</td>
                            <td><input className="general-input" value={email} type="email" onChange={(e) => setEmail(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td>Password</td>
                            <td><input className="general-input" value={password} type="password" onChange={(e) => setPassword(e.target.value)} /></td>
                        </tr>
                    </tbody>
                </table>

                <button className="general-button" type="button" onClick={handleSubmit}>Submit</button>
                {validationMessage && <p className="pre-wrap warning-text">{validationMessage}</p>}
            </form>
                
            <table>
                <tbody>
                    <tr>
                        <td><Link className="link-text" to={Path.REGISTER}>Register</Link></td>
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

export default Login