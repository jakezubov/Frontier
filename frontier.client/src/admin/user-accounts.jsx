import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserSession } from '../contexts/user-context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserTie, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useCurrentPage } from '../contexts/current-page-context'
import { useGetAllUsers, useSwitchAdminStatus, useDeleteUser } from '../common/APIs'
import PopupDeleteAccount from '../popups/popup-delete-account'
import Path from '../common/paths'
import Searchbar from '../components/searchbar'
import Paging from '../components/paging'

const UserAccounts = () => {
    const { adminStatus } = useUserSession()
    const { setCurrentPage, Pages, isMobile } = useCurrentPage()
    const navigate = useNavigate()
    const searchFields = ['firstName', 'lastName', 'email']

    const [userList, setUserList] = useState([]) // Original list, used for the base of the searchedList
    const [searchedList, setSearchedList] = useState([]) // Filtered list from search, used for the base of the shortenedList
    const [shortenedList, setShortenedList] = useState([]) // Final list used to display values
    const [selectedUserId, setSelectedUserId] = useState('')
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
        setSearchedList(response)
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
                <div className="loader"></div>
                :
                <div>
                    <Searchbar searchFields={searchFields} initialList={userList} resultList={setSearchedList} />
                    <table className="read-only-table table-margin-top">
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
                        {shortenedList.length > 0 ?
                            <tbody>
                                {shortenedList.map(user => (
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
                            :
                            <tbody>
                                <tr>
                                    <td colSpan={isMobile === "false" ? "4" : "3"}><p>No results</p></td>
                                </tr>
                            </tbody>
                        }
                    </table>
                    <Paging itemsPerPage={6} initialList={searchedList} resultList={setShortenedList} />
                </div>
            }
            {isDeletePopupOpen && (
                <PopupDeleteAccount isPopupOpen={isDeletePopupOpen} setIsPopupOpen={setIsDeletePopupOpen} onConfirm={handleConfirmDelete} />
            )}
        </div>
    )
}

export default UserAccounts