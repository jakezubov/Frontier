import PropTypes from 'prop-types'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import UserSettings from './UserSettings'
import UpdatePassword from './UpdatePassword'
import MetalSettings from './MetalSettings'
import RingSizeSettings from './RingSizeSettings'
import MyAccountPages from '../constants/MyAccountPages'

const MyAccount = ({ onDelete }) => {
    const [currentPage, setCurrentPage] = useState(MyAccountPages.USER_SETTINGS)

    return (
        <div>
            <nav className="navbar-my-account col">
                <ul>
                    <li><Link className="navbar-my-account-links" onClick={() => setCurrentPage(MyAccountPages.USER_SETTINGS)} >User Settings</Link></li>
                    <li><Link className="navbar-my-account-links" onClick={() => setCurrentPage(MyAccountPages.UPDATE_PASSWORD)} >Update Password</Link></li>
                    <li><Link className="navbar-my-account-links" onClick={() => setCurrentPage(MyAccountPages.METAL_SETTINGS)} >Metal Settings</Link></li>
                    <li><Link className="navbar-my-account-links" onClick={() => setCurrentPage(MyAccountPages.RING_SIZE_SETTINGS)} >Ring Size Settings</Link></li>
                </ul>
            </nav>
            <div className="col">
                {currentPage === MyAccountPages.USER_SETTINGS && (
                    <UserSettings onDelete={onDelete} />
                )}
                {currentPage === MyAccountPages.UPDATE_PASSWORD && (
                    <UpdatePassword />
                )}
                {currentPage === MyAccountPages.METAL_SETTINGS && (
                    <MetalSettings />
                )}
                {currentPage === MyAccountPages.RING_SIZE_SETTINGS && (
                    <RingSizeSettings />
                )}
            </div>
        </div>
    )
}

MyAccount.propTypes = { 
    onDelete: PropTypes.func.isRequired,
}

export default MyAccount