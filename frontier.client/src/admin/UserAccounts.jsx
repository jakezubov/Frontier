import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserTie, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { useGetAllUsers, useSwitchAdminStatus, useSendVerification } from '../common/APIs'
import { useCurrentPage } from '../contexts/CurrentPageContext'

const UserAccounts = () => {
    const [userList, setUserList] = useState([])
    const { setCurrentPage, Pages } = useCurrentPage()

    // APIs
    const { getAllUsers } = useGetAllUsers()
    const { switchAdminStatus } = useSwitchAdminStatus()
    const { sendVerification } = useSendVerification()

    useEffect(() => {
        setCurrentPage(Pages.USER_ACCOUNTS)
        loadUsers()
    }, [])

    const loadUsers = async () => {
        const response = await getAllUsers()
        setUserList(response)
    }

    const handleSwitchAdmin = async (userId) => {
        await switchAdminStatus(userId)
        loadUsers()
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
                                <td>{user.firstName} {user.lastName}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.verifiedTF === true ? "True" : "False"}
                                    {user.verifiedTF === false ? <button className="settings-icon" type="button" onClick={() => sendVerification(user.fullName, user.email)}><FontAwesomeIcon className="fa-md" icon={faEnvelope} /></button> : null}
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
        </div>
    )
}

export default UserAccounts