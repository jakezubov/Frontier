import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserSession } from '../contexts/user-context'
import { useDeleteUser } from '../common/APIs'
import PopupDeleteAccount from '../popups/popup-delete-account'
import Path from '../common/paths'

const DeleteAccount = () => {
    const { userId, setUserId } = useUserSession()
    const navigate = useNavigate()
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)

    // APIs
    const { deleteUser } = useDeleteUser()

    const handleConfirmDelete = async () => {
        await deleteUser(userId)
        setUserId(null)
        navigate(Path.CONFIRMATION_SCREEN, {
            state: { message: 'Account has been deleted!' }
        })
    }

    return (
        <div>
            <button className="general-button" type="button" onClick={() => setIsDeletePopupOpen(true)}>Delete Account</button>

            {isDeletePopupOpen && (
                <PopupDeleteAccount isPopupOpen={isDeletePopupOpen} setIsPopupOpen={setIsDeletePopupOpen} onConfirm={handleConfirmDelete} />
            )}
        </div>
    )
}

export default DeleteAccount