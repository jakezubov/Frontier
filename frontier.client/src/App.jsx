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
import UserSettings from './account/user-settings'
import UpdatePassword from './account/update-password'
import MetalSettings from './account/metal-settings'
import RingSizeSettings from './account/ring-size-settings'
import UserAccounts from './admin/user-accounts'
import DefaultMetals from './admin/default-metals'
import DefaultRingSizes from './admin/default-ring-sizes'
import ConfigureEmail from './admin/configure-email'
import ErrorLedger from './admin/error-ledger'
import Navbar from './navbar/navbar'
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
                    <Route path={Path.CONFIRMATION_SCREEN} element={<ConfirmationScreen />} />
                    <Route path={Path.RESET_PASSWORD} element={<ResetPassword />} />
                    <Route path={Path.FIRST_TIME_SETUP} element={<FirstTimeSetup onSetupComplete={() => setSetupComplete(true)} />} />
                    <Route path={Path.USER_SETTINGS} element={<UserSettings />} />
                    <Route path={Path.UPDATE_PASSWORD} element={<UpdatePassword />} />
                    <Route path={Path.METAL_SETTINGS} element={<MetalSettings />} />
                    <Route path={Path.RING_SIZE_SETTINGS} element={<RingSizeSettings />} />
                    <Route path={Path.USER_ACCOUNTS} element={<UserAccounts />} />
                    <Route path={Path.DEFAULT_METALS} element={<DefaultMetals />} />
                    <Route path={Path.DEFAULT_RING_SIZES} element={<DefaultRingSizes />} />
                    <Route path={Path.CONFIGURE_EMAIL} element={<ConfigureEmail />} />
                    <Route path={Path.ERROR_LEDGER} element={<ErrorLedger />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App