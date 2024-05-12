import { useState, useEffect } from 'react';

const MyAccount = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setNewConfirmPassword] = useState('');
    const [history, setHistory] = useState('');

    useEffect(() => {
        getInfo();
    }, []);

    const getInfo = () => {
        setName("Test");
        setEmail("test@email.com");
        setHistory("15");
    }

    const handleSubmit = () => {

    }

    return (
        <div>
            <h1>My Account</h1>
            
            <table>
                <tbody>
                    <tr>
                        <td>Name</td>
                        <td><input value={name} onChange={(e) => setName(e.target.value)} /></td>
                    </tr>
                    <tr><td></td></tr>
                    <tr>
                        <td>Email</td>
                        <td><input value={email} type="email" onChange={(e) => setEmail(e.target.value)} /></td>
                    </tr>
                    <tr><td></td></tr>
                    <tr>
                        <td>Old Password</td>
                        <td><input value={oldPassword} type="password" onChange={(e) => setOldPassword(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>New Password</td>
                        <td><input value={newPassword} type="password" onChange={(e) => setNewPassword(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Confirm New Password</td>
                        <td><input value={confirmNewPassword} type="password" onChange={(e) => setNewConfirmPassword(e.target.value)} /></td>
                    </tr>
                    <tr><td></td></tr>
                    <tr>
                        <td>History</td>
                        <td><input type="number" step="5" min="0" max="50" value={history} onChange={(e) => setHistory(e.target.value)} /></td>
                    </tr>
                </tbody>
            </table>

            <button type="button" onClick={handleSubmit}>Save Changes</button>
        </div>
    );
}

export default MyAccount;