import { useState } from 'react'; 
import { Link } from 'react-router-dom';
import Path from '../constants/Paths';
import URL from '../constants/URLs';
import Axios from 'axios';

const Register = ({ onRegister }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async () => {
        if (firstName === '' || lastName === '' || email === '' || password === '' || confirmPassword === '') {
            alert('Please enter all information!')
            return
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            await Axios.post(URL.CREATE_USER, {
                'FirstName': firstName,
                'LastName': lastName,
                'Email': email,
                'PasswordHash': password
            });

            alert('Successfully registered account!')
            onRegister(); // Call the callback function
        }
        catch (error) {
            console.log(error)
            alert('There was an error submitting the form!');
        }
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
                        <td><Link to={Path.LOGIN}>Login</Link></td>
                        <td><Link to={Path.FORGOT_PASSWORD}>Forgot Password</Link></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Register;