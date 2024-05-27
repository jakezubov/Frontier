import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './Home';
import MetalConverter from './jewellery/MetalConverter';
import RingWeight from './jewellery/RingWeight';
import RingResizer from './jewellery/RingResizer';
import RollingWire from './jewellery/RollingWire';
import Register from './account/Register';
import Login from './account/Login';
import ForgotPassword from './account/ForgotPassword';
import MyAccount from './account/MyAccount';
import MetalSettings from './account/MetalSettings';
import RingSizeSettings from './account/RingSizeSettings';
import LoginConfirmation from './account/LoginConfirmation';
import RegisterConfirmation from './account/RegisterConfirmation';
import LogoutConfirmation from './account/LogoutConfirmation';
import {
    metalConverterPath, ringWeightPath, ringResizerPath, rollingWirePath,
    registerPath, loginPath, forgotPasswordPath, myAccountPath,
    metalSettingsPath, ringSizeSettingsPath, loginConfirmationPath, logoutConfirmationPath,
    registerConfirmationPath
} from './Paths.jsx';

const App = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    const handleLogin = () => { 
        setLoggedIn(true)
        return <Navigate to={loginConfirmationPath} />
    }

    const handleLogout = () => {
        setLoggedIn(false)
        return <Navigate to={logoutConfirmationPath} />
    }

    const handleRegister = () => {
        return <Navigate to={registerConfirmationPath} />
    }

    return (
        <Router>
            <div>
                <nav className="navbar">
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to={metalConverterPath}>Metal Converter</Link></li>
                        <li><Link to={ringWeightPath}>Ring Weight</Link></li>
                        <li><Link to={ringResizerPath}>Ring Resizer</Link></li>
                        <li><Link to={rollingWirePath}>Rolling Wire</Link></li>
                        {
                            loggedIn ?
                                <>
                                    <li><Link to={myAccountPath}>My Account</Link></li>
                                    <li><Link to={metalSettingsPath}>Metal Settings</Link></li>
                                    <li><Link to={ringSizeSettingsPath}>Ring Size Settings</Link></li>
                                    <li><Link onClick={handleLogout} >Logout</Link></li>
                                </>
                                :
                                <>
                                    <li><Link to={registerPath}>Register</Link></li>
                                    <li><Link to={loginPath}>Login</Link></li>
                                </> 
                        }
                    </ul>
                </nav>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path={metalConverterPath} element={<MetalConverter />} />
                    <Route path={ringWeightPath} element={<RingWeight />} />
                    <Route path={ringResizerPath} element={<RingResizer />} />
                    <Route path={rollingWirePath} element={<RollingWire />} />
                    <Route path={registerPath} element={<Register onRegister={handleRegister} />} />
                    <Route path={loginPath} element={<Login onLogin={handleLogin} />} />
                    <Route path={forgotPasswordPath} element={<ForgotPassword />} />
                    <Route path={myAccountPath} element={<MyAccount />} />
                    <Route path={metalSettingsPath} element={<MetalSettings />} />
                    <Route path={ringSizeSettingsPath} element={<RingSizeSettings />} />
                    <Route path={loginConfirmationPath} element={<LoginConfirmation />} />
                    <Route path={logoutConfirmationPath} element={<LogoutConfirmation />} />
                    <Route path={registerConfirmationPath} element={<RegisterConfirmation />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;