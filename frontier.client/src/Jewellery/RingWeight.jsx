import { useState } from 'react';
import { calculateRingWeight, validateNumber } from '../HelperFunctions';
import MetalSelector from './MetalSelector';
import RingSizeSelector from './RingSizeSelector';
import ProfileSelector from './ProfileSelector';
import History from '../account/History'
import HistoryType from '../constants/HistoryTypes';
import URL from '../constants/URLs';
import Axios from 'axios';

const RingWeight = ({ userId }) => {
    // Inputs
    const [metal, setMetal] = useState(null);
    const [ringSize, setRingSize] = useState(null);
    const [profile, setProfile] = useState('');
    const [width, setWidth] = useState('');
    const [thickness, setThickness] = useState('');

    // Calculated
    const [thicknessRequired, setThicknessRequired] = useState(true);
    const [weight, setWeight] = useState('');

    // Other
    const [refresh, setRefresh] = useState('');

    const handleCalculate = async () => {
        const isDropdownsValid = metal !== undefined && ringSize !== undefined && profile !== ""
        const isNumbersValid = validateNumber(width) && (!thicknessRequired || validateNumber(thickness));

        const calculatedWeight = isDropdownsValid && isNumbersValid ?
            calculateRingWeight(profile, parseFloat(width), parseFloat(thickness), ringSize.diameter, metal.specificGravity).toFixed(2) + "g"
            : "Invalid Input";

        setWeight(calculatedWeight);

        const content = thicknessRequired
            ? `${metal.name} | ${ringSize.name} | ${calculatedWeight} | ${profile} | ${width}mm x ${thickness}mm`
            : `${metal.name} | ${ringSize.name} | ${calculatedWeight} | ${profile} | ${width}mm x ${width}mm`

        try {
            calculatedWeight !== "Invalid Input" && userId !== null ?
                await Axios.put(URL.CREATE_HISTORY(userId), {
                    'historyType': HistoryType.RING_WEIGHT,
                    'content': content
                }) : null;
            setRefresh(Date().toLocaleTimeString())
        }
        catch (error) {
            console.log(error)
            alert('There was an error submitting the form!')
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

            <table>
                <tbody>
                    <tr>
                        <td>Metal</td>
                        <td><MetalSelector userId={userId} label="Metal" onMetalChange={handleMetalChange} /></td>
                    </tr>
                    <tr>
                        <td>Ring Size</td>
                        <td><RingSizeSelector userId={userId} label="Ring Size" onSizeChange={handleRingSizeChange} /></td>
                    </tr>
                    <tr>
                        <td>Profile</td>
                        <td><ProfileSelector userId={userId} label="Profile" onProfileChange={handleProfileChange} /></td>
                    </tr>
                    <tr>
                        <td>Width</td>
                        <td><input type="number" step="0.01" min="0" value={width} onChange={(e) => setWidth(e.target.value)} /></td>
                    </tr>
                    <tr>
                        {
                            thicknessRequired ?
                                <>
                                    <td><div className="text">Thickness</div></td>
                                    <td><input type="number" step="0.01" min="0" value={thickness} onChange={(e) => setThickness(e.target.value)} /></td>
                                </> : null
                        }
                    </tr>
                </tbody>
            </table>

            <button type="button" onClick={handleCalculate}>Calculate</button>

            <table>
                <tbody>
                    <tr>
                        <td>Ring Weight</td>
                        <td><input type="text" value={weight} disabled /></td>
                    </tr>
                </tbody>
            </table>

            <br />
            <br />

            <History userId={userId} historyType={HistoryType.RING_WEIGHT} refresh={refresh} />
        </div>
    );
}

export default RingWeight;