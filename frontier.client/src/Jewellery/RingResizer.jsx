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
        } else {
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
            <div className="container">
                <div className="column">
                    <div className="text">Metal</div>
                    <div className="text">Original Ring Size</div>
                    <div className="text">New Ring Size</div>
                    <div className="text">Profile</div>
                    <div className="text">Width</div>
                    <div>
                        {thicknessRequired ? <div className="text">Thickness</div> : <div></div>}
                    </div>
                </div>
                <div className="column">
                    <div><MetalSelector label="Metal" onMetalChange={handleMetalChange} /></div>
                    <div><RingSizeSelector label="Original Ring Size" onSizeChange={handleOriginalRingSizeChange} /></div>
                    <div><RingSizeSelector label="New Ring Size" onSizeChange={handleNewRingSizeChange} /></div>
                    <div><ProfileSelector label="Profile" onProfileChange={handleProfileChange} /></div>
                    <input type="number" step="0.01" value={width} onChange={(e) => setWidth(e.target.value)} />
                    <div>
                        {thicknessRequired ? <input type="number" step="0.01" value={thickness} onChange={(e) => setThickness(e.target.value)} /> : <div></div>}
                    </div>
                </div>
            </div>
            <button type="button" onClick={handleCalculate}>Calculate</button>
            <div className="container">
                <div className="column">
                    <div className="text">Original Ring Weight</div>
                    <div className="text">New Ring Weight</div>
                    <div className="text">Weight Difference</div>
                </div>
                <div className="column">
                    <input type="text" value={weightOriginal} disabled />
                    <input type="text" value={weightNew} disabled />
                    <input type="text" value={weightDifference} disabled />
                </div>

            </div>
        </div>
    );
}

export default RingResizer;