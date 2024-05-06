import { useState } from 'react'; 
import { Link } from 'react-router-dom';
import { loginPath, forgotPasswordPath } from '../Paths.jsx';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = () => {
        const fullName = firstName + " " + lastName;
    }

    return (
        <div>
            <h1>Register</h1>

            <table>
                <tbody>
                    <tr>
                        <td>First Name</td>
                        <td><input value={firstName} onChange={(e) => setFirstName(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Last Name</td>
                        <td><input value={lastName} onChange={(e) => setLastName(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td><input value={email} type="email" onChange={(e) => setEmail(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Password</td>
                        <td><input value={password} type="password" onChange={(e) => setPassword(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Confirm Password</td>
                        <td><input value={confirmPassword} type="password" onChange={(e) => setConfirmPassword(e.target.value)} /></td>
                    </tr>
                </tbody>
            </table>

            <button type="button" onClick={handleSubmit}>Submit</button>

            <table>
                <tbody>
                    <tr>
                        <td><Link to={loginPath}>Login</Link></td>
                        <td><Link to={forgotPasswordPath}>Forgot Password</Link></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Register;