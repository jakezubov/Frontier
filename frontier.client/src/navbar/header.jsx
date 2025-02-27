import { useState, memo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faClockRotateLeft, faCircleInfo, faEnvelope, faCalculator } from '@fortawesome/free-solid-svg-icons'
import { useCurrentPage } from '../contexts/current-page-context'
import SidebarSections from '../common/sidebar-sections'
import Sidebar from '../sidebar/sidebar'
import Navbar from './navbar'

const Header = () => {
    const { currentPage, isMobile, isEmailSetup } = useCurrentPage()
    const [sidebarExpanded, setSidebarExpanded] = useState(false)
    const [navbarExpanded, setNavbarExpanded] = useState(isMobile === "true" ? false : true)
    const [activeSection, setActiveSection] = useState(SidebarSections.INFORMATION)

    const toggleSidebar = (label) => {
        if (isMobile === "true") {
            setNavbarExpanded(false)
        }
        if (label === activeSection && sidebarExpanded) {
            setSidebarExpanded(false)
        }
        else {
            setActiveSection(label)
            setSidebarExpanded(true)
        }
    }

    const toggleNavbar = () => {
        if (isMobile === "true") {
            setSidebarExpanded(false)
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
            <button className="header-icon" onClick={() => toggleSidebar(SidebarSections.INFORMATION)}><FontAwesomeIcon className="fa-2xl" icon={faCircleInfo} /></button>
            {isEmailSetup === "true" &&
                <button className="header-icon" onClick={() => toggleSidebar(SidebarSections.CONTACT)}><FontAwesomeIcon className="fa-2xl" icon={faEnvelope} /></button>  
            }
            <button className="header-icon" onClick={() => toggleSidebar(SidebarSections.HISTORY)}><FontAwesomeIcon className="fa-2xl" icon={faClockRotateLeft} /></button>
            <button className="header-icon header-right-icon" onClick={() => toggleSidebar(SidebarSections.CALCULATOR)}><FontAwesomeIcon className="fa-2xl" icon={faCalculator} /></button>

            <Sidebar isExpanded={sidebarExpanded} setIsExpanded={setSidebarExpanded} activeSection={activeSection} />
            <Navbar isExpanded={navbarExpanded} setIsExpanded={setNavbarExpanded} />
        </div>
    )
}

export default memo(Header)