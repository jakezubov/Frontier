import './App.css'
import { useContext, useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { UserContext } from './contexts/UserContext'
import { JewelleryPageContext } from './contexts/JewelleryPageContext'
import { useGetUser } from './common/APIs'
import JewelleryPage from './common/JewelleryPages'
import Path from './common/Paths'
import Navbar from './components/Navbar'
import Home from './Home'
import MetalConverter from './jewellery/MetalConverter'
import RingWeight from './jewellery/RingWeight'
import RingResizer from './jewellery/RingResizer'
import RollingWire from './jewellery/RollingWire'
import Register from './account/Register'
import Login from './account/Login'
import ForgotPassword from './account/ForgotPassword'
import MyAccount from './account/MyAccount'
import ConfirmationScreen from './account/ConfirmationScreen'
import VerifyAccount from './account/email/VerifyAccount'
import ResetPassword from './account/email/ResetPassword'
import AdminWorkbench from './admin/AdminWorkbench'
import Sidebar from './sidebar/Sidebar'
import FirstTimeSetup from './setup/FirstTimeSetup'
import FirstTimeSetupHandler from './setup/FirstTimeSetupHandler'

const App = () => {
    const { userId, setUserId } = useContext(UserContext)
    const { jewelleryPage, setJewelleryPage } = useContext(JewelleryPageContext)
    const [loggedIn, setLoggedIn] = useState(!!userId)
    const [adminStatus, setAdminStatus] = useState(false)
    const [setupComplete, setSetupComplete] = useState(true)
    const [confirmationMessage, setConfirmationMessage] = useState('')

    // APIs
    const { getUser } = useGetUser()

    useEffect(() => {
        getAdminStatus(userId)
        setJewelleryPage(jewelleryPage)
        getLoggedInStatus()
    }, [])

    useEffect(() => {
        setLoggedIn(!!userId)
    }, [userId])

    const handleRegister = () => {
        setConfirmationMessage('Successfully registered account!')
    }

    const handleLogin = (id) => {
        setConfirmationMessage('Successfully logged in!')
        setUserId(id)
        getAdminStatus(id)
    }

    const handleLogout = () => {
        setJewelleryPage(JewelleryPage.NONE)
        setConfirmationMessage('Logged Out Successfully!')
        setUserId(null)
        setAdminStatus(false)
    }

    const handleDeleteAccount = () => {
        setJewelleryPage(JewelleryPage.NONE)
        setConfirmationMessage('Account has been deleted!')
        setUserId(null)
        setAdminStatus(false)
    }

    const getAdminStatus = async (id) => {
        if (id != null) {
            const user = await getUser(id)
            setAdminStatus(user.adminTF)
        }
    }

    const getLoggedInStatus = async () => {
        if (userId != null) {
            const user = await getUser(userId)
            if (!user.loggedInTF) {
                setJewelleryPage(JewelleryPage.NONE)
                setConfirmationMessage('You have logged out in another window!')
                setUserId(null)
                setAdminStatus(false)
            }
        }
    }

    return (
        <Router>
            <div>
                <FirstTimeSetupHandler onNotAlreadySetup={() => setSetupComplete(false)} />
                {setupComplete
                    ? <div>
                        <Navbar adminStatus={adminStatus} loggedIn={loggedIn} onLogout={handleLogout} />
                        <Sidebar />
                    </div> : null
                }

                <Routes>
                    <Route path={Path.HOME} element={<Home />} />
                    <Route path={Path.METAL_CONVERTER} element={<MetalConverter />} />
                    <Route path={Path.RING_WEIGHT} element={<RingWeight />} />
                    <Route path={Path.RING_RESIZER} element={<RingResizer />} />
                    <Route path={Path.ROLLING_WIRE} element={<RollingWire />} />
                    <Route path={Path.REGISTER} element={<Register onRegister={handleRegister} />} />
                    <Route path={Path.LOGIN} element={<Login onLogin={handleLogin} />} />
                    <Route path={Path.FORGOT_PASSWORD} element={<ForgotPassword />} />
                    <Route path={Path.MY_ACCOUNT} element={<MyAccount onDelete={handleDeleteAccount} />} />
                    <Route path={Path.CONFIRMATION_SCREEN} element={<ConfirmationScreen message={confirmationMessage} />} />
                    <Route path={Path.VERIFY_ACCOUNT} element={<VerifyAccount />} />
                    <Route path={Path.RESET_PASSWORD} element={<ResetPassword />} />
                    <Route path={Path.ADMIN_WORKBENCH} element={<AdminWorkbench />} />
                    <Route path={Path.FIRST_TIME_SETUP} element={<FirstTimeSetup onSetupComplete={() => setSetupComplete(true)} />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App