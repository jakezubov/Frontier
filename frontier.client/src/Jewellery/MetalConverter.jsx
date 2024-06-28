import { useState } from 'react';
import { validateNumber } from '../HelperFunctions';
import MetalSelector from './MetalSelector';
import History from '../account/History'
import HistoryType from '../constants/HistoryTypes';
import URL from '../constants/URLs';
import Axios from 'axios';

const MetalConverter = ({ userId }) => {
    const [originalMetal, setOriginalMetal] = useState(null);
    const [newMetal, setNewMetal] = useState(null);
    const [weight, setWeight] = useState('');
    const [convertedWeight, setConvertedWeight] = useState('');
    const [refresh, setRefresh] = useState('');

    const handleCalculate = async () => {
        const isDropdownsValid = originalMetal !== undefined && newMetal !== undefined
        const isNumbersValid = validateNumber(weight);

        const calculatedWeight = isDropdownsValid && isNumbersValid ?
            (weight * (1.0 / originalMetal.specificGravity) * newMetal.specificGravity).toFixed(2) + "g"
            : "Invalid Input";

        setConvertedWeight(calculatedWeight);

        try {
            calculatedWeight !== "Invalid Input" && userId !== null ?
                await Axios.put(URL.CREATE_HISTORY(userId), {
                    'historyType': HistoryType.METAL_CONVERTER,
                    'content': `${originalMetal.name} (${weight}g) -> ${newMetal.name} (${calculatedWeight})`
                }) : null;
            setRefresh(Date().toLocaleTimeString())
        }
        catch (error) {
            console.log(error)
            alert('There was an error submitting the form!')
        }
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
                        <td><MetalSelector userId={userId} label="Original Metal" onMetalChange={handleOriginalMetalChange} /></td>
                    </tr>
                    <tr>
                        <td>New Metal</td>
                        <td><MetalSelector userId={userId} label="New Metal" onMetalChange={handleNewMetalChange} /></td>
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

            <History userId={userId} historyType={HistoryType.METAL_CONVERTER} refresh={refresh} />
        </div>
    );
}

export default MetalConverter;