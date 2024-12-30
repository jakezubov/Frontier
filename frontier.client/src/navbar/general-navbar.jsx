import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket, faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons'
import { useUserSession } from '../contexts/user-context'
import { useLogLogout, useGetUser } from '../common/APIs'
import PopupLogout from '../popups/popup-logout'
import Path from '../common/paths'

const GeneralNavbar = ({ toggleNavbar, activateAccountNavbar }) => {
    const { userId, setUserId, loggedInStatus } = useUserSession()
    const navigate = useNavigate()
    const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false)

    // APIs
    const { logLogout } = useLogLogout()
    const { getUser } = useGetUser()

    useEffect(() => {
        checkLoggedInStatus()
    }, [])

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

    const handleLogoutClick = () => {
        setIsLogoutPopupOpen(true)
        toggleNavbar()
    }

    return (
        <div>
            <ul>
                <li><h2 className="tight-bottom">Navigation</h2></li>
                <br />
                <li><Link className="navbar-links" onClick={toggleNavbar} to="/">Home</Link></li>
                <hr />
                <li><Link className="navbar-links" onClick={toggleNavbar} to={Path.METAL_CONVERTER}>Metal Converter</Link></li>
                <hr />
                <li><Link className="navbar-links" onClick={toggleNavbar} to={Path.RING_WEIGHT}>Ring Weight</Link></li>
                <hr />
                <li><Link className="navbar-links" onClick={toggleNavbar} to={Path.RING_RESIZER}>Ring Resizer</Link></li>
                <hr />
                <li><Link className="navbar-links" onClick={toggleNavbar} to={Path.ROLLING_WIRE}>Rolling Wire</Link></li>
                <hr />
                {loggedInStatus ?
                    <>
                        <li><Link className="navbar-links" onClick={activateAccountNavbar}>My Account</Link></li>
                        <hr />
                        <li>
                            <FontAwesomeIcon className="fa-xl navbar-icon-spacing" icon={faArrowRightFromBracket} />
                            <Link className="navbar-links" onClick={handleLogoutClick} >Logout</Link>
                        </li>
                    </>
                    :
                    <>
                        <li><Link className="navbar-links" onClick={toggleNavbar} to={Path.REGISTER}>Register</Link></li>
                        <hr />
                        <li>
                            <FontAwesomeIcon className="fa-xl navbar-icon-spacing" icon={faArrowRightToBracket} />
                            <Link className="navbar-links" onClick={toggleNavbar} to={Path.LOGIN}>Login</Link>
                        </li>
                    </>
                }
            </ul>

            {isLogoutPopupOpen && (
                <PopupLogout isPopupOpen={isLogoutPopupOpen} setIsPopupOpen={setIsLogoutPopupOpen} onConfirm={handleLogout} />
            )}
        </div>
    )
}

GeneralNavbar.propTypes = {
    toggleNavbar: PropTypes.func.isRequired,
    activateAccountNavbar: PropTypes.func.isRequired,
}

export default GeneralNavbar