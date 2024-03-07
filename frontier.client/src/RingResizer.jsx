import { useState } from 'react';
import MetalSelector from './MetalSelector';
import RingSizeSelector from './RingSizeSelector';
import ProfileSelector from './ProfileSelector';

const RingResizer = () => {
    const [metal, setMetal] = useState(null);
    const [originalRingSize, setOriginalRingSize] = useState(null);
    const [newRingSize, setNewRingSize] = useState(null);
    const [profile, setProfile] = useState(null);
    const [width, setWidth] = useState('');
    const [thickness, setThickness] = useState('');
    const [weight, setWeight] = useState('');
    const [weightDifference, setWeightDifference] = useState('');

    const handleCalculate = () => {
        const isValidInput = metal !== undefined && originalRingSize !== undefined && newRingSize !== undefined && profile !== undefined &&
            width !== "" && !isNaN(parseFloat(width)) && isFinite(width);
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
                    <div className="text">Thickness</div>
                </div>
                <div className="column">
                    <div><MetalSelector label="Metal" onMetalChange={handleMetalChange} /></div>
                    <div><RingSizeSelector label="Original Ring Size" onSizeChange={handleOriginalRingSizeChange} /></div>
                    <div><RingSizeSelector label="New Ring Size" onSizeChange={handleNewRingSizeChange} /></div>
                    <div><ProfileSelector label="Profile" onProfileChange={handleProfileChange} /></div>
                    <input type="number" step="0.01" value={width} onChange={(e) => setWidth(e.target.value)} />
                    <input type="number" step="0.01" value={thickness} onChange={(e) => setThickness(e.target.value)} />
                </div>
            </div>
            <button type="button" onClick={handleCalculate}>Calculate</button>
            <div className="container">
                <div className="column">
                    <div className="text">New Ring Weight</div>
                    <div className="text">Weight Difference</div>
                </div>
                <div className="column">
                    <input type="text" value={weight} disabled />
                    <input type="text" value={weightDifference} disabled />
                </div>

            </div>
        </div>
    );
}

export default RingResizer;