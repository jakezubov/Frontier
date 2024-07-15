import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import History from './History'
import Information from './Information'
import Contact from './Contact'
import JewelleryPage from '../constants/JewelleryPages'

const Sidebar = ({ userId, jewelleryPage, refresh, onLogout }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [activeButton, setActiveButton] = useState('')

    useEffect(() => {
        setActiveButton('toggle')
    }, [onLogout])

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
                <button className="simple-button" aria-label='toggle' onClick={toggleSidebar}>{isExpanded ? '>>' : '<<'}</button>
                <button className="simple-button" aria-label='information' onClick={toggleSidebar}> I </button>
                <button className="simple-button" aria-label='contact' onClick={toggleSidebar}> C </button>
                {
                    userId ?
                        <button className="simple-button" aria-label='history' onClick={toggleSidebar}> H </button>
                        : null
                }
            </div>
            <div className="col">
                {isExpanded && (
                    <div className="sidebar-content">
                        {activeButton === 'information' && (
                            <>
                                <Information informationType={jewelleryPage} />
                            </>
                        )}
                        {activeButton === 'history' && (
                            <>
                                <History userId={userId} historyType={jewelleryPage} refresh={refresh} />
                            </>
                        )}
                        {activeButton === 'contact' && (
                            <>
                                <Contact userId={userId} refresh={refresh} />
                            </>
                        )}
                    </div>
                )}
            </div>          
        </div>
    )
}

Sidebar.propTypes = {
    userId: PropTypes.string,
    jewelleryPage: PropTypes.oneOf(Object.values(JewelleryPage)).isRequired,
    refresh: PropTypes.string
}

export default Sidebar