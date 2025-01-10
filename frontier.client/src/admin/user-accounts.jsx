import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserSession } from '../contexts/user-context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserTie, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useCurrentPage } from '../contexts/current-page-context'
import { useGetAllUsers, useSwitchAdminStatus, useDeleteUser } from '../common/APIs'
import PopupDeleteAccount from '../popups/popup-delete-account'
import Path from '../common/paths'

const UserAccounts = () => {
    const { adminStatus } = useUserSession()
    const navigate = useNavigate()

    const [userList, setUserList] = useState([])
    const [selectedUserId, setSelectedUserId] = useState('')
    const { setCurrentPage, Pages, isMobile } = useCurrentPage()
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // APIs
    const { getAllUsers } = useGetAllUsers()
    const { switchAdminStatus } = useSwitchAdminStatus()
    const { deleteUser } = useDeleteUser()

    useEffect(() => {
        setCurrentPage(Pages.USER_ACCOUNTS)
        loadUsers()
    }, [])

    useEffect(() => {
        if (!adminStatus) {
            navigate(Path.CONFIRMATION_SCREEN, {
                state: { message: 'You need to be an admin to access that page!' }
            })
        }
    }, [adminStatus])

    const loadUsers = async () => {
        const response = await getAllUsers()
        setUserList(response)
        setIsLoading(false)
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

    return (
        <div>
            {isLoading ?
                <div class="loader"></div>
                :
                <table className="read-only-table">
                    <thead>
                        <tr>
                            {isMobile === "false" ?
                                <>
                                    <th>Name</th>
                                    <th>Email</th>
                                </> :
                                <th>Name / Email</th>
                            }
                            <th>Admin</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList.map(user => (
                            <tr key={user.id}>
                                {isMobile === "false" ?
                                    <>
                                        <td>{user.firstName} {user.lastName}</td>
                                        <td>{user.email}</td>
                                    </> :
                                    <td>{user.firstName} {user.lastName} / {user.email}</td>
                                }
                                <td>
                                    {user.adminTF === true ? "True " : "False"}
                                    <button className="settings-icon" type="button" onClick={() => handleSwitchAdmin(user.id)}><FontAwesomeIcon className="fa-md" icon={faUserTie} /></button>
                                </td>
                                <td>
                                    <button className="settings-icon" type="button" onClick={() => handleDeletePopup(user.id)}><FontAwesomeIcon className="fa-md" icon={faTrashCan} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
            {isDeletePopupOpen && (
                <PopupDeleteAccount isPopupOpen={isDeletePopupOpen} setIsPopupOpen={setIsDeletePopupOpen} onConfirm={handleConfirmDelete} />
            )}
        </div>
    )
}

export default UserAccounts