import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faClockRotateLeft, faCircleInfo, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faGem } from '@fortawesome/free-regular-svg-icons'
import { useCurrentPage } from '../contexts/current-page-context'
import Sidebar from '../sidebar/sidebar'
import Navbar from './navbar'

const SidebarButtons = {
    CLOSE: 'Close',
    INFORMATION: 'Information',
    CONTACT: 'Contact',
    HISTORY: 'History',
}

const Header = () => {
    const { currentPage, isMobile } = useCurrentPage()
    const [activeSection, setActiveSection] = useState(SidebarButtons.CLOSE)
    const [navbarExpanded, setNavbarExpanded] = useState(isMobile === "true" ? false : true)

    const toggleSidebar = (e) => {
        if (isMobile === "true") {
            setNavbarExpanded(false)
        }
        const label = e.currentTarget.getAttribute('aria-label')
        if (label === activeSection) {
            setActiveSection(SidebarButtons.CLOSE)
        }
        else setActiveSection(label)
    }

    const toggleNavbar = () => {
        if (isMobile === "true" && !navbarExpanded) {
            setActiveSection(SidebarButtons.CLOSE)
        }
        setNavbarExpanded(!navbarExpanded)
    }

    return (
        <div className="header">
            <button className="header-icon" onClick={toggleNavbar}><FontAwesomeIcon icon={faBars} className="fa-2xl" /></button>

            <table>
                <tbody>
                    <tr>
                        <td><h2 className="header-text">{currentPage}</h2></td>
                    </tr>
                </tbody>
            </table>
            <button className="header-icon" aria-label={SidebarButtons.INFORMATION} onClick={toggleSidebar}><FontAwesomeIcon className="fa-2xl" icon={faCircleInfo} /></button>
            <button className="header-icon" aria-label={SidebarButtons.CONTACT} onClick={toggleSidebar}><FontAwesomeIcon className="fa-2xl" icon={faEnvelope} /></button>
            <button className="header-icon" aria-label={SidebarButtons.HISTORY} onClick={toggleSidebar}><FontAwesomeIcon className="fa-2xl" icon={faClockRotateLeft} /></button>

            <Sidebar expandSection={activeSection} closeSection={() => setActiveSection(SidebarButtons.CLOSE)} />
            <Navbar isExpanded={navbarExpanded} setIsExpanded={setNavbarExpanded} />
        </div>
    )
}

export default Header