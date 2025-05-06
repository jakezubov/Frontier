import PropTypes from 'prop-types'
import { memo, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import SidebarSections from '../consts/sidebar-sections'
import History from './history'
import Information from './information'
import Contact from './contact'
import Calculator from './calculator'

const Sidebar = ({ activeSection, isExpanded, setIsExpanded }) => {
    const [refocusInput, setRefocusInput] = useState('')

    useEffect(() => {
        if (activeSection === SidebarSections.CALCULATOR && isExpanded) {
            setRefocusInput(new Date())
        }
    }, [isExpanded])

    return (
        <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <button className="sidebar-close" onClick={() => setIsExpanded(false)}><FontAwesomeIcon className="fa-2xl" icon={faXmark} /></button>
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
                {activeSection === SidebarSections.CALCULATOR && (
                    <Calculator refocusInput={refocusInput} />
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
