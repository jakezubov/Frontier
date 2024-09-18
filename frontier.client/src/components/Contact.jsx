import PropTypes from 'prop-types'
import Axios from 'axios'
import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import URL from '../constants/URLs'
import PopupError from '../popups/PopupError'

const Contact = ({ refresh }) => {
    const { userId } = useContext(UserContext)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    // Popups
    const [successMessage, setSuccessMessage] = useState(' ')
    const [validationMessage, setValidationMessage] = useState(' ')
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)
    const [errorContent, setErrorContent] = useState('')

    useEffect(() => {
        if (userId) loadInformation()
    }, [refresh, userId])

    useEffect(() => {
        setValidationMessage(' ')
        setSuccessMessage(' ')
    }, [name, email, message])

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(String(email).toLowerCase())
    }

    const loadInformation = async () => {
        try {
            const response = await Axios.get(URL.GET_USER(userId));

            setName(`${response.data.firstName} ${response.data.lastName}`)
            setEmail(response.data.email)
        }
        catch (error) {
            console.error({
                message: 'Failed to get sidebar user info',
                error: error.message,
                stack: error.stack,
                userId,
            })
            setErrorContent('Failed to get sidebar user info\n' + error.message)
            setIsErrorPopupOpen(true)
        }
    }

    const handleSubmit = () => {
        if (!name || !email || !message) {
            setValidationMessage('Please enter all information.')
            return
        }
        else if (!validateEmail(email)) {
            setValidationMessage('Invalid email address.')
            return
        }

        setSuccessMessage('Email has been sent. (not really)')
    }

    return (
        <div>
            <h3>Contact / Feature Request</h3>

            <form>
                <table>
                    <tbody>
                        <tr>
                            <td>Name</td>
                            <td><input className="general-input" value={name} onChange={(e) => setName(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td>Email</td>
                            <td><input className="general-input" value={email} type="email" onChange={(e) => setEmail(e.target.value)} /></td>
                        </tr>
                        <br />
                        <tr>
                            <td>Message</td>
                        </tr>
                        <tr>
                            <td colSpan="2"><textarea className="general-text-area" rows="5" value={message} onChange={(e) => setMessage(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td colSpan="2"><button className="general-button" type="button" onClick={handleSubmit}>Send Email</button></td>
                        </tr>
                        <tr>
                            <td colSpan="2">{validationMessage !== ' ' ? <p className="pre-wrap warning-text">{validationMessage}</p>
                                : <p className="pre-wrap success-text">{successMessage}</p>}</td>
                        </tr>
                        <tr>
                            <td colSpan="2">If you would like to contact the developer to voice any concerns, issues or feature requests, please fill out the form above.</td>
                        </tr>
                    </tbody>
                </table>
            </form>

            {isErrorPopupOpen && (
                <PopupError isPopupOpen={isErrorPopupOpen} setIsPopupOpen={setIsErrorPopupOpen} content={errorContent} />
            )}
        </div>
    )
}

Contact.propTypes = {
    refresh: PropTypes.string,
}

export default Contact