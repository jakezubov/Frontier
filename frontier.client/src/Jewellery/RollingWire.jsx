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
    const [length, setLength] = useState('');
    const [stockSize, setStockSize] = useState('');

    // Calculated
    const [lengthRingSizeSwitch, setLengthRingSizeSwitch] = useState(true);
    const [stockSizeRequired, setStockSizeRequired] = useState(true);
    const [output, setOutput] = useState('');

    const handleCalculate = () => {
        const isDropdownsValid = profile !== ""
        const isNumbersValid = validateNumber(width) && validateNumber(thickness) && (!stockSizeRequired || validateNumber(stockSize));
        const isSwitchValuesValid = ringSize !== undefined || validateNumber(length)

        if (isDropdownsValid && isNumbersValid && isSwitchValuesValid) {
            setOutput("Valid Input");
        } else {
            setOutput("Invalid Input");
        }
    }

    const handleStockCheckbox = () => {
        !stockSizeRequired ? setStockSizeRequired(true) : setStockSizeRequired(false), setStockSize('')
    }

    const handleLengthRingSizeSwitch = () => {
        !lengthRingSizeSwitch ? setLengthRingSizeSwitch(true) : setLengthRingSizeSwitch(false)
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
                    <div className="text">Profile</div>
                    <div>
                        {
                            lengthRingSizeSwitch ?
                                <div className="text">Length <button type="button" onClick={handleLengthRingSizeSwitch}></button></div> :
                                <div className="text">Ring Size <button type="button" onClick={handleLengthRingSizeSwitch}></button></div>
                        }
                    </div>
                    <div className="text">Width</div>
                    <div className="text">Thickness</div>
                    <div className="text">Stock Size Required</div>
                    <div>
                        {
                            stockSizeRequired ?
                                <div className="text">Stock Size</div> :
                                <div></div>
                        }
                    </div>
                </div>
                <div className="column">
                    <div><ProfileSelector label="Profile" onProfileChange={handleProfileChange} /></div>
                    <div>
                        {
                            lengthRingSizeSwitch ?
                                <input type="number" step="0.01" value={length} onChange={(e) => setLength(e.target.value)} /> :
                                <div><RingSizeSelector label="Ring Size" onSizeChange={handleRingSizeChange} /></div>
                        }
                    </div>
                    <input type="number" step="0.01" value={width} onChange={(e) => setWidth(e.target.value)} />
                    <input type="number" step="0.01" value={thickness} onChange={(e) => setThickness(e.target.value)} />
                    <input type="checkbox" onClick={handleStockCheckbox} defaultChecked={true} />
                    <div>
                        {
                            stockSizeRequired ?
                                <input type="number" step="0.01" value={stockSize} onChange={(e) => setStockSize(e.target.value)} /> :
                                <div></div>
                        }
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