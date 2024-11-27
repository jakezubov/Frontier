import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserTie, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useCurrentPage } from '../contexts/current-page-context'
import { useGetAllUsers, useSwitchAdminStatus, useDeleteUser } from '../common/APIs'
import PopupDeleteAccount from '../popups/popup-delete-account'

const UserAccounts = () => {
    const [userList, setUserList] = useState([])
    const [selectedUserId, setSelectedUserId] = useState('')
    const { setCurrentPage, Pages } = useCurrentPage()
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)

    // APIs
    const { getAllUsers } = useGetAllUsers()
    const { switchAdminStatus } = useSwitchAdminStatus()
    const { deleteUser } = useDeleteUser()

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

    const handleDeletePopup = (userId) => {
        setIsDeletePopupOpen(true)
        setSelectedUserId(userId)
    }

    const handleConfirmDelete = async () => {
        await deleteUser(selectedUserId)
        setSelectedUserId('')
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
                            <th>Admin</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList.map(user => (
                            <tr key={user.id}>
                                <td>{user.firstName} {user.lastName}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.adminTF === true ? "True" : "False"}
                                    <button className="settings-icon" type="button" onClick={() => handleSwitchAdmin(user.id)}><FontAwesomeIcon className="fa-md" icon={faUserTie} /></button>
                                </td>
                                <td>
                                    <button className="settings-icon" type="button" onClick={() => handleDeletePopup(user.id)}><FontAwesomeIcon className="fa-md" icon={faTrashCan} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </form>

            {isDeletePopupOpen && (
                <PopupDeleteAccount isPopupOpen={isDeletePopupOpen} setIsPopupOpen={setIsDeletePopupOpen} onConfirm={handleConfirmDelete} />
            )}
        </div>
    )
}

export default UserAccounts