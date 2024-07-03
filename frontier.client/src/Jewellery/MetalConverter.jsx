import PropTypes from 'prop-types'
import Axios from 'axios'
import { useState } from 'react'
import { validateNumber } from '../constants/HelperFunctions'
import JewelleryPage from '../constants/JewelleryPages'
import URL from '../constants/URLs'
import MetalSelector from '../components/MetalSelector'


const MetalConverter = ({ userId, onRefresh }) => {
    const [originalMetal, setOriginalMetal] = useState(null);
    const [newMetal, setNewMetal] = useState(null);
    const [weight, setWeight] = useState('');
    const [convertedWeight, setConvertedWeight] = useState('');

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
                    'historyType': JewelleryPage.METAL_CONVERTER,
                    'content': `${originalMetal.name} (${weight}g) -> ${newMetal.name} (${calculatedWeight})`
                }) : null;
            onRefresh(new Date().toLocaleTimeString())
        }
        catch (error) {
            console.log(error)
            alert('There was an error adding the history!')
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
        </div>
    );
}

MetalConverter.propTypes = {
    userId: PropTypes.string,
    onRefresh: PropTypes.func.isRequired,
}

export default MetalConverter;