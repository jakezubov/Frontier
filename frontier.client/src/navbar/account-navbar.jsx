import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Path from '../consts/paths'

const AccountNavbar = ({ toggleNavbar, backSelected, submenuExpanded }) => {
    const [toggleExpand, setToggleExpand] = useState(false)

    useEffect(() => {
        setToggleExpand(submenuExpanded)
    }, [submenuExpanded])

    return (
        <div>
            <ul>
                <li><h2 className="tight-bottom">My Account</h2></li>
            </ul>
            <ul className={`submenu ${toggleExpand ? 'expanded' : 'collapsed'}`}>
                <li><Link className="navbar-links" onClick={backSelected} >Back</Link></li>
                <hr />
                <li><Link className="navbar-links" onClick={toggleNavbar} to={Path.USER_SETTINGS} >User Settings</Link></li>
                <hr />
                <li><Link className="navbar-links" onClick={toggleNavbar} to={Path.UPDATE_PASSWORD} >Update Password</Link></li>
                <hr />
                <li><Link className="navbar-links" onClick={toggleNavbar} to={Path.METAL_SETTINGS} >Metal Settings</Link></li>
                <hr />
                <li><Link className="navbar-links" onClick={toggleNavbar} to={Path.RING_SIZE_SETTINGS} >Ring Size Settings</Link></li>
            </ul>
        </div>
    )
}

AccountNavbar.propTypes = {
    toggleNavbar: PropTypes.func.isRequired,
    backSelected: PropTypes.func.isRequired,
    submenuExpanded: PropTypes.bool.isRequired,
}

export default AccountNavbar