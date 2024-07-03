import PropTypes from 'prop-types'
import Axios from 'axios'
import { useState, useEffect } from 'react'
import URL from '../constants/URLs'

const Contact = ({ userId, refresh }) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    useEffect(() => {
        if (userId) loadInformation()
    }, [refresh])

    const loadInformation = async () => {
        try {
            const response = await Axios.get(URL.GET_USER(userId));

            setName(`${response.data.firstName} ${response.data.lastName}`)
            setEmail(response.data.email)
        }
        catch (error) {
            console.log(error)
            alert('There was an error getting the user info in the sidebar!')
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
                        <td><input value={name} onChange={(e) => setName(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td><input value={email} type="email" onChange={(e) => setEmail(e.target.value)} /></td>
                    </tr>
                </tbody>
            </table>
            <br />
            <table>
                <tbody>
                    <tr><td>Message</td></tr>
                    <tr><td><textarea rows="5" value={message} onChange={(e) => setMessage(e.target.value)} /></td></tr>
                    <tr><td><button type="button" onClick={handleSubmit}>Submit</button></td></tr>
                </tbody>
            </table>
        </div>
    )
}

Contact.propTypes = {
    userId: PropTypes.string,
    refresh: PropTypes.string,
}

export default Contact