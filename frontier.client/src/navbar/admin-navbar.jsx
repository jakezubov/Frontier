import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Path from '../common/paths'

const AdminNavbar = ({ toggleNavbar, backSelected, submenuExpanded }) => {
    const [toggleExpand, setToggleExpand] = useState(false)

    useEffect(() => {
        setToggleExpand(submenuExpanded)
    }, [submenuExpanded])

    return (
        <div>
            <ul>
                <li><h2 className="tight-bottom">Admin Settings</h2></li>
                <br />
            </ul>
            <ul className={`submenu ${toggleExpand ? 'expanded' : 'collapsed'}`}>
                <li><Link className="navbar-links" onClick={backSelected} >Back</Link></li>
                <hr />
                <li><Link className="navbar-links" onClick={toggleNavbar} to={Path.DEFAULT_METALS} >Metals Settings</Link></li>
                <hr />
                <li><Link className="navbar-links" onClick={toggleNavbar} to={Path.DEFAULT_RING_SIZES} >Ring Sizes Settings</Link></li>
                <hr />
                <li><Link className="navbar-links" onClick={toggleNavbar} to={Path.USER_ACCOUNTS} >User Accounts</Link></li>
                <hr />
                <li><Link className="navbar-links" onClick={toggleNavbar} to={Path.ERROR_LEDGER} >API Error Ledger</Link></li>
                <hr />
                <li><Link className="navbar-links" onClick={toggleNavbar} to={Path.CONFIGURE_EMAIL} >Configure Email</Link></li>
            </ul>
        </div>
    )
}

AdminNavbar.propTypes = {
    toggleNavbar: PropTypes.func.isRequired,
    backSelected: PropTypes.func.isRequired,
    submenuExpanded: PropTypes.bool.isRequired,
}

export default AdminNavbar