import PropTypes from 'prop-types'
import Axios from 'axios'
import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import URL from '../constants/URLs'
import PopupError from './PopupError'

const Contact = ({ refresh }) => {
    const { userId } = useContext(UserContext)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    // Error Popup
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)
    const [errorContent, setErrorContent] = useState('')

    useEffect(() => {
        if (userId) loadInformation()
    }, [refresh, userId])

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

    }

    return (
        <div>
            <h3>Contact</h3>
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
                </tbody>
            </table>

            <br />

            <h4>Message</h4>
            <textarea className="general-input" rows="5" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button className="general-button" type="button" onClick={handleSubmit}>Submit</button>

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