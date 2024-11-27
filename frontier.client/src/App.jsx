import './App.css'
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Home'
import Path from './common/paths'
import Register from './core/register'
import Login from './core/login'
import ForgotPassword from './core/forgot-password'
import ResetPassword from './core/reset-password'
import ConfirmationScreen from './core/confirmation-screen'
import Calculations from './jewellery/calculations'
import MetalConverter from './jewellery/metal-converter'
import RingWeight from './jewellery/ring-weight'
import RingResizer from './jewellery/ring-resizer'
import RollingWire from './jewellery/rolling-wire'
import MyAccount from './account/my-account'
import AdminWorkbench from './admin/admin-workbench'
import Navbar from './components/navbar'
import Sidebar from './sidebar/sidebar'
import FirstTimeSetup from './setup/first-time-setup'
import FirstTimeSetupHandler from './setup/first-time-setup-handler'

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
                    <Route path={Path.CALCULATIONS} element={<Calculations />} />
                    <Route path={Path.METAL_CONVERTER} element={<MetalConverter />} />
                    <Route path={Path.RING_WEIGHT} element={<RingWeight />} />
                    <Route path={Path.RING_RESIZER} element={<RingResizer />} />
                    <Route path={Path.ROLLING_WIRE} element={<RollingWire />} />
                    <Route path={Path.REGISTER} element={<Register />} />
                    <Route path={Path.LOGIN} element={<Login />} />
                    <Route path={Path.FORGOT_PASSWORD} element={<ForgotPassword />} />
                    <Route path={Path.MY_ACCOUNT} element={<MyAccount />} />
                    <Route path={Path.CONFIRMATION_SCREEN} element={<ConfirmationScreen />} />
                    <Route path={Path.RESET_PASSWORD} element={<ResetPassword />} />
                    <Route path={Path.ADMIN_WORKBENCH} element={<AdminWorkbench />} />
                    <Route path={Path.FIRST_TIME_SETUP} element={<FirstTimeSetup onSetupComplete={() => setSetupComplete(true)} />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App