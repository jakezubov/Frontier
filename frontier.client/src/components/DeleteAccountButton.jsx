import PropTypes from 'prop-types'
import { useState, useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import { useDeleteUser } from '../common/APIs'
import PopupDeleteAccount from '../popups/PopupDeleteAccount'

const DeleteAccount = ({ onDelete }) => {
    const { userId } = useContext(UserContext)
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false)

    // APIs
    const { deleteUser } = useDeleteUser()

    const handleConfirmDelete = async () => {
        await deleteUser(userId)
        onDelete()
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

DeleteAccount.propTypes = {
    onDelete: PropTypes.func.isRequired,
}

export default DeleteAccount