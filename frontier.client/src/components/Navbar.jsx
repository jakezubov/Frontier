import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket, faArrowRightToBracket, faCircleHalfStroke, faHeart, faGear } from '@fortawesome/free-solid-svg-icons'
import { useUserSession } from '../contexts/user-context'
import { useLogLogout, useGetUser } from '../common/APIs'
import { updateCSSVariables } from '../common/themes'
import PopupLogout from '../popups/popup-logout'
import Path from '../common/paths'

const Navbar = () => {
    const { userId, setUserId, adminStatus, loggedInStatus } = useUserSession()
    const navigate = useNavigate()
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')
    const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false)

    // APIs
    const { logLogout } = useLogLogout()
    const { getUser } = useGetUser()

    useEffect(() => {
        updateCSSVariables(theme);
        localStorage.setItem('theme', theme)
    }, [theme])

    useEffect(() => {
        checkLoggedInStatus()
    }, [])

    const handleThemeChange = () => {
        theme === 'light' ? setTheme('dark') : setTheme('light')
    }

    const handleLogout = async () => {
        if (userId) {
            await logLogout(userId)
        }
        setUserId(null)
        navigate(Path.CONFIRMATION_SCREEN, {
            state: { message: 'Logged Out Successfully!' }
        })
    }

    const checkLoggedInStatus = async () => {
        if (userId) {
            const user = await getUser(userId)
            if (!user.loggedInTF) {
                setUserId(null)
            }
        }
    }

    return (
        <div>
            <nav className="navbar">
                <ul>
                    <li><Link className="navbar-links" to="/">Home</Link></li>
                    <hr />
                    <li><Link className="navbar-links" to={Path.METAL_CONVERTER}>Metal Converter</Link></li>
                    <hr />
                    <li><Link className="navbar-links" to={Path.RING_WEIGHT}>Ring Weight</Link></li>
                    <hr />
                    <li><Link className="navbar-links" to={Path.RING_RESIZER}>Ring Resizer</Link></li>
                    <hr />
                    <li><Link className="navbar-links" to={Path.ROLLING_WIRE}>Rolling Wire</Link></li>
                    <hr />
                    {loggedInStatus ?
                        <>
                            <li><Link className="navbar-links" to={Path.MY_ACCOUNT}>My Account</Link></li>
                            <hr />
                            <li>
                                <FontAwesomeIcon className="fa-xl navbar-icon-spacing" icon={faArrowRightFromBracket} />
                                <Link className="navbar-links" onClick={() => setIsLogoutPopupOpen(true)} >Logout</Link>
                            </li>
                        </>
                        :
                        <>
                            <li><Link className="navbar-links" to={Path.REGISTER}>Register</Link></li>
                            <hr />
                            <li>
                                <FontAwesomeIcon className="fa-xl navbar-icon-spacing" icon={faArrowRightToBracket} />
                                <Link className="navbar-links" to={Path.LOGIN}>Login</Link>
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
                                <Link to={Path.ADMIN_WORKBENCH}><button className="settings-icon" ><FontAwesomeIcon className="fa-2xl" icon={faGear} /></button></Link>
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

export default Navbar