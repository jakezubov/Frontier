import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useLoginUser } from '../APIs/auth'
import { useUserSession } from '../contexts/user-context'
import { useCurrentPage } from '../contexts/current-page-context'
import Path from '../consts/paths'

const Login = () => {
    const navigate = useNavigate()
    const { setCurrentPage, Pages, isEmailSetup } = useCurrentPage()
    const { setUserId, setUserToken } = useUserSession()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [validationMessage, setValidationMessage] = useState(' ')

    // APIs
    const { loginUser } = useLoginUser()

    useEffect(() => {
        setCurrentPage(Pages.LOGIN)
    }, [])

    useEffect(() => {
        setValidationMessage(' ')
    }, [email, password])

    const handleSubmit = async () => {
        if (!email || !password) {
            setValidationMessage('Please enter all information.')
            return
        }
        const response = await loginUser(email, password)

        if (!response) {
            setValidationMessage('Email and/or Password is incorrect.')
            return
        }
        setUserToken(response.token)
        setUserId(response.userId)
        navigate(Path.CONFIRMATION_SCREEN, {
            state: { message: 'Successfully logged in!' }
        })
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleSubmit()
        }
    }

    return (
        <div className="flex-container row">
            <form className="login-register-container" onKeyDown={handleKeyDown}>
                <table>
                    <thead>
                        <tr>
                            <th colSpan="2"><h2>Login</h2></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Email</td>
                            <td><input className="general-input" value={email} type="email" onChange={(e) => setEmail(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td>Password</td>
                            <td><input className="general-input" value={password} type="password" onChange={(e) => setPassword(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <button className="general-button" type="button" onClick={handleSubmit}>Login</button>
                                {validationMessage && <p className="pre-wrap warning-text tight-top">{validationMessage}</p>}
                            </td>
                        </tr>
                        {isEmailSetup === "true" &&
                            <tr>
                                <td colSpan="2"><Link className="link-text" to={Path.FORGOT_PASSWORD}>Forgot Password</Link></td>
                            </tr>
                        }
                    </tbody>
                </table>
            </form>            
        </div>
    )
}

export default Login