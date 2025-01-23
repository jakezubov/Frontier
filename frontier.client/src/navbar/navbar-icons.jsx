import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faGear} from '@fortawesome/free-solid-svg-icons'
import { useUserSession } from '../contexts/user-context'
import ThemeButton from '../components/theme-button'
import Path from '../common/paths'

const NavbarIcons = ({ activateAdminNavbar }) => {
    const { adminStatus } = useUserSession()

    return (
        <div className="navbar-icons">
            <ThemeButton />
            <a href="https://paypal.me/jakezubov"><button className="settings-icon"><FontAwesomeIcon className="fa-2xl" icon={faHeart} /></button></a>
            {adminStatus &&
                <Link onClick={activateAdminNavbar} to={Path.ADMIN_WORKBENCH}><button className="settings-icon" ><FontAwesomeIcon className="fa-2xl" icon={faGear} /></button></Link>
            }
        </div>
    )
}

NavbarIcons.propTypes = {
    activateAdminNavbar: PropTypes.func.isRequired,
}

export default NavbarIcons