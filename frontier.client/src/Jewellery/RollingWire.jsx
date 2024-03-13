import { useState } from 'react';
import RingSizeSelector from './RingSizeSelector';
import ProfileSelector from './ProfileSelector';
import { validateNumber } from '../HelperFunctions';

const RollingWire = () => {
    // Inputs
    const [ringSize, setRingSize] = useState(null);
    const [profile, setProfile] = useState('');
    const [width, setWidth] = useState('');
    const [thickness, setThickness] = useState('');
    const [stockSize, setStockSize] = useState('');

    // Calculated
    const [stockSizeRequired, setStockSizeRequired] = useState(true);
    const [output, setOutput] = useState('');

    const handleCalculate = () => {
        const isDropdownsValid = ringSize !== undefined && profile !== ""
        const isNumbersValid = validateNumber(width) && validateNumber(thickness) && (!stockSizeRequired || validateNumber(stockSize));

        if (isDropdownsValid && isNumbersValid) {
            setOutput("Valid Input");
        } else {
            setOutput("Invalid Input");
        }
    }

    const handleCheckbox = () => {
        !stockSizeRequired ? setStockSizeRequired(true)  : setStockSizeRequired(false), setStockSize('')
    }

    const handleRingSizeChange = (ringSize) => {
        setRingSize(ringSize);
    };

    const handleProfileChange = (profile) => {
        setProfile(profile);
    };

    return (
        <div>
            <h1>Rolling Wire</h1>
            <div className="container">
                <div className="column">
                    <div className="text">Ring Size</div>
                    <div className="text">Profile</div>
                    <div className="text">Width</div>
                    <div className="text">Thickness</div>
                    <div className="text">Stock Size Required</div>
                    <div>
                        {stockSizeRequired ? <div className="text">Stock Size</div> : <div></div>}
                    </div>
                </div>
                <div className="column">
                    <div><RingSizeSelector label="Ring Size" onSizeChange={handleRingSizeChange} /></div>
                    <div><ProfileSelector label="Profile" onProfileChange={handleProfileChange} /></div>
                    <input type="number" step="0.01" value={width} onChange={(e) => setWidth(e.target.value)} />
                    <input type="number" step="0.01" value={thickness} onChange={(e) => setThickness(e.target.value)} />
                    <input type="checkbox" onClick={handleCheckbox} defaultChecked={true} />
                    <div>
                        {stockSizeRequired ? <input type="number" step="0.01" value={stockSize} onChange={(e) => setStockSize(e.target.value)} /> : <div></div>}
                    </div>
                </div>
            </div>
            <button type="button" onClick={handleCalculate}>Calculate</button>
            <div className="container">
                <div className="column">
                    <div className="text">Output</div>
                </div>
                <div className="column">
                    <input type="text" value={output} disabled />
                </div>

            </div>
        </div>
    );
}

export default RollingWire;