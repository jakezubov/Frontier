import './App.css'
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import Home from './Home'
import MetalConverter from './jewellery/MetalConverter'
import RingWeight from './jewellery/RingWeight'
import RingResizer from './jewellery/RingResizer'
import RollingWire from './jewellery/RollingWire'
import Register from './account/Register'
import Login from './account/Login'
import ForgotPassword from './account/ForgotPassword'
import MyAccount from './account/MyAccount'
import Sidebar from './components/Sidebar'
import JewelleryPage from './constants/JewelleryPages';
import Path from './constants/Paths'
import ConfirmationScreen from './account/ConfirmationScreen'

const App = () => {
    const [loggedIn, setLoggedIn] = useState(false)
    const [userId, setUserId] = useState(null)
    const [refresh, setRefresh] = useState('')
    const [jewelleryPage, setJewelleryPage] = useState(JewelleryPage.NONE)
    const [confirmationMessage, setConfirmationMessage] = useState('')
    const [resetSidebarOnLogout, setResetSidebarOnLogout] = useState('')

    const refreshSidebar = (page) => () => {
        setJewelleryPage(page)
        setRefresh(new Date().toLocaleTimeString())
    }

    const handleRegister = () => {
        setConfirmationMessage('Successfully registered account!')
        return <Navigate to={Path.REGISTER_CONFIRMATION} /> // FIX
    }

    const handleLogin = (id) => {
        setConfirmationMessage('Successfully logged in!')
        setUserId(id)
        setLoggedIn(true)
        return <Navigate to={Path.LOGIN_CONFIRMATION} /> // FIX
    }

    const handleLogout = () => {
        setConfirmationMessage('Logged Out Successfully!')
        setUserId(null)
        setLoggedIn(false)
        setResetSidebarOnLogout(new Date().toLocaleTimeString())
    }

    const handleRefresh = (onRefresh) => {
        setRefresh(onRefresh)
    }  

    const handleDeleteAccount = () => {
        setConfirmationMessage('Account has been deleted!')
        setUserId(null)
        setLoggedIn(false)
    }

    return (
        <Router>
            <div className="app-container">
                    <nav className="navbar">
                        <ul>
                            <li><Link className="link" onClick={refreshSidebar(JewelleryPage.NONE)} to="/">Home</Link></li>
                            <hr />
                            <li><Link className="link" onClick={refreshSidebar(JewelleryPage.METAL_CONVERTER)} to={Path.METAL_CONVERTER}>Metal Converter</Link></li>
                            <hr />
                            <li><Link className="link" onClick={refreshSidebar(JewelleryPage.RING_WEIGHT)} to={Path.RING_WEIGHT}>Ring Weight</Link></li>
                            <hr />
                            <li><Link className="link" onClick={refreshSidebar(JewelleryPage.RING_RESIZER)} to={Path.RING_RESIZER}>Ring Resizer</Link></li>
                            <hr />
                            <li><Link className="link" onClick={refreshSidebar(JewelleryPage.ROLLING_WIRE)} to={Path.ROLLING_WIRE}>Rolling Wire</Link></li>
                            <hr />
                            {
                                loggedIn ?
                                    <>
                                        <li><Link className="link" onClick={refreshSidebar(JewelleryPage.NONE)} to={Path.MY_ACCOUNT}>My Account</Link></li>
                                        <hr />
                                    <li><Link className="link" onClick={refreshSidebar(JewelleryPage.NONE)} to={Path.CONFIRMATION_SCREEN} onClick={handleLogout} >Logout <FontAwesomeIcon icon={faArrowRightFromBracket} /></Link></li>
                                    </>
                                    :
                                    <>
                                        <li><Link className="link" onClick={refreshSidebar(JewelleryPage.NONE)} to={Path.REGISTER}>Register</Link></li>
                                        <hr />
                                        <li><Link className="link" onClick={refreshSidebar(JewelleryPage.NONE)} to={Path.LOGIN}>Login</Link></li>
                                    </>
                            }
                        </ul>
                    </nav>

                <Sidebar userId={userId} jewelleryPage={jewelleryPage} refresh={refresh} onLogout={resetSidebarOnLogout} />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path={Path.METAL_CONVERTER} element={<MetalConverter userId={userId} onRefresh={handleRefresh} />} />
                    <Route path={Path.RING_WEIGHT} element={<RingWeight userId={userId} onRefresh={handleRefresh} />} />
                    <Route path={Path.RING_RESIZER} element={<RingResizer userId={userId} onRefresh={handleRefresh} />} />
                    <Route path={Path.ROLLING_WIRE} element={<RollingWire userId={userId} onRefresh={handleRefresh} />} />
                    <Route path={Path.REGISTER} element={<Register onRegister={handleRegister} />} />
                    <Route path={Path.LOGIN} element={<Login onLogin={handleLogin} />} />
                    <Route path={Path.FORGOT_PASSWORD} element={<ForgotPassword />} />
                    <Route path={Path.MY_ACCOUNT} element={<MyAccount userId={userId} onDelete={handleDeleteAccount} />} />
                    <Route path={Path.CONFIRMATION_SCREEN} element={<ConfirmationScreen message={confirmationMessage} />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App