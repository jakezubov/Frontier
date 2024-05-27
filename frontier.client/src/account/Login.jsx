import { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerPath, forgotPasswordPath } from '../Paths.jsx';
import Axios from 'axios';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    var url = `http://localhost:5221/api/Users/Validate/${email}`;

    const handleSubmit = async () => {
        try {
            const response = await Axios.get(url, {
                params: {
                    email: email,
                    password: password
                }
            });

            if (response.data) {
                onLogin(); // Call the callback function
            }
            else {
                alert('Email or Password Incorrect');
            }
        }
        catch (error) {
            alert('There was an error submitting the form!');
        }
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