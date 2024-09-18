import Axios from 'axios'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserTie, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import PopupConfirmation from '../popups/PopupConfirmation'
import PopupError from '../popups/PopupError'
import URL from '../constants/URLs'

const UserAccounts = () => {
    const [userList, setUserList] = useState([])

    // Popups
    const [validationMessage, setValidationMessage] = useState(' ')
    const [successMessage, setSuccessMessage] = useState(' ')
    const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false)
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)
    const [errorContent, setErrorContent] = useState('')

    useEffect(() => {
        loadUserList()
    }, [])

    useEffect(() => {
        setValidationMessage(' ')
        setSuccessMessage(' ')
    }, [userList])

    const loadUserList = async () => {
        try {
            const response = await Axios.get(URL.GET_ALL_USERS)
            setUserList(response.data)
        } catch (error) {
            console.error({
                message: 'Failed to load users',
                error: error.message,
                stack: error.stack,
            })
            setErrorContent('Failed to load users\n' + error.message)
            setIsErrorPopupOpen(true)
        }
    }

    const handleSwitchAdmin = async (userId) => {
        try {
            await Axios.put(URL.SWITCH_ADMIN(userId))
            loadUserList()
        } catch (error) {
            console.error({
                message: 'Failed to load users',
                error: error.message,
                stack: error.stack,
                userId,
            })
            setErrorContent('Failed to load users\n' + error.message)
            setIsErrorPopupOpen(true)
        }
    }

    const handleSendVerification = async (userId) => {
        try {
            
        } catch (error) {
            console.error({
                message: 'Failed to send verification email',
                error: error.message,
                stack: error.stack,
                userId,
            })
            setErrorContent('Failed to send verification email\n' + error.message)
            setIsErrorPopupOpen(true)
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleSave()
        }
    }

    return (
        <div>
            <h1>User Accounts</h1>

            <form onKeyDown={handleKeyDown}>
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Verified</th>
                            <th>Admin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList.map(user => (
                            <tr key={user.id}>
                                <td>{user.fullName}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.verifiedTF === true ? "True" : "False"}
                                    {user.verifiedTF === false ? <button className="settings-icon" type="button" onClick={() => handleSendVerification(user.id)}><FontAwesomeIcon className="fa-md" icon={faEnvelope} /></button> : null}
                                </td>
                                <td>
                                    {user.adminTF === true ? "True" : "False"}
                                    <button className="settings-icon" type="button" onClick={() => handleSwitchAdmin(user.id)}><FontAwesomeIcon className="fa-md" icon={faUserTie} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </form>

            {validationMessage !== ' ' ? <p className="pre-wrap warning-text">{validationMessage}</p>
                : <p className="pre-wrap success-text">{successMessage}</p>}

            {isConfirmationPopupOpen && (
                <PopupConfirmation isPopupOpen={isConfirmationPopupOpen} setIsPopupOpen={setIsConfirmationPopupOpen} onConfirm={handleReset} heading="Are you sure?" />
            )}

            {isErrorPopupOpen && (
                <PopupError isPopupOpen={isErrorPopupOpen} setIsPopupOpen={setIsErrorPopupOpen} content={errorContent} />
            )}
        </div >
    )
}

export default UserAccounts