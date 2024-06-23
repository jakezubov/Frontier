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
import LoginConfirmation from './account/LoginConfirmation';
import RegisterConfirmation from './account/RegisterConfirmation';
import LogoutConfirmation from './account/LogoutConfirmation';
import Path from './constants/Paths';

const App = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);

    const handleRegister = () => {
        return <Navigate to={Path.REGISTER_CONFIRMATION} />
    }

    const handleLogin = (id) => {
        setUserId(id)
        setLoggedIn(true)
        return <Navigate to={Path.LOGIN_CONFIRMATION} />
    }

    const handleLogout = () => {
        setUserId(null)
        setLoggedIn(false)
    }

    return (
        <Router>
            <div>
                <nav className="navbar">
                    <ul>
                        <li><Link className="link" to="/">Home</Link></li>
                        <li><Link className="link" to={Path.METAL_CONVERTER}>Metal Converter</Link></li>
                        <li><Link className="link" to={Path.RING_WEIGHT}>Ring Weight</Link></li>
                        <li><Link className="link" to={Path.RING_RESIZER}>Ring Resizer</Link></li>
                        <li><Link className="link" to={Path.ROLLING_WIRE}>Rolling Wire</Link></li>
                        {
                            loggedIn ?
                                <>
                                    <li><Link className="link" to={Path.MY_ACCOUNT}>My Account</Link></li>
                                    <li><Link className="link" to={Path.LOGOUT_CONFIRMATION} onClick={handleLogout} >Logout</Link></li>
                                </>
                                :
                                <>
                                    <li><Link className="link" to={Path.REGISTER}>Register</Link></li>
                                    <li><Link className="link" to={Path.LOGIN}>Login</Link></li>
                                </> 
                        }
                    </ul>
                </nav>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path={Path.METAL_CONVERTER} element={<MetalConverter userId={userId} />} />
                    <Route path={Path.RING_WEIGHT} element={<RingWeight userId={userId} />} />
                    <Route path={Path.RING_RESIZER} element={<RingResizer userId={userId} />} />
                    <Route path={Path.ROLLING_WIRE} element={<RollingWire userId={userId} />} />
                    <Route path={Path.REGISTER} element={<Register onRegister={handleRegister} />} />
                    <Route path={Path.LOGIN} element={<Login onLogin={handleLogin} />} />
                    <Route path={Path.FORGOT_PASSWORD} element={<ForgotPassword />} />
                    <Route path={Path.MY_ACCOUNT} element={<MyAccount userId={userId} />} />
                    <Route path={Path.LOGIN_CONFIRMATION} element={<LoginConfirmation />} />
                    <Route path={Path.LOGOUT_CONFIRMATION} element={<LogoutConfirmation />} />
                    <Route path={Path.REGISTER_CONFIRMATION} element={<RegisterConfirmation />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;