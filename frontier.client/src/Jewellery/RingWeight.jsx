import PropTypes from 'prop-types'
import Axios from 'axios'
import { useState, useEffect } from 'react'
import { calculateRingWeight, validateNumber } from '../constants/HelperFunctions'
import JewelleryPage from '../constants/JewelleryPages'
import URL from '../constants/URLs'
import MetalSelector from '../components/MetalSelector'
import RingSizeSelector from '../components/RingSizeSelector'
import ProfileSelector from '../components/ProfileSelector'
import PopupError from '../components/PopupError'

const RingWeight = ({ userId, onRefresh }) => {
    // Inputs
    const [metal, setMetal] = useState(null)
    const [ringSize, setRingSize] = useState(null)
    const [profile, setProfile] = useState('')
    const [width, setWidth] = useState('')
    const [thickness, setThickness] = useState('')

    // Calculated
    const [thicknessRequired, setThicknessRequired] = useState(true)
    const [weight, setWeight] = useState('')

    // Popups
    const [validationMessage, setValidationMessage] = useState('')
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)
    const [errorContent, setErrorContent] = useState('')

    useEffect(() => {
        setValidationMessage('')
    }, [metal, ringSize, profile, width, thickness])

    const handleCalculate = async () => {
        const isNumbersValid = validateNumber(width) && (!thicknessRequired || validateNumber(thickness))

        if (!metal || !ringSize || !profile || !isNumbersValid) {
            setValidationMessage("Please ensure all fields are correctly filled.")
            setWeight('')
            return
        }

        const calculatedWeightText = calculateRingWeight(profile, parseFloat(width), parseFloat(thickness), ringSize.diameter, metal.specificGravity).toFixed(2) + "g"
        setWeight(calculatedWeightText)

        const content = thicknessRequired ?
            `${metal.name} | ${ringSize.name} | ${calculatedWeightText} | ${profile} | ${width}mm x ${thickness}mm`
            : `${metal.name} | ${ringSize.name} | ${calculatedWeightText} | ${profile} | ${width}mm x ${width}mm`

        if (userId) {
            try {
                await Axios.put(URL.CREATE_HISTORY(userId), {
                    'historyType': JewelleryPage.RING_WEIGHT,
                    'content': content
                })
                onRefresh(new Date().toLocaleTimeString())
            }
            catch (error) {
                console.error({
                    message: 'Failed to save history',
                    error: error.message,
                    stack: error.stack,
                    metal,
                    ringSize,
                    profile,
                    width,
                    thickness,
                    weight,
                    calculatedWeightText,
                })
                setErrorContent('Failed to save history\n' + error.message)
                setIsErrorPopupOpen(true)
            }
        }
    }

    const handleProfileChange = (profile) => {
        setProfile(profile)
        const isThicknessRequired = profile == "Half-Round" || profile == "Rectangle"
        isThicknessRequired ? setThicknessRequired(true) : setThicknessRequired(false), setThickness('')
    }

    return (
        <div>
            <h1>Ring Weight</h1>

            <table>
                <tbody>
                    <tr>
                        <td>Metal</td>
                        <td><MetalSelector userId={userId} label="Metal" onMetalChange={setMetal} /></td>
                    </tr>
                    <tr>
                        <td>Ring Size</td>
                        <td><RingSizeSelector userId={userId} label="Ring Size" onSizeChange={setRingSize} /></td>
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
            {validationMessage && <p className="pre-wrap warning-text">{validationMessage}</p>}

            <table>
                <tbody>
                    <tr>
                        <td>Ring Weight</td>
                        <td><input type="text" value={weight} disabled /></td>
                    </tr>
                </tbody>
            </table>

            {isErrorPopupOpen && (
                <PopupError isPopupOpen={isErrorPopupOpen} setIsPopupOpen={setIsErrorPopupOpen} content={errorContent} />
            )}
        </div>
    )
}

RingWeight.propTypes = {
    userId: PropTypes.string,
    onRefresh: PropTypes.func.isRequired,
}

export default RingWeight