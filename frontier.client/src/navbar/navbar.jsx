import PropTypes from 'prop-types'
import { useState, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLogoutUser } from '../APIs/auth'
import { useUserSession } from '../contexts/user-context'
import { useCurrentPage } from '../contexts/current-page-context'
import PopupLogout from '../popups/popup-logout'
import NavbarIcons from './navbar-icons'
import AccountNavbar from './account-navbar'
import AdminNavbar from './admin-navbar'
import GeneralNavbar from './general-navbar'
import Path from '../consts/paths'

const Navbar = ({ isExpanded, setIsExpanded }) => {
    const { userId, setUserId } = useUserSession()
    const { isMobile } = useCurrentPage()
    const [isAccountNavbar, setIsAccountNavbar] = useState(false)
    const [isAdminNavbar, setIsAdminNavbar] = useState(false)
    const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false)
    const navigate = useNavigate()

    // APIs
    const { logoutUser } = useLogoutUser()

    const toggleNavbar = () => {
        if (isMobile === "true") {
            setIsExpanded(!isExpanded)
        }
    }

    const handleAdminIcon = () => {
        setIsAccountNavbar(false)
        setIsAdminNavbar(true)
    }

    const handleLogout = async () => {
        toggleNavbar()
        if (userId) {
            await logoutUser(userId)
        }
        setUserId(null)
        navigate(Path.CONFIRMATION_SCREEN, {
            state: { message: 'Logged Out Successfully!' }
        })
    }

    const handleLogoutClick = () => {
        setIsLogoutPopupOpen(true)
    }

    return (
        <div>
            <nav className={`navbar ${isExpanded ? 'expanded' : 'collapsed'}`}>
                {isAccountNavbar ?
                    <AccountNavbar toggleNavbar={toggleNavbar} backSelected={() => setIsAccountNavbar(false)} submenuExpanded={isAccountNavbar} />
                    : isAdminNavbar ?
                        <AdminNavbar toggleNavbar={toggleNavbar} backSelected={() => setIsAdminNavbar(false)} submenuExpanded={isAdminNavbar} />
                        :
                        <GeneralNavbar toggleNavbar={toggleNavbar} activateAccountNavbar={() => setIsAccountNavbar(true)} handleLogoutClick={handleLogoutClick} submenuExpanded={!isAdminNavbar && !isAccountNavbar} />
                }
                <ul>
                    <li>
                        <NavbarIcons activateAdminNavbar={handleAdminIcon} />
                    </li>
                </ul>
            </nav>

            {isLogoutPopupOpen && (
                <PopupLogout isPopupOpen={isLogoutPopupOpen} setIsPopupOpen={setIsLogoutPopupOpen} onConfirm={handleLogout} />
            )}
        </div>
    )
}

Navbar.propTypes = {
    isExpanded: PropTypes.bool.isRequired,
    setIsExpanded: PropTypes.func.isRequired,
}

export default memo(Navbar)