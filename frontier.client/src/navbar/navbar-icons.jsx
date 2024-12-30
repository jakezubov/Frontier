import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleHalfStroke, faHeart, faGear} from '@fortawesome/free-solid-svg-icons'
import { useUserSession } from '../contexts/user-context'
import { updateCSSVariables } from '../common/themes'
import Path from '../common/paths'

const NavbarIcons = ({ activateAdminNavbar }) => {
    const { adminStatus } = useUserSession()
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')

    useEffect(() => {
        updateCSSVariables(theme);
        localStorage.setItem('theme', theme)
    }, [theme])

    const handleThemeChange = () => {
        theme === 'light' ? setTheme('dark') : setTheme('light')
    }

    return (
        <div>
            <div className="theme-buttons">
                <button className="settings-icon" onClick={handleThemeChange}><FontAwesomeIcon className="fa-2xl" icon={faCircleHalfStroke} /></button>
                <a href="https://paypal.me/jakezubov"><button className="settings-icon"><FontAwesomeIcon className="fa-2xl" icon={faHeart} /></button></a>
                {adminStatus && (
                    <Link onClick={activateAdminNavbar} to={Path.ADMIN_WORKBENCH}><button className="settings-icon" ><FontAwesomeIcon className="fa-2xl" icon={faGear} /></button></Link>
                )}
            </div>
        </div>
        
    )
}

NavbarIcons.propTypes = {
    activateAdminNavbar: PropTypes.func.isRequired,
}

export default NavbarIcons