import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Path from '../constants/Paths'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        setErrorMessage('')
    }, [email])

    const handleSubmit = () => {
        if (!email) {
            setErrorMessage('Please enter an email.')
            return
        }
    }

    return (
        <div>
            <h1>Forgot Password</h1>
            <table>
                <tbody>
                    <tr>
                        <td>Email</td>
                        <td><input value={email} type="email" onChange={(e) => setEmail(e.target.value)} /></td>
                    </tr>
                </tbody>
            </table>

            <button type="button" onClick={handleSubmit}>Submit</button>
            {errorMessage && <p className="pre-wrap warning-text">{errorMessage}</p>}

            <table>
                <tbody>
                    <tr>
                        <td><Link to={Path.LOGIN}>Login</Link></td>
                        <td><Link to={Path.REGISTER}>Register</Link></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default ForgotPassword