import { useState, useEffect } from 'react'
import { useUserSession } from '../contexts/user-context'
import { useHistory } from '../contexts/history-context'
import { useCurrentPage } from '../contexts/current-page-context'
import { validateNumber } from '../consts/validation'
import MetalSelector from '../components/metal-selector'
import RingSizeSelector from '../components/ring-size-selector'
import ProfileSelector from '../components/profile-selector'
import CustomNumberInput from '../components/custom-number-input'

const RingResizer = () => {
    const { userId } = useUserSession()
    const { addHistory } = useHistory()
    const { setCurrentPage, Pages } = useCurrentPage()

    // Inputs
    const [metal, setMetal] = useState(null)
    const [originalRingSize, setOriginalRingSize] = useState(null)
    const [newRingSize, setNewRingSize] = useState(null)
    const [profile, setProfile] = useState('')
    const [width, setWidth] = useState('')
    const [thickness, setThickness] = useState('')
    const [validationMessage, setValidationMessage] = useState(' ')

    // Calculated
    const [thicknessRequired, setThicknessRequired] = useState(true)
    const [weightOriginal, setWeightOriginal] = useState('')
    const [weightNew, setWeightNew] = useState('')
    const [weightDifference, setWeightDifference] = useState('')

    useEffect(() => {
        setCurrentPage(Pages.RING_RESIZER)
    }, [])

    useEffect(() => {
        setValidationMessage(' ')
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
        const isNumbersValid = validateNumber(width) && width > 0 && (!thicknessRequired || validateNumber(thickness) && thickness > 0)

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

        if (userId) {
            const content = thicknessRequired
                ? `${originalRingSize.name} (${weightOriginalText}) -> ${newRingSize.name} (${weightNewText}) | ${metal.name} | ${profile} | ${width}mm x ${thickness}mm`
                : `${originalRingSize.name} (${weightOriginalText}) -> ${newRingSize.name} (${weightNewText}) | ${metal.name} | ${profile} | ${width}mm x ${width}mm`

            addHistory(content)
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
                            <td><CustomNumberInput step={0.01} min={0.01} onChange={(value) => setWidth(value)} /></td>
                        </tr>
                        <tr>
                            {thicknessRequired &&
                                <>
                                    <td><div className="padded-text">Thickness</div></td>
                                    <td><CustomNumberInput step={0.01} min={0.01} onChange={(value) => setThickness(value)} /></td>
                                </>
                            }
                        </tr>
                        <tr>
                            <td colSpan="2"><button className="general-button" type="button" onClick={handleCalculate}>Calculate</button></td>
                        </tr>
                        <tr>
                            <td colSpan="2">{validationMessage && <p className="pre-wrap warning-text tight-top">{validationMessage}</p>}</td>
                        </tr>
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
            </form>
        </div>
    )
}

export default RingResizer