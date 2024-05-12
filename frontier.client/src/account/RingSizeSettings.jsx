import { useState } from 'react';
import RingSizeSelector from '../jewellery/RingSizeSelector';

const RingSizeSettings = () => {
    const [size, setSize] = useState(null);
    const [letterSize, setLetterSize] = useState('');
    const [numberSize, setNumberSize] = useState('');
    const [diameter, setDiameter] = useState('');
    const [changeType, setChangeType] = useState('');

    const handleSizeChange = (selectedSize) => {
        setSize(selectedSize);
        changeType !== "Add" ?
            (
                setLetterSize(selectedSize.letterSize),
                setNumberSize(selectedSize.numberSize),
                setDiameter(selectedSize.diameter)
            ) : null
    }

    const handleRadioChange = (option) => {
        setChangeType(option.target.value);
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

    const handleSubmit = () => {

    }

    const handleReset = () => {

    }

    return (
        <div>
            <h1>Ring Size Settings</h1>

            <table>
                <tbody>
                    <tr>
                        <td><input type="radio" value="Add" name="changeType" onChange={handleRadioChange} /> Add</td>
                        <td><input type="radio" value="Modify" name="changeType" onChange={handleRadioChange} /> Modify</td>
                        <td><input type="radio" value="Delete" name="changeType" onChange={handleRadioChange} /> Delete</td>
                    </tr>
                </tbody>
            </table>

            <table>
                <tbody>
                    <tr>
                        <td>Ring Size</td>
                        <td><RingSizeSelector label="Ring Size" onSizeChange={handleSizeChange} /></td>
                    </tr>
                    {
                        changeType !== "Delete" ?
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
                        <td><button type="button" onClick={handleSubmit}>Save Changes</button></td>
                        <td><button type="button" onClick={handleReset}>Reset to Defaults</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default RingSizeSettings;