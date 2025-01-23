import { useState, useEffect } from 'react'
import { useUserSession } from '../contexts/user-context'
import { useHistory } from '../contexts/history-context'
import { useCurrentPage } from '../contexts/current-page-context'
import { validateNumber } from '../common/validation'
import MetalSelector from '../components/metal-selector'
import CustomNumberInput from '../components/custom-number-input'

const MetalConverter = () => {
    const { userId } = useUserSession()
    const { addHistory } = useHistory()
    const { setCurrentPage, Pages } = useCurrentPage()

    // Inputs
    const [originalMetal, setOriginalMetal] = useState(null)
    const [newMetal, setNewMetal] = useState(null)
    const [weight, setWeight] = useState('')
    const [validationMessage, setValidationMessage] = useState(' ')

    // Calculated
    const [convertedWeight, setConvertedWeight] = useState('')

    useEffect(() => {
        setCurrentPage(Pages.METAL_CONVERTER)
    }, [])

    useEffect(() => {
        setValidationMessage(' ')
    }, [originalMetal, newMetal, weight])

    const handleCalculate = async () => {
        if (!originalMetal || !newMetal || !validateNumber(weight)) {
            setValidationMessage("Please ensure all fields are correctly filled.")
            setConvertedWeight('')
            return
        }

        const calculatedWeightText = (weight * (1.0 / originalMetal.specificGravity) * newMetal.specificGravity).toFixed(2) + "g"
        setConvertedWeight(calculatedWeightText)

        if (userId) {
            const originalWeightText = parseFloat(weight).toFixed(2) + "g"
            const content = `${originalMetal.name} | ${originalWeightText} -> ${newMetal.name} | ${calculatedWeightText}`

            addHistory(content)
        }
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
                            <td>Original Metal</td>
                            <td><MetalSelector label="Original Metal" onMetalChange={setOriginalMetal} /></td>
                        </tr>
                        <tr>
                            <td>New Metal</td>
                            <td><MetalSelector label="New Metal" onMetalChange={setNewMetal} /></td>
                        </tr>
                        <tr>
                            <td>Weight</td>
                            <td><CustomNumberInput step={0.01} min={0.01} onChange={(value) => setWeight(value)} /></td>
                        </tr>
                        <tr>
                            <td colSpan="2"><button className="general-button" type="button" onClick={handleCalculate}>Calculate</button></td>
                        </tr>
                        <tr>
                            <td colSpan="2">{validationMessage && <p className="pre-wrap warning-text tight-top">{validationMessage}</p>}</td>
                        </tr>
                        <tr>
                            <td>Converted Weight</td>
                            <td><input className="general-output" type="text" value={convertedWeight} disabled /></td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    )
}

export default MetalConverter;