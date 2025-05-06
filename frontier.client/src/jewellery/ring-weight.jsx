import { useState, useEffect } from 'react'
import { useUserSession } from '../contexts/user-context'
import { useHistory } from '../contexts/history-context'
import { useCurrentPage } from '../contexts/current-page-context'
import { validateNumber } from '../consts/validation'
import MetalSelector from '../components/metal-selector'
import RingSizeSelector from '../components/ring-size-selector'
import ProfileSelector from '../components/profile-selector'
import CustomNumberInput from '../components/custom-number-input'

const RingWeight = () => {
    const { userId } = useUserSession()
    const { addHistory } = useHistory()
    const { setCurrentPage, Pages } = useCurrentPage()

    // Inputs
    const [metal, setMetal] = useState(null)
    const [ringSize, setRingSize] = useState(null)
    const [profile, setProfile] = useState('')
    const [width, setWidth] = useState('')
    const [thickness, setThickness] = useState('')
    const [validationMessage, setValidationMessage] = useState(' ')

    // Calculated
    const [thicknessRequired, setThicknessRequired] = useState(true)
    const [weight, setWeight] = useState('')

    useEffect(() => {
        setCurrentPage(Pages.RING_WEIGHT)
    }, [])

    useEffect(() => {
        setValidationMessage(' ')
    }, [metal, ringSize, profile, width, thickness])

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

        if (!metal || !ringSize || !profile || !isNumbersValid) {
            setValidationMessage("Please ensure all fields are correctly filled.")
            setWeight('')
            return
        }

        const calculatedWeightText = calculateRingWeight(ringSize.diameter).toFixed(2) + "g"
        setWeight(calculatedWeightText)

        if (userId) {
            const content = thicknessRequired
                ? `${metal.name} | ${ringSize.name} | ${calculatedWeightText} | ${profile} | ${width}mm x ${thickness}mm`
                : `${metal.name} | ${ringSize.name} | ${calculatedWeightText} | ${profile} | ${width}mm x ${width}mm`

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
                            <td>Ring Size</td>
                            <td><RingSizeSelector label="Ring Size" onSizeChange={setRingSize} /></td>
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
                            <td>Calculated Weight</td>
                            <td><input className="general-output" type="text" value={weight} disabled /></td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    )
}

export default RingWeight