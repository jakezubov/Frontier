import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCheckEmailExists } from '../APIs/users'
import { useSendPasswordReset } from '../APIs/email'
import { validateEmail } from '../consts/validation'
import { useCurrentPage } from '../contexts/current-page-context'
import Path from '../consts/paths'

const ForgotPassword = () => {
    const { setCurrentPage, Pages, isEmailSetup } = useCurrentPage()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [validationMessage, setValidationMessage] = useState(' ')
    const [successMessage, setSuccessMessage] = useState(' ')
    const [isSendingEmail, setIsSendingEmail] = useState(false)

    // APIs
    const { checkEmailExists } = useCheckEmailExists()
    const { sendPasswordReset } = useSendPasswordReset()

    useEffect(() => {
        setCurrentPage(Pages.FORGOT_PASSWORD)
    }, [])

    useEffect(() => {
        if (isEmailSetup === "false") {
            navigate(Path.CONFIRMATION_SCREEN, {
                state: { message: 'You can\'t reset your password since emailing is not setup!' }
            })
        }
    }, [isEmailSetup])

    useEffect(() => {
        setValidationMessage(' ')
        setSuccessMessage(' ')
    }, [email])

    const handleSubmit = async () => {
        setSuccessMessage(' ')
        setIsSendingEmail(true)

        if (!email) {
            setValidationMessage('Please enter an email.')
            setIsSendingEmail(false)
            return
        }
        else if (!validateEmail(email)) {
            setValidationMessage('Please enter a valid email address.')
            setIsSendingEmail(false)
            return
        }
        const userId = await checkEmailExists(email)

        if (!userId) {
            setValidationMessage('No account found with that email.')
            setIsSendingEmail(false)
            return
        }
        await sendPasswordReset(email)

        setSuccessMessage('Email has been sent.')
        setValidationMessage(' ')
        setIsSendingEmail(false)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleSubmit()
        }
    }

    return (
        <div>
            <form onKeyDown={handleKeyDown}>
                <table>
                    <tbody>
                        <tr>
                            <td>Email</td>
                            <td><input className="general-input" value={email} type="email" onChange={(e) => setEmail(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td className="tight-bottom" colSpan="2"><button className="general-button" type="button" onClick={handleSubmit}>Submit</button></td>
                        </tr>
                        <tr>
                            <td className="message-container" colSpan="3">
                                {validationMessage !== ' ' ?
                                    <p className="pre-wrap warning-text">{validationMessage}</p>
                                    : successMessage !== ' ' ?
                                        <p className="pre-wrap success-text">{successMessage}</p>
                                        : isSendingEmail && <div className="email-loader-container tight-top"><div className="email-loader"></div></div>
                                }
                            </td>
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