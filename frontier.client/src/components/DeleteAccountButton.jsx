import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserSession } from '../contexts/UserContext'
import { useDeleteUser } from '../common/APIs'
import PopupDeleteAccount from '../popups/PopupDeleteAccount'
import Path from '../common/Paths'

const DeleteAccount = () => {
    const { userId, setUserId } = useUserSession()
    const navigate = useNavigate()
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)

    // APIs
    const { deleteUser } = useDeleteUser()

    const handleConfirmDelete = async () => {
        await deleteUser(userId)
        handleDelete()
    }

    const handleDelete = () => {
        setUserId(null)
        navigate(Path.CONFIRMATION_SCREEN, {
            state: { message: 'Account has been deleted!' }
        })
    }

    return (
        <div>
            <button className="general-button" type="button" onClick={() => setIsDeletePopupOpen(true)}>Delete Account</button>

            {isDeletePopupOpen && (
                <PopupDeleteAccount isPopupOpen={isDeletePopupOpen} setIsPopupOpen={setIsDeletePopupOpen} onConfirm={handleConfirmDelete} heading="Are you sure?" />
            )}
        </div>
    )
}

export default DeleteAccount