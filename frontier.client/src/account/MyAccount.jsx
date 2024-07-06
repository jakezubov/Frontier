import PropTypes from 'prop-types'
import Axios from 'axios'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import UserSettings from '../components/UserSettings'
import MetalSettings from '../components/MetalSettings'
import RingSizeSettings from '../components/RingSizeSettings'
import URL from '../constants/URLs'
import Path from '../constants/Paths'

const MyAccount = ({ userId, onDelete }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleDeleteAccount = () => {
        document.body.style.overflow = 'hidden'
        setIsDialogOpen(true)
    }

    const handleCloseDialog = () => {
        document.body.style.overflow = 'auto'
        setIsDialogOpen(false)
    }

    const handleConfirmDelete = async () => {
        document.body.style.overflow = 'auto'
        setIsDialogOpen(false)

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

            <button className="warning-button" type="button" onClick={handleDeleteAccount}>Delete Account</button>

            {isDialogOpen && (
                <DeleteAccountDialog onClose={handleCloseDialog} onConfirm={handleConfirmDelete} />
            )}
        </div>
    )
}

const DeleteAccountDialog = ({ onClose, onConfirm }) => {
    return (
        <div className="dialog-overlay">
            <div className="dialog-box">
                <h2>Confirm Delete Account</h2>
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                <Link className='warning-button link-button' onClick={onConfirm} to={Path.ACCOUNT_DELETE_CONFIRMATION}>Yes, Delete</Link>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    )
}

MyAccount.propTypes = { 
    userId: PropTypes.string,
    onDelete: PropTypes.func.isRequired,
}

export default MyAccount