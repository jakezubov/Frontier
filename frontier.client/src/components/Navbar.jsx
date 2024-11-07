import PropTypes from 'prop-types'
import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket, faArrowRightToBracket, faCircleHalfStroke, faHeart, faGear } from '@fortawesome/free-solid-svg-icons'
import { UserContext } from '../contexts/UserContext'
import { JewelleryPageContext } from '../contexts/JewelleryPageContext'
import { useLogLogout } from '../common/APIs'
import { updateCSSVariables } from '../common/Themes'
import PopupLogout from '../popups/PopupLogout'
import JewelleryPage from '../common/JewelleryPages'
import Path from '../common/Paths'

const Navbar = ({ adminStatus, loggedIn, onLogout }) => {
    const { userId } = useContext(UserContext)
    const { setJewelleryPage } = useContext(JewelleryPageContext)
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')
    const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false)

    // APIs
    const { logLogout } = useLogLogout()

    useEffect(() => {
        updateCSSVariables(theme);
        localStorage.setItem('theme', theme)
    }, [theme])

    const handleThemeChange = () => {
        theme === 'light' ? setTheme('dark') : setTheme('light')
    }

    const handleLogout = async () => {
        if (userId != null) {
            await logLogout(userId)
        }
        setJewelleryPage(JewelleryPage.NONE)
        onLogout()
    }

    return (
        <div>
            <nav className="navbar">
                <ul>
                    <li><Link className="navbar-links" onClick={() => setJewelleryPage(JewelleryPage.NONE)} to="/">Home</Link></li>
                    <hr />
                    <li><Link className="navbar-links" onClick={() => setJewelleryPage(JewelleryPage.METAL_CONVERTER)} to={Path.METAL_CONVERTER}>Metal Converter</Link></li>
                    <hr />
                    <li><Link className="navbar-links" onClick={() => setJewelleryPage(JewelleryPage.RING_WEIGHT)} to={Path.RING_WEIGHT}>Ring Weight</Link></li>
                    <hr />
                    <li><Link className="navbar-links" onClick={() => setJewelleryPage(JewelleryPage.RING_RESIZER)} to={Path.RING_RESIZER}>Ring Resizer</Link></li>
                    <hr />
                    <li><Link className="navbar-links" onClick={() => setJewelleryPage(JewelleryPage.ROLLING_WIRE)} to={Path.ROLLING_WIRE}>Rolling Wire</Link></li>
                    <hr />
                    {loggedIn ?
                        <>
                            <li><Link className="navbar-links" onClick={() => setJewelleryPage(JewelleryPage.NONE)} to={Path.MY_ACCOUNT}>My Account</Link></li>
                            <hr />
                            <li>
                                <FontAwesomeIcon className="fa-xl navbar-icon-spacing" icon={faArrowRightFromBracket} />
                                <Link className="navbar-links" onClick={() => setIsLogoutPopupOpen(true)} >Logout</Link>
                            </li>
                        </>
                        :
                        <>
                            <li><Link className="navbar-links" onClick={() => setJewelleryPage(JewelleryPage.NONE)} to={Path.REGISTER}>Register</Link></li>
                            <hr />
                            <li>
                                <FontAwesomeIcon className="fa-xl navbar-icon-spacing" icon={faArrowRightToBracket} />
                                <Link className="navbar-links" onClick={() => setJewelleryPage(JewelleryPage.NONE)} to={Path.LOGIN}>Login</Link>
                            </li>
                        </>
                    }
                </ul>
                <ul>
                    <li>

                    </li>
                    <li>
                        <div className="theme-buttons">
                            <button className="settings-icon" onClick={handleThemeChange}><FontAwesomeIcon className="fa-2xl" icon={faCircleHalfStroke} /></button>
                            <a href="https://paypal.me/jakezubov"><button className="settings-icon"><FontAwesomeIcon className="fa-2xl" icon={faHeart} /></button></a>
                            {adminStatus && (
                                <Link to={Path.ADMIN_WORKBENCH}><button className="settings-icon" onClick={() => setJewelleryPage(JewelleryPage.NONE)} ><FontAwesomeIcon className="fa-2xl" icon={faGear} /></button></Link>
                            )}
                        </div>
                    </li>
                </ul>
            </nav>

            {isLogoutPopupOpen && (
                <PopupLogout isPopupOpen={isLogoutPopupOpen} setIsPopupOpen={setIsLogoutPopupOpen} onConfirm={handleLogout} />
            )}
        </div>
    )
}

Navbar.propTypes = {
    adminStatus: PropTypes.bool.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    onLogout: PropTypes.func.isRequired,
}

export default Navbar