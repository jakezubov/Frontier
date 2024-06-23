import { useState, useEffect } from 'react';
import MetalSelector from '../jewellery/MetalSelector';
import RingSizeSelector from '../jewellery/RingSizeSelector';
import URL from '../constants/URLs';
import Axios from 'axios';

const MyAccount = ({ userId }) => {
    // Personal Details
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setNewConfirmPassword] = useState('');
    const [historyAmount, setHistoryAmount] = useState('');

    // Metal Settings
    const [metal, setMetal] = useState(null);
    const [metalName, setMetalName] = useState('');
    const [specificGravity, setSpecificGravity] = useState('');
    const [changeMetalType, setChangeMetalType] = useState('');

    // Ring Size Settings
    const [size, setSize] = useState(null);
    const [letterSize, setLetterSize] = useState('');
    const [numberSize, setNumberSize] = useState('');
    const [diameter, setDiameter] = useState('');
    const [changeRingSizeType, setChangeRingSizeType] = useState('');

    useEffect(() => {
        getInfo()
    }, []);

    const getInfo = async () => {
        try {
            const response = await Axios.get(URL.GET_USER(userId));

            setFirstName(response.data.firstName)
            setLastName(response.data.lastName)
            setEmail(response.data.email)
            setHistoryAmount(response.data.historyAmount)
        }
        catch (error) {
            console.log(error)
            alert('There was an error getting the user info!')
        }
    }

    const handlePersonalDetailsSubmit = async () => {
        if (oldPassword !== '' || newPassword !== '' || confirmNewPassword !== '') {
            try {
                await Axios.get(URL.VALIDATE_USER, {
                    params: {
                        email: email,
                        password: oldPassword
                    }
                });

                if (newPassword !== confirmNewPassword) {
                    alert('New Passwords do not match')
                    return
                }

                await Axios.put(URL.UPDATE_USER(userId), {
                    Id: userId,
                    FirstName: firstName,
                    LastName: lastName,
                    Email: email,
                    PasswordHash: newPassword,
                    HistoryAmount: historyAmount,
                }, {
                    params: {
                        isNewPassword: true
                    }
                });

                alert('Account details updated!')
            }
            catch (error) {
                if (error.response && error.response.status === 401) {
                   alert('Old Password Incorrect')
                }
                else {
                    console.log(error)
                    alert('There was an error submitting the form!')
                }
            }
        }
        else {
            try {
                const response = await Axios.get(URL.GET_USER(userId))

                await Axios.put(URL.UPDATE_USER(userId), {
                    Id: userId,
                    FirstName: firstName,
                    LastName: lastName,
                    Email: email,
                    PasswordHash: response.data.passwordHash,
                    HistoryAmount: historyAmount,
                }, {
                    params: {
                        isNewPassword: false
                    }
                });

                alert('Account details updated!')
            }
            catch (error) {
                console.log(error)
                alert('There was an error submitting the form!')
            }
        }
    }

    const handleClearHistory = async () => {
        try {
            await Axios.delete(URL.DELETE_HISTORY(userId))
            alert('History has been deleted!')
        }
        catch (error) {
            console.log(error)
            alert('There was an error submitting the form!')
        }
    }

    const handleMetalChange = (selectedMetal) => {
        setMetal(selectedMetal);
        changeMetalType !== "Add" ?
            (
                setName(selectedMetal.name),
                setSpecificGravity(selectedMetal.specificGravity)
            ) : null
    };

    const handleMetalRadioChange = (option) => {
        setChangeMetalType(option.target.value);
        option.target.value === "Add" ?
            (
                setName(''),
                setSpecificGravity('')
            )
            :
            (
                setName(metal.name),
                setSpecificGravity(metal.specificGravity)
            )
    }

    const handleMetalSubmit = () => {

    }

    const handleMetalReset = () => {

    }

    const handleRingSizeChange = (selectedSize) => {
        setSize(selectedSize);
        changeRingSizeType !== "Add" ?
            (
                setLetterSize(selectedSize.letterSize),
                setNumberSize(selectedSize.numberSize),
                setDiameter(selectedSize.diameter)
            ) : null
    }

    const handleRingSizeRadioChange = (option) => {
        setChangeRingSizeType(option.target.value);
        option.target.value === "Add" ?
            (
                setLetterSize(''),
                setNumberSize(''),
                setDiameter('')
            )
            :
            (
                setLetterSize(size.letterSize),
                setNumberSize(size.numberSize),
                setDiameter(size.diameter)
            )
    }

    const handleRingSizeSubmit = () => {

    }

    const handleRingSizeReset = () => {

    }

    return (
        <div>
            <h1>My Account</h1>

            <h2>Personal Details</h2>
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
                        <td><input type="number" step="5" min="0" max="50" value={historyAmount} onChange={(e) => setHistoryAmount(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td><button type="button" onClick={handlePersonalDetailsSubmit}>Save Changes</button></td>
                        <td><button type="button" onClick={handleClearHistory}>Clear History</button></td>
                    </tr>
                </tbody>
            </table>

            <br />
            <br />

            <h2>Metal Settings</h2>
            <table>
                <tbody>
                    <tr>
                        <td><input type="radio" value="Add" name="changeMetalType" onChange={handleMetalRadioChange} /> Add</td>
                        <td><input type="radio" value="Modify" name="changeMetalType" onChange={handleMetalRadioChange} /> Modify</td>
                        <td><input type="radio" value="Delete" name="changeMetalType" onChange={handleMetalRadioChange} /> Delete</td>
                    </tr>
                </tbody>
            </table>
            <table>
                <tbody>
                    <tr>
                        <td>Metal</td>
                        <td><MetalSelector label="Metal" onMetalChange={handleMetalChange} /></td>
                    </tr>
                    {
                        changeMetalType !== "Delete" ?
                            <>
                                <tr>
                                    <td>Name</td>
                                    <td><input value={metalName} onChange={(e) => setMetalName(e.target.value)} /></td>
                                </tr>
                                <tr>
                                    <td>Specific Gravity</td>
                                    <td><input value={specificGravity} onChange={(e) => setSpecificGravity(e.target.value)} /></td>
                                </tr>
                            </> : null
                    }
                    <tr>
                        <td><button type="button" onClick={handleMetalSubmit}>Save Changes</button></td>
                        <td><button type="button" onClick={handleMetalReset}>Reset to Defaults</button></td>
                    </tr>
                </tbody>
            </table>

            <br />
            <br />

            <h2>Ring Size Settings</h2>
            <table>
                <tbody>
                    <tr>
                        <td><input type="radio" value="Add" name="changeRingSizeType" onChange={handleRingSizeRadioChange} /> Add</td>
                        <td><input type="radio" value="Modify" name="changeRingSizeType" onChange={handleRingSizeRadioChange} /> Modify</td>
                        <td><input type="radio" value="Delete" name="changeRingSizeType" onChange={handleRingSizeRadioChange} /> Delete</td>
                    </tr>
                </tbody>
            </table>
            <table>
                <tbody>
                    <tr>
                        <td>Ring Size</td>
                        <td><RingSizeSelector label="Ring Size" onSizeChange={handleRingSizeChange} /></td>
                    </tr>
                    {
                        changeRingSizeType !== "Delete" ?
                            <>
                                <tr>
                                    <td>Letter Size</td>
                                    <td><input value={letterSize} onChange={(e) => setLetterSize(e.target.value)} /></td>
                                </tr>
                                <tr>
                                    <td>Number Size</td>
                                    <td><input value={numberSize} onChange={(e) => setNumberSize(e.target.value)} /></td>
                                </tr>
                                <tr>
                                    <td>Diameter</td>
                                    <td><input value={diameter} onChange={(e) => setDiameter(e.target.value)} /></td>
                                </tr>
                            </> : null
                    }
                    <tr>
                        <td><button type="button" onClick={handleRingSizeSubmit}>Save Changes</button></td>
                        <td><button type="button" onClick={handleRingSizeReset}>Reset to Defaults</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default MyAccount;