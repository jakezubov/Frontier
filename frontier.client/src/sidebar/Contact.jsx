import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import { useGetUser, useSendContactForm } from '../common/APIs'
import { validateEmail } from '../common/Validation'

const Contact = () => {
    const { userId } = useContext(UserContext)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState(' ')
    const [validationMessage, setValidationMessage] = useState(' ')

    // APIs
    const { getUser } = useGetUser()
    const { sendContactForm } = useSendContactForm()

    useEffect(() => {
        if (userId) loadInformation()
    }, [userId])

    useEffect(() => {
        setValidationMessage(' ')
        setSuccessMessage(' ')
    }, [name, email, message])

    const loadInformation = async () => {
        const user = await getUser(userId)

        setName(`${user.firstName} ${user.lastName}`)
        setEmail(user.email)
    }

    const handleSubmit = async () => {
        if (!name || !email || !message) {
            setValidationMessage('Please enter all information.')
            return
        }
        else if (!validateEmail(email)) {
            setValidationMessage('Invalid email address.')
            return
        }
        setSuccessMessage('Sending...')
        await sendContactForm(name, email, message)

        setSuccessMessage('Email has been sent.')
    }

    return (
        <div>
            <h3>Contact / Feature Request</h3>

            <form>
                <table>
                    <tbody>
                        <tr>
                            <td className="break-bottom" colSpan="2">If you would like to contact the developer to voice any concerns, issues or feature requests, please fill out the form below.</td>
                        </tr>
                        <tr>
                            <td>Name</td>
                            <td><input className="general-input" value={name} onChange={(e) => setName(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td>Email</td>
                            <td><input className="general-input" value={email} type="email" onChange={(e) => setEmail(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td className="break-top" colSpan="2">Message</td>
                        </tr>
                        <tr>
                            <td colSpan="2"><textarea className="general-text-area" rows="5" value={message} onChange={(e) => setMessage(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td colSpan="2"><button className="general-button" type="button" onClick={handleSubmit}>Send Email</button></td>
                        </tr>
                        <tr>
                            <td colSpan="2">{validationMessage !== ' ' ? <p className="pre-wrap warning-text tight-top">{validationMessage}</p>
                                : <p className="pre-wrap success-text tight-top">{successMessage}</p>}</td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    )
}

export default Contact