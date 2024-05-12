import { useState } from 'react';
import MetalSelector from './MetalSelector';
import RingSizeSelector from './RingSizeSelector';
import ProfileSelector from './ProfileSelector';
import { calculateRingWeight, validateNumber } from '../HelperFunctions';

const RingWeight = () => {
    // Inputs
    const [metal, setMetal] = useState(null);
    const [ringSize, setRingSize] = useState(null);
    const [profile, setProfile] = useState('');
    const [width, setWidth] = useState('');
    const [thickness, setThickness] = useState('');

    // Calculated
    const [thicknessRequired, setThicknessRequired] = useState(true);
    const [weight, setWeight] = useState('');

    const handleCalculate = () => {
        const isDropdownsValid = metal !== undefined && ringSize !== undefined && profile !== ""
        const isNumbersValid = validateNumber(width) && (!thicknessRequired || validateNumber(thickness));

        const calculatedWeight = isDropdownsValid && isNumbersValid ?
            calculateRingWeight(profile, parseFloat(width), parseFloat(thickness), ringSize.diameter, metal.specificGravity).toFixed(2) + "g"
            : "Invalid Input";

        setWeight(calculatedWeight);
    }

    const handleMetalChange = (metal) => {
        setMetal(metal);
    };

    const handleRingSizeChange = (ringSize) => {
        setRingSize(ringSize);
    };

    const handleProfileChange = (profile) => {
        setProfile(profile);
        const isThicknessRequired = profile == "Half-Round" || profile == "Rectangle"
        isThicknessRequired ? setThicknessRequired(true) : setThicknessRequired(false), setThickness('')
    };

    return (
        <div>
            <h1>Ring Weight</h1>

            <table>
                <tbody>
                    <tr>
                        <td>Metal</td>
                        <td><MetalSelector label="Metal" onMetalChange={handleMetalChange} /></td>
                    </tr>
                    <tr>
                        <td>Ring Size</td>
                        <td><RingSizeSelector label="Ring Size" onSizeChange={handleRingSizeChange} /></td>
                    </tr>
                    <tr>
                        <td>Profile</td>
                        <td><ProfileSelector label="Profile" onProfileChange={handleProfileChange} /></td>
                    </tr>
                    <tr>
                        <td>Width</td>
                        <td><input type="number" step="0.01" min="0" value={width} onChange={(e) => setWidth(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>
                            {
                                thicknessRequired ? <div className="text">Thickness</div> : null
                            }
                        </td>
                        <td>
                            {
                                thicknessRequired ? <input type="number" step="0.01" min="0" value={thickness} onChange={(e) => setThickness(e.target.value)} /> : null
                            }
                        </td>
                    </tr>
                </tbody>
            </table>

            <button type="button" onClick={handleCalculate}>Calculate</button>

            <table>
                <tbody>
                    <tr>
                        <td>Ring Weight</td>
                        <td><input type="text" value={weight} disabled /></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default RingWeight;