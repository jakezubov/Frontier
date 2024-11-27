import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUserSession } from '../contexts/user-context'
import UserAccounts from './user-accounts'
import DefaultRingSizes from './default-ring-sizes'
import DefaultMetals from './default-metals'
import ConfigureEmail from './configure-email'
import Path from '../common/paths'

const AdminPages = {
    USER_ACCOUNTS: 'UserAccounts',
    DEFAULT_METALS: 'DefaultMetals',
    DEFAULT_RING_SIZES: 'DefaultRingSizes',
    CONFIGURE_EMAIL: 'ConfigureEmail',
}

const AdminWorkbench = () => {
    const { adminStatus } = useUserSession()
    const navigate = useNavigate()

    const [currentPage, setCurrentPage] = useState(AdminPages.USER_ACCOUNTS)

    useEffect(() => {
        if (!adminStatus) {
            navigate(Path.CONFIRMATION_SCREEN, {
                state: { message: 'You need to be an admin to access that page!' }
            })
        }
    }, [adminStatus])

    return (
        <div>
            <nav className="navbar-my-account">
                <ul>
                    <li><Link className="navbar-my-account-links" onClick={() => setCurrentPage(AdminPages.USER_ACCOUNTS)} >User Accounts</Link></li>
                    <li><Link className="navbar-my-account-links" onClick={() => setCurrentPage(AdminPages.DEFAULT_METALS)} >Metals Settings</Link></li>
                    <li><Link className="navbar-my-account-links" onClick={() => setCurrentPage(AdminPages.DEFAULT_RING_SIZES)} >Ring Sizes Settings</Link></li>
                    <li><Link className="navbar-my-account-links" onClick={() => setCurrentPage(AdminPages.CONFIGURE_EMAIL)} >Configure Email</Link></li>
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
                {currentPage === AdminPages.CONFIGURE_EMAIL && (
                    <ConfigureEmail />
                )}
            </div>
        </div>
    )
}

export default AdminWorkbench