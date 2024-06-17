import { useState } from 'react';
import MetalSelector from './MetalSelector';
import History from './History';
import { validateNumber } from '../HelperFunctions';

const MetalConverter = () => {
    // Inputs
    const [originalMetal, setOriginalMetal] = useState(null);
    const [newMetal, setNewMetal] = useState(null);
    const [weight, setWeight] = useState('');

    // Calculated
    const [convertedWeight, setConvertedWeight] = useState('');

    const handleCalculate = () => {
        const isDropdownsValid = originalMetal !== undefined && newMetal !== undefined
        const isNumbersValid = validateNumber(weight);

        const calculatedWeight = isDropdownsValid && isNumbersValid ?
            (weight * (1.0 / originalMetal.specificGravity) * newMetal.specificGravity).toFixed(2) + "g"
            : "Invalid Input";

        setConvertedWeight(calculatedWeight);
    }

    const handleOriginalMetalChange = (metal) => {
        setOriginalMetal(metal);
    };

    const handleNewMetalChange = (metal) => {
        setNewMetal(metal);
    };

    return (
        <div>
            <h1>Metal Converter</h1>

            <table>
                <tbody>
                    <tr>
                        <td>Original Metal</td>
                        <td><MetalSelector label="Original Metal" onMetalChange={handleOriginalMetalChange} /></td>
                    </tr>
                    <tr>
                        <td>New Metal</td>
                        <td><MetalSelector label="New Metal" onMetalChange={handleNewMetalChange} /></td>
                    </tr>
                    <tr>
                        <td>Weight</td>
                        <td><input type="number" step="0.01" min="0" value={weight} onChange={(e) => setWeight(e.target.value)} /></td>
                    </tr>
                </tbody>
            </table>

            <button type="button" onClick={handleCalculate}>Calculate</button>

            <table>
                <tbody>
                    <tr>
                        <td>Converted Weight</td>
                        <td><input type="text" value={convertedWeight} disabled /></td>
                    </tr>
                </tbody>
            </table>

            <br />
            <br />

            <History></History>
        </div>
    );
}

export default MetalConverter;