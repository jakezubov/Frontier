import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useValidateUser, useLogLogin } from '../common/APIs'
import Path from '../common/Paths'

const Login = ({ onLogin }) => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [validationMessage, setValidationMessage] = useState(' ')

    // APIs
    const { validateUser } = useValidateUser()
    const { logLogin } = useLogLogin()

    useEffect(() => {
        setValidationMessage(' ')
    }, [email, password])

    const handleSubmit = async () => {
        if (!email || !password) {
            setValidationMessage('Please enter all information.')
            return
        }
        const userId = await validateUser(email, password)

        if (!userId) {
            setValidationMessage('Email and/or Password is incorrect.')
            return
        }
        await logLogin(userId)

        onLogin(userId)
        navigate(Path.CONFIRMATION_SCREEN)
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
            </form>

            {validationMessage && <p className="pre-wrap warning-text">{validationMessage}</p>}
                
            <table>
                <tbody>
                    <tr>
                        <td><Link className="link-text" to={Path.REGISTER}>Register</Link></td>
                        <td><Link className="link-text" to={Path.FORGOT_PASSWORD}>Forgot Password</Link></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Login