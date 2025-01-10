import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket, faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons'
import { useUserSession } from '../contexts/user-context'
import { useGetUser } from '../common/APIs'
import Path from '../common/paths'

const GeneralNavbar = ({ toggleNavbar, activateAccountNavbar, handleLogoutClick, submenuExpanded }) => {
    const { userId, setUserId, loggedInStatus } = useUserSession()
    const [toggleExpand, setToggleExpand] = useState(false)

    // APIs
    const { getUser } = useGetUser()

    useEffect(() => {
        checkLoggedInStatus()
    }, [])

    useEffect(() => {
        setToggleExpand(submenuExpanded)
    }, [submenuExpanded])

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
            <ul>
                <li><h2 className="tight-bottom">Navigation</h2></li>
            </ul>
            <ul className={`submenu ${toggleExpand ? 'expanded' : 'collapsed'}`}>
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
                            <FontAwesomeIcon className="fa-xl login-logout-icon-spacing" icon={faArrowRightFromBracket} />
                            <Link className="navbar-links" onClick={handleLogoutClick} >Logout</Link>
                        </li>
                    </>
                    :
                    <>
                        <li><Link className="navbar-links" onClick={toggleNavbar} to={Path.REGISTER}>Register</Link></li>
                        <hr />
                        <li>
                            <FontAwesomeIcon className="fa-xl login-logout-icon-spacing" icon={faArrowRightToBracket} />
                            <Link className="navbar-links" onClick={toggleNavbar} to={Path.LOGIN}>Login</Link>
                        </li>
                    </>
                }
            </ul>
        </div>
    )
}

GeneralNavbar.propTypes = {
    toggleNavbar: PropTypes.func.isRequired,
    activateAccountNavbar: PropTypes.func.isRequired,
    handleLogoutClick: PropTypes.func.isRequired,
    submenuExpanded: PropTypes.bool.isRequired,
}

export default GeneralNavbar