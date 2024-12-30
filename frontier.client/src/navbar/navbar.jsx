import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faBars } from '@fortawesome/free-solid-svg-icons'
import NavbarIcons from './navbar-icons'
import AccountNavbar from './account-navbar'
import AdminNavbar from './admin-navbar'
import GeneralNavbar from './general-navbar'

const Navbar = () => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isAccountNavbar, setIsAccountNavbar] = useState(false)
    const [isAdminNavbar, setIsAdminNavbar] = useState(false)

    useEffect(() => {
        if (isAdminNavbar && isAccountNavbar) {
            setIsAccountNavbar(false)
        }
    }, [isAdminNavbar])

    const toggleNavbar = () => {
        setIsExpanded(!isExpanded)
    }

    return (
        <div>
            <button className="mobile-menu-toggle" onClick={toggleNavbar}><FontAwesomeIcon icon={isExpanded ? faXmark : faBars} className="fa-xl" /></button>

            <nav className={`navbar ${isExpanded ? 'expanded' : 'collapsed'}`}>
                { isAccountNavbar ?
                    <AccountNavbar toggleNavbar={toggleNavbar} backSelected={() => setIsAccountNavbar(false)} />
                    : isAdminNavbar ?
                        <AdminNavbar toggleNavbar={toggleNavbar} backSelected={() => setIsAdminNavbar(false)} />
                        :
                        <GeneralNavbar toggleNavbar={toggleNavbar} activateAccountNavbar={() => setIsAccountNavbar(true)} />
                }

                <ul>
                    <li>
                        <NavbarIcons activateAdminNavbar={() => setIsAdminNavbar(true)} />
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default Navbar