import Axios from 'axios'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Path from '../constants/Paths'
import URL from '../constants/URLs'

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        setErrorMessage('')
    }, [email, password])

    const handleSubmit = async () => {
        if (email === '' || password === '') {
            setErrorMessage('Please enter all information.')
            return
        }

        try {
            const response = await Axios.post(URL.VALIDATE_USER, { email, password })
            if (!response.data) {
                setErrorMessage('Email and/or Password is incorrect.')
                return
            }

            alert('Successfully logged in!')
            onLogin(response.data) // Pass the user ID to the callback function
        }
        catch (error) {
            console.error({
                message: 'Failed to login',
                error: error.message,
                stack: error.stack,
                email,
            })
            alert('There was an error logging in!')
        }
    }

    return (
            <div>
                <h1>Login</h1>
                <table>
                    <tbody>
                        <tr>
                            <td>Email</td>
                            <td><input value={email} type="email" onChange={(e) => setEmail(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td>Password</td>
                            <td><input value={password} type="password" onChange={(e) => setPassword(e.target.value)} /></td>
                        </tr>
                    </tbody>
                </table>

                <button type="button" onClick={handleSubmit}>Submit</button>
                {errorMessage && <p className="pre-wrap warning-text">{errorMessage}</p>}

                <table>
                    <tbody>
                        <tr>
                            <td><Link to={Path.REGISTER}>Register</Link></td>
                            <td><Link to={Path.FORGOT_PASSWORD}>Forgot Password</Link></td>
                        </tr>
                    </tbody>
                </table>
            </div>
    )
}

export default Login