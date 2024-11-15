import './App.css'
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
    const [setupComplete, setSetupComplete] = useState(true)

    return (
        <Router>
            <div>
                <FirstTimeSetupHandler onNotAlreadySetup={() => setSetupComplete(false)} />
                {setupComplete
                    ? <div>
                        <Navbar />
                        <Sidebar />
                    </div> : null
                }

                <Routes>
                    <Route path={Path.HOME} element={<Home />} />
                    <Route path={Path.METAL_CONVERTER} element={<MetalConverter />} />
                    <Route path={Path.RING_WEIGHT} element={<RingWeight />} />
                    <Route path={Path.RING_RESIZER} element={<RingResizer />} />
                    <Route path={Path.ROLLING_WIRE} element={<RollingWire />} />
                    <Route path={Path.REGISTER} element={<Register />} />
                    <Route path={Path.LOGIN} element={<Login />} />
                    <Route path={Path.FORGOT_PASSWORD} element={<ForgotPassword />} />
                    <Route path={Path.MY_ACCOUNT} element={<MyAccount />} />
                    <Route path={Path.CONFIRMATION_SCREEN} element={<ConfirmationScreen />} />
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