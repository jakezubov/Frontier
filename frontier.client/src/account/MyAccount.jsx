import PropTypes from 'prop-types'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import UserSettings from './UserSettings'
import UpdatePassword from './UpdatePassword'
import MetalSettings from './MetalSettings'
import RingSizeSettings from './RingSizeSettings'
import MyAccountPages from '../constants/MyAccountPages'

const MyAccount = ({ userId, onDelete }) => {
    const [currentPage, setCurrentPage] = useState(MyAccountPages.USER_SETTINGS)


    return (
        <div>
            <nav className="navbar-my-account col">
                <ul>
                    <li><Link className="small-link" onClick={() => setCurrentPage(MyAccountPages.USER_SETTINGS)} >User Settings</Link></li>
                    <li><Link className="small-link" onClick={() => setCurrentPage(MyAccountPages.UPDATE_PASSWORD)} >Update Password</Link></li>
                    <li><Link className="small-link" onClick={() => setCurrentPage(MyAccountPages.METAL_SETTINGS)} >Metal Settings</Link></li>
                    <li><Link className="small-link" onClick={() => setCurrentPage(MyAccountPages.RING_SIZE_SETTINGS)} >Ring Size Settings</Link></li>
                </ul>
            </nav>
            <div className="col">
            {
                currentPage === MyAccountPages.USER_SETTINGS ?
                    <UserSettings userId={userId} onDelete={onDelete} />
                : currentPage === MyAccountPages.UPDATE_PASSWORD ?
                    <UpdatePassword userId={userId} />
                : currentPage === MyAccountPages.METAL_SETTINGS ?
                    <MetalSettings userId={userId} />
                : currentPage === MyAccountPages.RING_SIZE_SETTINGS ?
                    <RingSizeSettings userId={userId} />
                : null
            }
            </div>
        </div>
    )
}

MyAccount.propTypes = { 
    userId: PropTypes.string,
    onDelete: PropTypes.func.isRequired,
}

export default MyAccount