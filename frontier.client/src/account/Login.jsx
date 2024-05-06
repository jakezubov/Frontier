import { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerPath, forgotPasswordPath } from '../Paths.jsx';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {

    }

    return (
            <div>
                <h1>Login</h1>

                <table>
                    <tbody>
                        <tr>
                            <td>Email</td>
                            <td><input value={email} type="email" onChange={(e) => setEmail(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td>Password</td>
                            <td><input value={password} type="password" onChange={(e) => setPassword(e.target.value)} /></td>
                        </tr>
                    </tbody>
                </table>

                <button type="button" onClick={handleSubmit}>Submit</button>

                <table>
                    <tbody>
                        <tr>
                            <td><Link to={registerPath}>Register</Link></td>
                            <td><Link to={forgotPasswordPath}>Forgot Password</Link></td>
                        </tr>
                    </tbody>
                </table>
            </div>
    );
}

export default Login;