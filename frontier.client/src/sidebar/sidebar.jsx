import PropTypes from 'prop-types'
import { memo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import SidebarSections from '../common/sidebar-sections'
import History from './history'
import Information from './information'
import Contact from './contact'

const Sidebar = ({ activeSection, isExpanded, setIsExpanded }) => {
    return (
        <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <button className="sidebar-icon" onClick={() => setIsExpanded(false)}><FontAwesomeIcon className="fa-2xl" icon={faXmark} /></button>
            <div className="sidebar-content">
                {activeSection === SidebarSections.INFORMATION && (
                    <Information retractSidebar={() => setIsExpanded(false)} />
                )}
                {activeSection === SidebarSections.HISTORY && (
                    <History />
                )}
                {activeSection === SidebarSections.CONTACT && (
                    <Contact />
                )}
            </div>       
        </div>
    )
}

Sidebar.propTypes = {
    activeSection: PropTypes.string.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    setIsExpanded: PropTypes.func.isRequired,
}

export default memo(Sidebar)
