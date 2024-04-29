import { useState } from 'react';
import MetalSelector from './MetalSelector';
import RingSizeSelector from './RingSizeSelector';
import ProfileSelector from './ProfileSelector';
import { calculateRingWeight, validateNumber } from '../HelperFunctions';

const RingResizer = () => {
    // Inputs
    const [metal, setMetal] = useState(null);
    const [originalRingSize, setOriginalRingSize] = useState(null);
    const [newRingSize, setNewRingSize] = useState(null);
    const [profile, setProfile] = useState('');
    const [width, setWidth] = useState('');
    const [thickness, setThickness] = useState('');

    // Calculated
    const [thicknessRequired, setThicknessRequired] = useState(true);
    const [weightOriginal, setWeightOriginal] = useState('');
    const [weightNew, setWeightNew] = useState('');
    const [weightDifference, setWeightDifference] = useState('');

    const handleCalculate = () => {
        const isDropdownsValid = metal !== undefined && originalRingSize !== undefined && newRingSize !== undefined && profile !== ""
        const isNumbersValid = validateNumber(width) && (!thicknessRequired || validateNumber(thickness));

        if (isDropdownsValid && isNumbersValid) {
            const calculatedOriginal = calculateRingWeight(profile, parseFloat(width), parseFloat(thickness), originalRingSize.diameter, metal.specificGravity);
            const calculatedNew = calculateRingWeight(profile, parseFloat(width), parseFloat(thickness), newRingSize.diameter, metal.specificGravity);

            setWeightOriginal(calculatedOriginal.toFixed(2) + "g");
            setWeightNew(calculatedNew.toFixed(2) + "g");
            setWeightDifference((calculatedNew - calculatedOriginal).toFixed(2) + "g");
        }
        else {
            setWeightOriginal("Invalid Input");
            setWeightNew("Invalid Input");
            setWeightDifference("Invalid Input");
        }
    }

    const handleMetalChange = (metal) => {
        setMetal(metal);
    };

    const handleOriginalRingSizeChange = (ringSize) => {
        setOriginalRingSize(ringSize);
    };

    const handleNewRingSizeChange = (ringSize) => {
        setNewRingSize(ringSize);
    };

    const handleProfileChange = (profile) => {
        setProfile(profile);
        const isThicknessRequired = profile == "Half-Round" || profile == "Rectangle"
        isThicknessRequired ? setThicknessRequired(true) : setThicknessRequired(false), setThickness('')
    };

    return (
        <div>
            <h1>Ring Resizer</h1>

            <table>
                <tr>
                    <td>Metal</td>
                    <td><MetalSelector label="Metal" onMetalChange={handleMetalChange} /></td>
                </tr>
                <tr>
                    <td>Original Ring Size</td>
                    <td><RingSizeSelector label="Original Ring Size" onSizeChange={handleOriginalRingSizeChange} /></td>
                </tr>
                <tr>
                    <td>New Ring Size</td>
                    <td><RingSizeSelector label="New Ring Size" onSizeChange={handleNewRingSizeChange} /></td>
                </tr>
                <tr>
                    <td>Profile</td>
                    <td><ProfileSelector label="Profile" onProfileChange={handleProfileChange} /></td>
                </tr>
                <tr>
                    <td>Width</td>
                    <td><input type="number" step="0.01" value={width} onChange={(e) => setWidth(e.target.value)} /></td>
                </tr>
                <tr>
                    <td>
                        {
                            thicknessRequired ? <div className="text">Thickness</div> : <div></div>
                        }
                    </td>
                    <td>
                        {
                            thicknessRequired ? <input type="number" step="0.01" value={thickness} onChange={(e) => setThickness(e.target.value)} /> : <div></div>
                        }
                    </td>
                </tr>
            </table>

            <button type="button" onClick={handleCalculate}>Calculate</button>

            <table>
                <tr>
                    <td>Original Ring Weight</td>
                    <td><input type="text" value={weightOriginal} disabled /></td>
                </tr>
                <tr>
                    <td>New Ring Weight</td>
                    <td><input type="text" value={weightNew} disabled /></td>
                </tr>
                <tr>
                    <td>Weight Difference</td>
                    <td><input type="text" value={weightDifference} disabled /></td>
                </tr>
            </table>
        </div>
    );
}

export default RingResizer;