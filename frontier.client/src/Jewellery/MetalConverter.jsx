import PropTypes from 'prop-types'
import Axios from 'axios'
import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import { validateNumber } from '../constants/HelperFunctions'
import JewelleryPage from '../constants/JewelleryPages'
import URL from '../constants/URLs'
import MetalSelector from '../components/MetalSelector'
import PopupError from '../components/PopupError'

const MetalConverter = ({ onRefresh }) => {
    const { userId } = useContext(UserContext)
    const [originalMetal, setOriginalMetal] = useState(null)
    const [newMetal, setNewMetal] = useState(null)
    const [weight, setWeight] = useState('')
    const [convertedWeight, setConvertedWeight] = useState('')

    // Popups
    const [validationMessage, setValidationMessage] = useState('')
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)
    const [errorContent, setErrorContent] = useState('')

    useEffect(() => {
        setValidationMessage('')
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
            try {
                await Axios.put(URL.CREATE_HISTORY(userId), {
                    'historyType': JewelleryPage.METAL_CONVERTER,
                    'content': `${originalMetal.name} (${weight}g) -> ${newMetal.name} (${calculatedWeightText})`
                })
                onRefresh()
            }
            catch (error) {
                console.error({
                    message: 'Failed to save history',
                    error: error.message,
                    stack: error.stack,
                    userId,
                    originalMetal,
                    newMetal,
                    weight,
                    calculatedWeightText,
                })
                setErrorContent('Failed to save history\n' + error.message)
                setIsErrorPopupOpen(true)
            }
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
            <h1>Metal Converter</h1>

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
                            <td><input className="general-input" type="number" step="0.01" min="0" value={weight} onChange={(e) => setWeight(e.target.value)} /></td>
                        </tr>
                    </tbody>
                </table>

                <button className="general-button" type="button" onClick={handleCalculate}>Calculate</button>
                {validationMessage && <p className="pre-wrap warning-text">{validationMessage}</p>}
            </form>

            <table>
                <tbody>
                    <tr>
                        <td>Converted Weight</td>
                        <td><input className="general-output" type="text" value={convertedWeight} disabled /></td>
                    </tr>
                </tbody>
            </table>

            {isErrorPopupOpen && (
                <PopupError isPopupOpen={isErrorPopupOpen} setIsPopupOpen={setIsErrorPopupOpen} content={errorContent} />
            )}
        </div>
    )
}

MetalConverter.propTypes = {
    onRefresh: PropTypes.func.isRequired,
}

export default MetalConverter;