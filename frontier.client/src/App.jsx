import './App.css'
import { useContext, useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket, faArrowRightToBracket, faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons'
import { updateCSSVariables } from './Themes'
import { UserContext } from './contexts/UserContext'
import { JewelleryPageContext } from './contexts/JewelleryPageContext'
import Home from './Home'
import MetalConverter from './jewellery/MetalConverter'
import RingWeight from './jewellery/RingWeight'
import RingResizer from './jewellery/RingResizer'
import RollingWire from './jewellery/RollingWire'
import Register from './account/Register'
import Login from './account/Login'
import ForgotPassword from './account/ForgotPassword'
import MyAccount from './account/MyAccount'
import VerifyAccount from './account/VerifyAccount'
import Sidebar from './components/Sidebar'
import PopupLogout from './components/PopupLogout'
import JewelleryPage from './constants/JewelleryPages'
import Path from './constants/Paths'
import ConfirmationScreen from './account/ConfirmationScreen'


const App = () => {
    const { userId, setUserId } = useContext(UserContext)
    const { setJewelleryPage } = useContext(JewelleryPageContext)
    const [loggedIn, setLoggedIn] = useState(!!userId)
    const [refreshSidebar, setRefreshSidebar] = useState('')
    const [confirmationMessage, setConfirmationMessage] = useState('')
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
    const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false)

    useEffect(() => {
        updateCSSVariables(theme);
        localStorage.setItem('theme', theme)
    }, [theme])

    useEffect(() => {
        setLoggedIn(!!userId)
    }, [userId])

    useEffect(() => {
        setJewelleryPage(JewelleryPage.NONE)
    }, [])

    const handlePageChange = (page) => () => {
        setJewelleryPage(page)
        setRefreshSidebar(new Date().toLocaleTimeString())
    }

    const handleHistoryRefresh = () => {
        setRefreshSidebar(new Date().toLocaleTimeString())
    }  

    const handleRegister = () => {
        setConfirmationMessage('Successfully registered account!')
    }

    const handleLogin = (id) => {
        setConfirmationMessage('Successfully logged in!')
        setUserId(id)
    }

    const handleLogout = () => {
        handlePageChange(JewelleryPage.NONE)
        setConfirmationMessage('Logged Out Successfully!')
        setUserId(null)
    }

    const handleDeleteAccount = () => {
        handlePageChange(JewelleryPage.NONE)
        setConfirmationMessage('Account has been deleted!')
        setUserId(null)
    }

    const handleThemeChange = () => {
        theme === 'light' ? setTheme('dark') : setTheme('light') 
    }

    return (
        <Router>
            <div>
                <nav className="navbar">
                    <ul>
                        <li><Link className="navbar-links" onClick={handlePageChange(JewelleryPage.NONE)} to="/">Home</Link></li>
                        <hr />
                        <li><Link className="navbar-links" onClick={handlePageChange(JewelleryPage.METAL_CONVERTER)} to={Path.METAL_CONVERTER}>Metal Converter</Link></li>
                        <hr />
                        <li><Link className="navbar-links" onClick={handlePageChange(JewelleryPage.RING_WEIGHT)} to={Path.RING_WEIGHT}>Ring Weight</Link></li>
                        <hr />
                        <li><Link className="navbar-links" onClick={handlePageChange(JewelleryPage.RING_RESIZER)} to={Path.RING_RESIZER}>Ring Resizer</Link></li>
                        <hr />
                        <li><Link className="navbar-links" onClick={handlePageChange(JewelleryPage.ROLLING_WIRE)} to={Path.ROLLING_WIRE}>Rolling Wire</Link></li>
                        <hr />
                    {
                        loggedIn ?
                        <>
                            <li><Link className="navbar-links" onClick={handlePageChange(JewelleryPage.NONE)} to={Path.MY_ACCOUNT}>My Account</Link></li>
                            <hr />
                            <li>
                                <FontAwesomeIcon className="fa-xl navbar-icon-spacing" icon={faArrowRightFromBracket} />
                                <Link className="navbar-links" onClick={() => setIsLogoutPopupOpen(true)} >Logout</Link>
                            </li>
                        </>
                        :
                        <>
                            <li><Link className="navbar-links" onClick={handlePageChange(JewelleryPage.NONE)} to={Path.REGISTER}>Register</Link></li>
                            <hr />
                            <li>
                                <FontAwesomeIcon className="fa-xl navbar-icon-spacing" icon={faArrowRightToBracket} />
                                <Link className="navbar-links" onClick={handlePageChange(JewelleryPage.NONE)} to={Path.LOGIN}>Login</Link>
                            </li>
                        </>
                    }
                    </ul>
                    <div className="theme-buttons">
                        <button className="settings-icon" onClick={handleThemeChange}><FontAwesomeIcon className="fa-2xl" icon={faCircleHalfStroke} /></button>
                    </div>
                </nav>

                {isLogoutPopupOpen && (
                    <PopupLogout isPopupOpen={isLogoutPopupOpen} setIsPopupOpen={setIsLogoutPopupOpen} onConfirm={handleLogout} />
                )}

                <Sidebar refresh={refreshSidebar} />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path={Path.METAL_CONVERTER} element={<MetalConverter onRefresh={handleHistoryRefresh} />} />
                    <Route path={Path.RING_WEIGHT} element={<RingWeight onRefresh={handleHistoryRefresh} />} />
                    <Route path={Path.RING_RESIZER} element={<RingResizer onRefresh={handleHistoryRefresh} />} />
                    <Route path={Path.ROLLING_WIRE} element={<RollingWire onRefresh={handleHistoryRefresh} />} />
                    <Route path={Path.REGISTER} element={<Register onRegister={handleRegister} />} />
                    <Route path={Path.LOGIN} element={<Login onLogin={handleLogin} />} />
                    <Route path={Path.FORGOT_PASSWORD} element={<ForgotPassword />} />
                    <Route path={Path.MY_ACCOUNT} element={<MyAccount onDelete={handleDeleteAccount} />} />
                    <Route path={Path.VERIFY_ACCOUNT} element={<VerifyAccount />} />
                    <Route path={Path.CONFIRMATION_SCREEN} element={<ConfirmationScreen message={confirmationMessage} />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App