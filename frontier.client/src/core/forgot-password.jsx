import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCheckEmailExists, useSendPasswordReset } from '../common/APIs'
import { validateEmail } from '../common/validation'
import { useCurrentPage } from '../contexts/current-page-context'
import Path from '../common/paths'

const ForgotPassword = () => {
    const { setCurrentPage, Pages } = useCurrentPage()

    const [email, setEmail] = useState('')
    const [validationMessage, setValidationMessage] = useState(' ')
    const [successMessage, setSuccessMessage] = useState(' ')

    // APIs
    const { checkEmailExists } = useCheckEmailExists()
    const { sendPasswordReset } = useSendPasswordReset()

    useEffect(() => {
        setCurrentPage(Pages.FORGOT_PASSWORD)
    }, [])

    useEffect(() => {
        setValidationMessage(' ')
        setSuccessMessage(' ')
    }, [email])

    const handleSubmit = async () => {
        if (!email) {
            setValidationMessage('Please enter an email.')
            return
        }
        else if (!validateEmail(email)) {
            setValidationMessage('Please enter a valid email address.')
            return
        }
        const userId = await checkEmailExists(email)

        if (!userId) {
            setValidationMessage('No account found with that email.')
            return
        }
        setSuccessMessage("Sending...")
        await sendPasswordReset(email)

        setSuccessMessage('Email has been sent.')
        setValidationMessage(' ')
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
                            <td className="tight-top" colSpan="3">{validationMessage !== ' ' ? <p className="pre-wrap warning-text tight-top">{validationMessage}</p>
                                : <p className="pre-wrap success-text tight-top">{successMessage}</p>}</td>
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