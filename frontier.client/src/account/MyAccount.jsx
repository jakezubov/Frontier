import PropTypes from 'prop-types'
import Axios from 'axios'
import { useState } from 'react'
import UserSettings from '../components/UserSettings'
import MetalSettings from '../components/MetalSettings'
import RingSizeSettings from '../components/RingSizeSettings'
import PopupDeleteAccount from '../components/PopupDeleteAccount'
import URL from '../constants/URLs'

const MyAccount = ({ userId, onDelete }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false)

    const handleConfirmDelete = async () => {
        try {
            await Axios.delete(URL.DELETE_USER(userId))
            onDelete()
        }
        catch (error) {
            console.log(error)
            alert('There was an error deleting the account!')
        }
    }

    return (
        <div>
            <h1>My Account</h1>
            <UserSettings userId={userId} />

            <br />
            <br />

            <MetalSettings userId={userId} />

            <br />
            <br />

            <RingSizeSettings userId={userId} />

            <br />
            <br />

            <button className="warning-button" type="button" onClick={() => setIsPopupOpen(true)}>Delete Account</button>

            {isPopupOpen && (
                <PopupDeleteAccount isPopupOpen={isPopupOpen} setIsPopupOpen={setIsPopupOpen} onConfirm={handleConfirmDelete} heading="Are you sure?" />
            )}
        </div>
    )
}

MyAccount.propTypes = { 
    userId: PropTypes.string,
    onDelete: PropTypes.func.isRequired,
}

export default MyAccount