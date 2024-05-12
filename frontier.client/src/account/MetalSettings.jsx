import { useState } from 'react';
import MetalSelector from '../jewellery/MetalSelector';

const MetalSettings = () => {
    const [metal, setMetal] = useState(null);
    const [name, setName] = useState('');
    const [specificGravity, setSpecificGravity] = useState('');
    const [changeType, setChangeType] = useState('');

    const handleMetalChange = (selectedMetal) => {
        setMetal(selectedMetal);
        changeType !== "Add" ?
            (
                setName(selectedMetal.name),
                setSpecificGravity(selectedMetal.specificGravity)
            ) : null
    };

    const handleRadioChange = (option) => {
        setChangeType(option.target.value);
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

    const handleSubmit = () => {

    }

    const handleReset = () => {

    }

    return (
        <div>
            <h1>Metal Settings</h1>

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
                        <td>Metal</td>
                        <td><MetalSelector label="Metal" onMetalChange={handleMetalChange} /></td>
                    </tr>
                    {
                        changeType !== "Delete" ?
                            <>
                                <tr>
                                    <td>Name</td>
                                    <td><input value={name} onChange={(e) => setName(e.target.value)} /></td>
                                </tr>
                                <tr>
                                    <td>Specific Gravity</td>
                                    <td><input value={specificGravity} onChange={(e) => setSpecificGravity(e.target.value)} /></td>
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

export default MetalSettings;