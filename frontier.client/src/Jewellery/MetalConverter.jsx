import PropTypes from 'prop-types'
import Axios from 'axios'
import { useState, useEffect } from 'react'
import { validateNumber } from '../constants/HelperFunctions'
import JewelleryPage from '../constants/JewelleryPages'
import URL from '../constants/URLs'
import MetalSelector from '../components/MetalSelector'


const MetalConverter = ({ userId, onRefresh }) => {
    const [originalMetal, setOriginalMetal] = useState(null)
    const [newMetal, setNewMetal] = useState(null)
    const [weight, setWeight] = useState('')
    const [convertedWeight, setConvertedWeight] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        setErrorMessage('')
    }, [originalMetal, newMetal, weight])

    const handleCalculate = async () => {
        if (!originalMetal || !newMetal || !validateNumber(weight)) {
            setErrorMessage("Please ensure all fields are correctly filled.")
            setConvertedWeight('')
            return
        }

        const calculatedWeightText = (weight * (1.0 / originalMetal.specificGravity) * newMetal.specificGravity).toFixed(2) + "g"
        setConvertedWeight(calculatedWeightText)

        if (userId) {
            try {
                await Axios.put(URL.CREATE_HISTORY(userId), {
                    'historyType': JewelleryPage.METAL_CONVERTER,
                    'content': `${originalMetal.name} (${weight}g) -> ${newMetal.name} (${calculatedWeightText})`
                })
                onRefresh(new Date().toLocaleTimeString())
            }
            catch (error) {
                console.error({
                    message: 'Failed to add history',
                    error: error.message,
                    stack: error.stack,
                    userId,
                    originalMetal,
                    newMetal,
                    weight,
                    calculatedWeightText,
                })
                alert('There was an error adding the history!')
            }
        }
    }

    return (
        <div>                       
            <h1>Metal Converter</h1>
            <table>
                <tbody>
                    <tr>
                        <td>Original Metal</td>
                        <td><MetalSelector userId={userId} label="Original Metal" onMetalChange={setOriginalMetal} /></td>
                    </tr>
                    <tr>
                        <td>New Metal</td>
                        <td><MetalSelector userId={userId} label="New Metal" onMetalChange={setNewMetal} /></td>
                    </tr>
                    <tr>
                        <td>Weight</td>
                        <td><input type="number" step="0.01" min="0" value={weight} onChange={(e) => setWeight(e.target.value)} /></td>
                    </tr>
                </tbody>
            </table>

            <button type="button" onClick={handleCalculate}>Calculate</button>
            {errorMessage && <p className="pre-wrap warning-text">{errorMessage}</p>}

            <table>
                <tbody>
                    <tr>
                        <td>Converted Weight</td>
                        <td><input type="text" value={convertedWeight} disabled /></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

MetalConverter.propTypes = {
    userId: PropTypes.string,
    onRefresh: PropTypes.func.isRequired,
}

export default MetalConverter;