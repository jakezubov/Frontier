import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import URL from '../constants/URLs'
import Axios from 'axios'

const UserSettings = ({ userId }) => {
    // Personal Details
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setNewConfirmPassword] = useState('');
    const [historyAmount, setHistoryAmount] = useState('');

    useEffect(() => {
        getInfo()
    }, []);

    const getInfo = async () => {
        try {
            const response = await Axios.get(URL.GET_USER(userId));

            setFirstName(response.data.firstName)
            setLastName(response.data.lastName)
            setEmail(response.data.email)
            setOldPassword('')
            setNewPassword('')
            setNewConfirmPassword('')
            setHistoryAmount(response.data.historyAmount)
        }
        catch (error) {
            console.log(error)
            alert('There was an error getting the user info!')
        }
    }

    const handlePersonalDetailsSubmit = async () => {
        if (oldPassword !== '' || newPassword !== '' || confirmNewPassword !== '') {
            try {
                await Axios.get(URL.VALIDATE_USER, {
                    params: {
                        email: email,
                        password: oldPassword
                    }
                });

                if (newPassword !== confirmNewPassword) {
                    alert('New Passwords do not match')
                    return
                }

                await Axios.put(URL.UPDATE_USER(userId), {
                    Id: userId,
                    FirstName: firstName,
                    LastName: lastName,
                    Email: email,
                    PasswordHash: newPassword,
                    HistoryAmount: historyAmount,
                }, {
                    params: {
                        isNewPassword: true
                    }
                });

                alert('Account details updated!')
                getInfo()
            }
            catch (error) {
                if (error.response && error.response.status === 401) {
                    alert('Old Password Incorrect')
                }
                else {
                    console.log(error)
                    alert('There was an error submitting the form!')
                }
            }
        }
        else {
            try {
                const response = await Axios.get(URL.GET_USER(userId))

                await Axios.put(URL.UPDATE_USER(userId), {
                    Id: userId,
                    FirstName: firstName,
                    LastName: lastName,
                    Email: email,
                    PasswordHash: response.data.passwordHash,
                    HistoryAmount: historyAmount,
                }, {
                    params: {
                        isNewPassword: false
                    }
                });

                alert('Account details updated!')
                getInfo()
            }
            catch (error) {
                console.log(error)
                alert('There was an error submitting the form!')
            }
        }
    }

    const handleClearHistory = async () => {
        try {
            await Axios.put(URL.DELETE_HISTORY(userId))
            alert('History has been deleted!')
        }
        catch (error) {
            console.log(error)
            alert('There was an error submitting the form!')
        }
    }

    return (
        <div>
            <h2>User Settings</h2>
            <table>
                <tbody>
                    <tr>
                        <td>First Name</td>
                        <td><input value={firstName} onChange={(e) => setFirstName(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Last Name</td>
                        <td><input value={lastName} onChange={(e) => setLastName(e.target.value)} /></td>
                    </tr>
                    <tr><td></td></tr>
                    <tr>
                        <td>Email</td>
                        <td><input value={email} type="email" onChange={(e) => setEmail(e.target.value)} /></td>
                    </tr>
                    <tr><td></td></tr>
                    <tr>
                        <td>Old Password</td>
                        <td><input value={oldPassword} type="password" onChange={(e) => setOldPassword(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>New Password</td>
                        <td><input value={newPassword} type="password" onChange={(e) => setNewPassword(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Confirm New Password</td>
                        <td><input value={confirmNewPassword} type="password" onChange={(e) => setNewConfirmPassword(e.target.value)} /></td>
                    </tr>
                    <tr><td></td></tr>
                    <tr>
                        <td>History</td>
                        <td><input type="number" step="5" min="0" max="50" value={historyAmount} onChange={(e) => setHistoryAmount(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td><button type="button" onClick={handlePersonalDetailsSubmit}>Save Changes</button></td>
                        <td><button type="button" onClick={handleClearHistory}>Clear History</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

UserSettings.propTypes = {
    userId: PropTypes.string.isRequired,
}

export default UserSettings