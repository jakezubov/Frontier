import { useState } from 'react';
import MetalSelector from './MetalSelector';

const MetalConverter = () => {
    const [originalMetal, setOriginalMetal] = useState(null);
    const [newMetal, setNewMetal] = useState(null);
    const [weight, setWeight] = useState('');
    const [convertedWeight, setConvertedWeight] = useState('');

    const handleCalculate = () => {
        const isValidInput = originalMetal !== undefined && newMetal !== undefined && weight !== "" && !isNaN(parseFloat(weight)) && isFinite(weight);

        const calculatedWeight = isValidInput ?
            (parseFloat(weight) * (1.0 / originalMetal.specificGravity) * newMetal.specificGravity).toFixed(2) + "g" :
            "Invalid Input";

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
            <div className="container">
                <div className="column">
                    <div className="text">Original Metal</div>
                    <div className="text">New Metal</div>
                    <div className="text">Weight</div>
                </div>
                <div className="column">
                    <div><MetalSelector label="Original Metal" onMetalChange={handleOriginalMetalChange} /></div>
                    <div><MetalSelector label="New Metal" onMetalChange={handleNewMetalChange} /></div>
                    <input type="number" step="0.01" value={weight} onChange={(e) => setWeight(e.target.value)} />
                </div>
            </div>
            <button type="button" onClick={handleCalculate}>Calculate</button>
            <div className="container">
                <div className="column">
                    <div className="text">Converted Weight</div>
                </div>
                <div className="column">
                    <input type="text" value={convertedWeight} disabled />
                </div>

            </div>
        </div>
    );
}

export default MetalConverter;