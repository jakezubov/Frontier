import { useState } from 'react';
import { validateNumber } from '../HelperFunctions';
import RingSizeSelector from './RingSizeSelector';
import ProfileSelector from './ProfileSelector';

const RollingWire = ({ userId }) => {
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

    const handleCalculate = async () => {
        const isDropdownsValid = profile !== ""
        const isNumbersValid = validateNumber(width) && validateNumber(thickness) && (!stockSizeRequired || validateNumber(stockSize));
        const isSwitchValuesValid = ringSize !== null || validateNumber(length)

        if (isDropdownsValid && isNumbersValid && isSwitchValuesValid) {
            const side = Math.pow(Math.pow(width, 2) * thickness, 1.0 / 3);
            const lengthCalc = (length * width * thickness) / Math.pow(side, 2);

            if (profile === "Round") {
                const diameter = (2 * side) / Math.sqrt(Math.PI);
                if (stockSizeRequired) {
                    const stock = (4 * Math.pow(side, 2) * lengthCalc) / (Math.PI * Math.pow(stockSize, 2));
                    setOutput(`Diameter: ${diameter.toFixed(2)}mm\nStock Length: ${stock.toFixed(2)}mm`)
                }
                else {
                    setOutput(`Diameter: ${diameter.toFixed(2)}mm\nLength: ${lengthCalc.toFixed(2)}mm`);
                }
            }
            else {
                if (stockSizeRequired) {
                    const stock = (Math.pow(side, 2) * lengthCalc) / Math.pow(stockSize, 2);
                    setOutput(`Side: ${side.toFixed(2)}mm\nStock Length: ${stock.toFixed(2)}mm`);
                }
                else
                    setOutput(`Side: ${side.toFixed(2)}mm\nLength: ${lengthCalc.toFixed(2)}mm`);
            }
        }
        else setOutput("Invalid Input");
    }

    const handleStockCheckbox = () => {
        !stockSizeRequired ? setStockSizeRequired(true) : setStockSizeRequired(false), setStockSize('')
    }

    const handleLengthRingSizeSwitch = () => {
        !lengthRingSizeSwitch ? ( setLengthRingSizeSwitch(true), setLength(''), useState(null) ) : setLengthRingSizeSwitch(false), setLength(''), useState(null)
    }

    const handleRingSizeChange = (ringSize) => {
        setRingSize(ringSize);
        setLength(ringSize.diameter)
    };

    const handleProfileChange = (profile) => {
        setProfile(profile);
    };

    return (
        <div>
            <h1>Rolling Wire</h1>

            <table>
                <tbody>
                    <tr>
                        <td>Profile</td>
                        <td><ProfileSelector label="Profile" onProfileChange={handleProfileChange} isLimited={true} /></td>
                    </tr>
                    <tr>
                        <td>
                            {
                                lengthRingSizeSwitch ? <button className="inline-button" type="button" onClick={handleLengthRingSizeSwitch}>Length</button> :
                                    <button className="inline-button" type="button" onClick={handleLengthRingSizeSwitch}>Ring Size</button>
                            }
                        </td>
                        <td>
                            {
                                lengthRingSizeSwitch ? <input type="number" step="0.01" value={length} onChange={(e) => setLength(e.target.value)} /> :
                                    <div><RingSizeSelector userId={userId} label="Ring Size" onSizeChange={handleRingSizeChange} /></div>
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>Width</td>
                        <td><input type="number" step="0.01" min="0" value={width} onChange={(e) => setWidth(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Thickness</td>
                        <td><input type="number" step="0.01" min="0" value={thickness} onChange={(e) => setThickness(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Starting with Stock</td>
                        <td><input type="checkbox" onClick={handleStockCheckbox} defaultChecked={true} /></td>
                    </tr>
                    <tr>
                        <td>
                            {
                                stockSizeRequired ? <div className="text">Stock Size</div> : null
                            }
                        </td>
                        <td>
                            {
                                stockSizeRequired ? <input type="number" step="0.01" min="0" value={stockSize} onChange={(e) => setStockSize(e.target.value)} /> : null
                            }
                        </td>
                    </tr>
                </tbody>
            </table>

            <button type="button" onClick={handleCalculate}>Calculate</button>

            <table>
                <tbody>
                    <tr>
                        <td>Output</td>
                        <td><textarea rows="3" value={output} disabled /></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default RollingWire;