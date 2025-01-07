import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import History from './history'
import Information from './information'
import Contact from './contact'

export const SidebarButtons = {
    CLOSE: 'Close',
    INFORMATION: 'Information',
    CONTACT: 'Contact',
    HISTORY: 'History',
}

const Sidebar = ({ expandSection, closeSection }) => {
    const [isExpanded, setIsExpanded] = useState(false)

    useEffect(() => {
        if (expandSection === SidebarButtons.CLOSE) {
            setIsExpanded(false)
        }
        else setIsExpanded(true)
    }, [expandSection])

    return (
        <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <div>
                <button className="sidebar-icon" aria-label={SidebarButtons.CLOSE} onClick={closeSection}><FontAwesomeIcon className="fa-2xl" icon={faXmark} /></button>
            </div>
            {isExpanded && (
                <div className="sidebar-content">
                    {expandSection === SidebarButtons.INFORMATION && (
                        <Information retractSidebar={closeSection} />
                    )}
                    {expandSection === SidebarButtons.HISTORY && (
                        <History />
                    )}
                    {expandSection === SidebarButtons.CONTACT && (
                        <Contact />
                    )}
                </div>
            )}         
        </div>
    )
}

Sidebar.propTypes = {
    expandSection: PropTypes.string.isRequired,
    closeSection: PropTypes.func.isRequired,
}

export default Sidebar