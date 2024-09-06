import { useState } from 'react'
import { Link } from 'react-router-dom'
import UserAccounts from './UserAccounts'
import DefaultRingSizes from './DefaultRingSizes'
import DefaultMetals from './DefaultMetals'
import AdminPages from '../constants/AdminPages'

const AdminWorkbench = () => {
    const [currentPage, setCurrentPage] = useState(AdminPages.USER_ACCOUNTS)

    return (
        <div>
            <nav className="navbar-my-account">
                <ul>
                    <li><Link className="navbar-my-account-links" onClick={() => setCurrentPage(AdminPages.USER_ACCOUNTS)} >User Accounts</Link></li>
                    <li><Link className="navbar-my-account-links" onClick={() => setCurrentPage(AdminPages.DEFAULT_METALS)} >Metals Settings</Link></li>
                    <li><Link className="navbar-my-account-links" onClick={() => setCurrentPage(AdminPages.DEFAULT_RING_SIZES)} >Ring Sizes Settings</Link></li>
                </ul>
            </nav>
            <div>
                {currentPage === AdminPages.USER_ACCOUNTS && (
                    <UserAccounts />
                )}
                {currentPage === AdminPages.DEFAULT_METALS && (
                    <DefaultMetals />
                )}
                {currentPage === AdminPages.DEFAULT_RING_SIZES && (
                    <DefaultRingSizes />
                )}
            </div>
        </div>
    )
}

export default AdminWorkbench