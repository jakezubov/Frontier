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

        if (isDropdownsValid && isNumbersValid) {
            const calculatedWeight = calculateRingWeight(profile, parseFloat(width), parseFloat(thickness), ringSize.diameter, metal.specificGravity);;
            setWeight(calculatedWeight.toFixed(2) + "g");
        } else {
            setWeight("Invalid Input");
        }
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
            <div className="container">
                <div className="column">
                    <div className="text">Metal</div>
                    <div className="text">Ring Size</div>
                    <div className="text">Profile</div>
                    <div className="text">Width</div>
                    <div>
                        {thicknessRequired ? <div className="text">Thickness</div> : <div></div>}
                    </div>
                </div>
                <div className="column">
                    <div><MetalSelector label="Metal" onMetalChange={handleMetalChange} /></div>
                    <div><RingSizeSelector label="Ring Size" onSizeChange={handleRingSizeChange} /></div>
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
                    <div className="text">Ring Weight</div>
                </div>
                <div className="column">
                    <input type="text" value={weight} disabled />
                </div>

            </div>
        </div>
    );
}

export default RingWeight;