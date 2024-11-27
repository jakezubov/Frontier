import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClockRotateLeft, faCircleInfo, faEnvelope, faAnglesRight, faAnglesLeft } from '@fortawesome/free-solid-svg-icons'
import History from './history'
import Information from './information'
import Contact from './contact'

const SidebarButtons = {
    TOGGLE: 'Toggle',
    INFORMATION: 'Information',
    CONTACT: 'Contact',
    HISTORY: 'History',
}

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [activeButton, setActiveButton] = useState('')

    const toggleSidebar = (e) => {
        const label = e.currentTarget.getAttribute('aria-label')
        label === SidebarButtons.TOGGLE ? setActiveButton(SidebarButtons.INFORMATION) : setActiveButton(label)

        if (isExpanded && label === SidebarButtons.TOGGLE) {
            setIsExpanded(false)
        }
        else if (!isExpanded) {
            setIsExpanded(true)
        }
    }

    return (
        <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <div className="col">
                <button className="sidebar-icon" aria-label={SidebarButtons.TOGGLE} onClick={toggleSidebar}>
                {
                    isExpanded 
                        ? <FontAwesomeIcon className="fa-2xl" icon={faAnglesRight} />
                        : <FontAwesomeIcon className="fa-2xl" icon={faAnglesLeft} />
                }
                </button>
                <button className="sidebar-icon" aria-label={SidebarButtons.INFORMATION} onClick={toggleSidebar}><FontAwesomeIcon className="fa-2xl" icon={faCircleInfo} /></button>
                <button className="sidebar-icon" aria-label={SidebarButtons.CONTACT} onClick={toggleSidebar}><FontAwesomeIcon className="fa-2xl" icon={faEnvelope} /></button>
                <button className="sidebar-icon" aria-label={SidebarButtons.HISTORY} onClick={toggleSidebar}><FontAwesomeIcon className="fa-2xl" icon={faClockRotateLeft} /></button>
            </div>
            <div className="col">
                {isExpanded && (
                    <div className="sidebar-content">
                        {activeButton === SidebarButtons.INFORMATION && (
                            <Information />
                        )}
                        {activeButton === SidebarButtons.HISTORY && (
                            <History />
                        )}
                        {activeButton === SidebarButtons.CONTACT && (
                            <Contact />
                        )}
                    </div>
                )}
            </div>          
        </div>
    )
}

export default Sidebar