import PropTypes from 'prop-types'
import Axios from 'axios'
import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import { validateNumber } from '../constants/ValidateNumber'
import JewelleryPage from '../constants/JewelleryPages'
import URL from '../constants/URLs'
import MetalSelector from '../components/MetalSelector'
import RingSizeSelector from '../components/RingSizeSelector'
import ProfileSelector from '../components/ProfileSelector'
import PopupError from '../popups/PopupError'

const RingResizer = ({ onRefresh }) => {
    const { userId } = useContext(UserContext)

    // Inputs
    const [metal, setMetal] = useState(null)
    const [originalRingSize, setOriginalRingSize] = useState(null)
    const [newRingSize, setNewRingSize] = useState(null)
    const [profile, setProfile] = useState('')
    const [width, setWidth] = useState('')
    const [thickness, setThickness] = useState('')

    // Calculated
    const [thicknessRequired, setThicknessRequired] = useState(true)
    const [weightOriginal, setWeightOriginal] = useState('')
    const [weightNew, setWeightNew] = useState('')
    const [weightDifference, setWeightDifference] = useState('')

    // Popups
    const [validationMessage, setValidationMessage] = useState('')
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)
    const [errorContent, setErrorContent] = useState('')

    useEffect(() => {
        setValidationMessage('')
    }, [metal, originalRingSize, newRingSize, profile, width, thickness])

    const calculateRingWeight = (length) => {
        if (profile === "Round") {
            return (Math.PI * Math.pow(width, 2) * (length + width)) * metal.specificGravity / 1000;
        }
        else if (profile === "Square") {
            return (length + width + width) * Math.PI * width * width * metal.specificGravity / 1000;
        }
        else if (profile === "Half-Round") {
            return ((Math.PI * Math.pow(width, 2)) * (length + width + thickness)) * metal.specificGravity / 1000;
        }
        else if (profile === "Rectangle") {
            return (length + width + thickness) * Math.PI * width * thickness * metal.specificGravity / 1000;
        }
        else {
            return null; // Invalid profile
        }
    }

    const handleCalculate = async () => {
        const isNumbersValid = validateNumber(width) && (!thicknessRequired || validateNumber(thickness))

        if (!metal || !originalRingSize || !newRingSize || !profile || !isNumbersValid) {
            setValidationMessage("Please ensure all fields are correctly filled.")
            setWeightOriginal('')
            setWeightNew('')
            setWeightDifference('')
            return
        }

        const calculatedOriginal = calculateRingWeight(originalRingSize.diameter)
        const calculatedNew = calculateRingWeight(newRingSize.diameter)

        const weightOriginalText = calculatedOriginal.toFixed(2) + "g"
        const weightNewText = calculatedNew.toFixed(2) + "g"

        setWeightOriginal(weightOriginalText)
        setWeightNew(weightNewText)
        setWeightDifference((calculatedNew - calculatedOriginal).toFixed(2) + "g")

        const content = thicknessRequired
            ? `${originalRingSize.name} (${weightOriginalText}) -> ${newRingSize.name} (${weightNewText}) | ${metal.name} | ${profile} | ${width}mm x ${thickness}mm`
            : `${originalRingSize.name} (${weightOriginalText}) -> ${newRingSize.name} (${weightNewText}) | ${metal.name} | ${profile} | ${width}mm x ${width}mm`

        if (userId) {
            try {
                await Axios.put(URL.CREATE_HISTORY(userId), {
                    'historyType': JewelleryPage.RING_RESIZER,
                    'content': content
                })
                onRefresh()
            }
            catch (error) {
                console.error({
                    message: 'Failed to save history',
                    error: error.message,
                    stack: error.stack,
                    userId,
                    metal,
                    originalRingSize,
                    newRingSize,
                    profile,
                    width,
                    thickness,
                    weightOriginalText,
                    weightNewText,
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

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleCalculate()
        }
    }

    return (
        <div>
            <h1>Ring Resizer</h1>

            <form onKeyDown={handleKeyDown}>
                <table>
                    <tbody>
                        <tr>
                            <td>Metal</td>
                            <td><MetalSelector label="Metal" onMetalChange={setMetal} /></td>
                        </tr>
                        <tr>
                            <td>Original Ring Size</td>
                            <td><RingSizeSelector label="Original Ring Size" onSizeChange={setOriginalRingSize} /></td>
                        </tr>
                        <tr>
                            <td>New Ring Size</td>
                            <td><RingSizeSelector label="New Ring Size" onSizeChange={setNewRingSize} /></td>
                        </tr>
                        <tr>
                            <td>Profile</td>
                            <td><ProfileSelector label="Profile" onProfileChange={handleProfileChange} /></td>
                        </tr>
                        <tr>
                            <td>Width</td>
                            <td><input className="general-input" type="number" step="0.01" min="0.01" value={width} onChange={(e) => setWidth(e.target.value)} /></td>
                        </tr>
                        <tr>
                            {
                                thicknessRequired ?
                                    <>
                                        <td><div className="padded-text">Thickness</div></td>
                                        <td><input className="general-input" type="number" step="0.01" min="0.01" value={thickness} onChange={(e) => setThickness(e.target.value)} /></td>
                                    </> : null
                            }
                        </tr>
                    </tbody>
                </table>

                <button className="general-button" type="button" onClick={handleCalculate}>Calculate</button>
            </form>

            {validationMessage && <p className="pre-wrap warning-text">{validationMessage}</p>}

            <table>
                <tbody>
                    <tr>
                        <td>Original Ring Weight</td>
                        <td><input className="general-output" type="text" value={weightOriginal} disabled /></td>
                    </tr>
                    <tr>
                        <td>New Ring Weight</td>
                        <td><input className="general-output" type="text" value={weightNew} disabled /></td>
                    </tr>
                    <tr>
                        <td>Weight Difference</td>
                        <td><input className="general-output" type="text" value={weightDifference} disabled /></td>
                    </tr>
                </tbody>
            </table>

            {isErrorPopupOpen && (
                <PopupError isPopupOpen={isErrorPopupOpen} setIsPopupOpen={setIsErrorPopupOpen} content={errorContent} />
            )}
        </div>
    )
}

RingResizer.propTypes = {
    onRefresh: PropTypes.func.isRequired,
}

export default RingResizer