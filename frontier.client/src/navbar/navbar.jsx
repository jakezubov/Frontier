import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faBars } from '@fortawesome/free-solid-svg-icons'
import { useLogLogout } from '../common/APIs'
import { useUserSession } from '../contexts/user-context'
import PopupLogout from '../popups/popup-logout'
import NavbarIcons from './navbar-icons'
import AccountNavbar from './account-navbar'
import AdminNavbar from './admin-navbar'
import GeneralNavbar from './general-navbar'
import Path from '../common/paths'

const Navbar = () => {
    const { userId, setUserId } = useUserSession()
    const [isExpanded, setIsExpanded] = useState(false)
    const [isAccountNavbar, setIsAccountNavbar] = useState(false)
    const [isAdminNavbar, setIsAdminNavbar] = useState(false)
    const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false)
    const navigate = useNavigate()

    // APIs
    const { logLogout } = useLogLogout()

    const toggleNavbar = () => {
        setIsExpanded(!isExpanded)
    }

    const handleAdminIcon = () => {
        setIsAccountNavbar(false)
        setIsAdminNavbar(true)
    }

    const handleLogout = async () => {
        toggleNavbar()
        if (userId) {
            await logLogout(userId)
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
            <button className="mobile-menu-toggle" onClick={toggleNavbar}><FontAwesomeIcon icon={isExpanded ? faXmark : faBars} className="fa-xl" /></button>

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

export default Navbar