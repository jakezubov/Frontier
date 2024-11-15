import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUserSession } from '../contexts/UserContext'
import UserSettings from './UserSettings'
import UpdatePassword from './UpdatePassword'
import MetalSettings from './MetalSettings'
import RingSizeSettings from './RingSizeSettings'
import Path from '../common/Paths'

const MyAccountPages = {
    USER_SETTINGS: 'UserSettings',
    UPDATE_PASSWORD: 'UpdatePassword',
    METAL_SETTINGS: 'MetalSettings',
    RING_SIZE_SETTINGS: 'RingSizeSettings',
}

const MyAccount = () => {
    const { loggedInStatus } = useUserSession()
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(MyAccountPages.USER_SETTINGS)

    useEffect(() => {
        if (!loggedInStatus) {
            navigate(Path.CONFIRMATION_SCREEN, {
                state: { message: 'You need to be logged in to access that page!' }
            })
        }
    }, [loggedInStatus])

    return (
        <div>
            <nav className="navbar-my-account">
                <ul>
                    <li><Link className="navbar-my-account-links" onClick={() => setCurrentPage(MyAccountPages.USER_SETTINGS)} >User Settings</Link></li>
                    <li><Link className="navbar-my-account-links" onClick={() => setCurrentPage(MyAccountPages.UPDATE_PASSWORD)} >Update Password</Link></li>
                    <li><Link className="navbar-my-account-links" onClick={() => setCurrentPage(MyAccountPages.METAL_SETTINGS)} >Metal Settings</Link></li>
                    <li><Link className="navbar-my-account-links" onClick={() => setCurrentPage(MyAccountPages.RING_SIZE_SETTINGS)} >Ring Size Settings</Link></li>
                </ul>
            </nav>
            <div>
                {currentPage === MyAccountPages.USER_SETTINGS && (
                    <UserSettings />
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

export default MyAccount