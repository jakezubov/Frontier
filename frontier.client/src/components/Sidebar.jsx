import PropTypes from 'prop-types'
import { useState } from 'react'
import History from './History'
import Information from './Information'
import Contact from './Contact'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClockRotateLeft, faCircleInfo, faEnvelope, faAnglesRight, faAnglesLeft } from '@fortawesome/free-solid-svg-icons'

const Sidebar = ({ refresh }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [activeButton, setActiveButton] = useState('')

    const toggleSidebar = (e) => {
        const label = e.currentTarget.getAttribute('aria-label')
        label !== 'toggle' ? setActiveButton(label) : null

        if (isExpanded && label === 'toggle') {
            setIsExpanded(false)
        }
        else if (!isExpanded) {
            setIsExpanded(true)
        }
    }

    return (
        <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <div className="col">
                <button className="sidebar-icon" aria-label='toggle' onClick={toggleSidebar}>
                {
                    isExpanded ?
                        <FontAwesomeIcon className="fa-2xl" icon={faAnglesRight} />
                        : <FontAwesomeIcon className="fa-2xl" icon={faAnglesLeft} />
                }
                </button>
                <button className="sidebar-icon" aria-label='information' onClick={toggleSidebar}><FontAwesomeIcon className="fa-2xl" icon={faCircleInfo} /></button>
                <button className="sidebar-icon" aria-label='contact' onClick={toggleSidebar}><FontAwesomeIcon className="fa-2xl" icon={faEnvelope} /></button>
                <button className="sidebar-icon" aria-label='history' onClick={toggleSidebar}><FontAwesomeIcon className="fa-2xl" icon={faClockRotateLeft} /></button>
            </div>
            <div className="col">
                {isExpanded && (
                    <div className="sidebar-content">
                        {activeButton === 'information' && (
                            <Information />
                        )}
                        {activeButton === 'history' && (
                            <History refresh={refresh} />
                        )}
                        {activeButton === 'contact' && (
                            <Contact refresh={refresh} />
                        )}
                    </div>
                )}
            </div>          
        </div>
    )
}

Sidebar.propTypes = {
    refresh: PropTypes.string
}

export default Sidebar