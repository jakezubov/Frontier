import PropTypes from 'prop-types'
import Axios from 'axios'
import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import { validateNumber } from '../constants/HelperFunctions'
import JewelleryPage from '../constants/JewelleryPages'
import URL from '../constants/URLs'
import RingSizeSelector from '../components/RingSizeSelector'
import ProfileSelector from '../components/ProfileSelector'
import PopupError from '../components/PopupError'

const RollingWire = ({ onRefresh }) => {
    const { userId } = useContext(UserContext)

    // Inputs
    const [ringSize, setRingSize] = useState(null)
    const [profile, setProfile] = useState('')
    const [width, setWidth] = useState('')
    const [thickness, setThickness] = useState('')
    const [length, setLength] = useState('')
    const [stockSize, setStockSize] = useState('')

    // Calculated
    const [lengthRingSizeSwitch, setLengthRingSizeSwitch] = useState(true)
    const [stockSizeRequired, setStockSizeRequired] = useState(true)
    const [output1, setOutput1] = useState('')
    const [output2, setOutput2] = useState('')

    // Popups
    const [validationMessage, setValidationMessage] = useState('')
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)
    const [errorContent, setErrorContent] = useState('')

    useEffect(() => {
        setValidationMessage('')
    }, [ringSize, profile, width, thickness, length, stockSize])

    const handleCalculate = async () => {
        const isNumbersValid = validateNumber(width) && validateNumber(thickness) && validateNumber(length) && (!stockSizeRequired || validateNumber(stockSize))

        if (profile === "" || !isNumbersValid) {
            setValidationMessage("Please ensure all fields are correctly filled.")
            setOutput1('')
            setOutput2('')
            return
        }

        const side = Math.pow(Math.pow(width, 2) * thickness, 1.0 / 3)
        const lengthCalc = (length * width * thickness) / Math.pow(side, 2)
        var content = ''

        if (profile === "Round") {
            const diameter = (2 * side) / Math.sqrt(Math.PI)
            if (stockSizeRequired) {
                const stock = (4 * Math.pow(side, 2) * lengthCalc) / (Math.PI * Math.pow(stockSize, 2))
                setOutput1(diameter.toFixed(2) + "g")
                setOutput2(stock.toFixed(2) + "g")
                content = `Desired LxWxT: ${length}mm x ${width}mm x ${thickness}mm | Stock Size: ${stockSize}mm | Stock Length: ${lengthCalc.toFixed(2)}mm | Roll To - Diameter: ${diameter.toFixed(2)}mm`
            }
            else {
                setOutput1(diameter.toFixed(2) + "g")
                setOutput2(lengthCalc.toFixed(2) + "g")
                content = `Desired LxWxT: ${length}mm x ${width}mm x ${thickness}mm | Required - Diameter: ${diameter.toFixed(2)}mm | Length: ${lengthCalc.toFixed(2)}mm`
            }
        }
        else {
            if (stockSizeRequired) {
                const stock = (Math.pow(side, 2) * lengthCalc) / Math.pow(stockSize, 2)
                setOutput1(side.toFixed(2) + "g")
                setOutput2(stock.toFixed(2) + "g")
                content = `Desired LxWxT: ${length}mm x ${width}mm x ${thickness}mm | Stock Size: ${stockSize}mm | Stock Length: ${lengthCalc.toFixed(2)}mm | Roll To - Side: ${side.toFixed(2)}mm`
            }
            else {
                setOutput1(side.toFixed(2) + "g")
                setOutput2(lengthCalc.toFixed(2) + "g")
                content = `Desired LxWxT: ${length}mm x ${width}mm x ${thickness}mm | Required - Side: ${side.toFixed(2)}mm | Length: ${lengthCalc.toFixed(2)}mm`
            }
        }

        if (userId) {
            try {
                await Axios.put(URL.CREATE_HISTORY(userId), {
                    'historyType': JewelleryPage.ROLLING_WIRE,
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
                    ringSize,
                    profile,
                    width,
                    thickness,
                    length,
                    stockSize,
                    output1,
                    output2,
                })
                setErrorContent('Failed to save history\n' + error.message)
                setIsErrorPopupOpen(true)
            }
        }
    }

    const handleStockCheckbox = () => {
        !stockSizeRequired ? setStockSizeRequired(true) : setStockSizeRequired(false), setStockSize('')
    }

    const handleLengthRingSizeSwitch = () => {
        setLengthRingSizeSwitch(!lengthRingSizeSwitch)
        setLength('')
    }

    const handleRingSizeChange = (ringSize) => {
        setRingSize(ringSize)
        if (ringSize)
            setLength(ringSize.diameter)
        else
            setLength('')
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleCalculate()
        }
    }

    return (
        <div>
            <h1>Rolling Wire</h1>

            <form onKeyDown={handleKeyDown}>
                <table>
                    <tbody>
                        <tr>
                            <td>Profile</td>
                            <td><ProfileSelector label="Profile" onProfileChange={setProfile} isLimited={true} /></td>
                        </tr>
                        <tr>
                            <td>
                                {
                                    lengthRingSizeSwitch ? <button className="general-button switch-button" type="button" onClick={handleLengthRingSizeSwitch}>Length</button>
                                        : <button className="general-button switch-button" type="button" onClick={handleLengthRingSizeSwitch}>Ring Size</button>
                                }
                            </td>
                            <td>
                                {
                                    lengthRingSizeSwitch ? <input className="general-input" type="number" step="0.01" value={length} onChange={(e) => setLength(e.target.value)} />
                                        : <div><RingSizeSelector label="Ring Size" onSizeChange={handleRingSizeChange} /></div>
                                }
                            </td>
                        </tr>
                        <tr>
                            <td>Width</td>
                            <td><input className="general-input" type="number" step="0.01" min="0" value={width} onChange={(e) => setWidth(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td>Thickness</td>
                            <td><input className="general-input" type="number" step="0.01" min="0" value={thickness} onChange={(e) => setThickness(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td>Starting with Stock</td>
                            <td><input type="checkbox" onClick={handleStockCheckbox} defaultChecked={true} /></td>
                        </tr>
                        <tr>
                            <td>
                                {
                                    stockSizeRequired ? <div className="padded-text">Stock Size</div> : null
                                }
                            </td>
                            <td>
                                {
                                    stockSizeRequired ? <input className="general-input" type="number" step="0.01" min="0" value={stockSize} onChange={(e) => setStockSize(e.target.value)} /> : null
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>

                <button className="general-button" type="button" onClick={handleCalculate}>Calculate</button>
                {validationMessage && <p className="pre-wrap warning-text">{validationMessage}</p>}
            </form>
            
            <table>
                <tbody>
                    <tr>
                    {
                        profile === 'Round' ?
                            <td>Diameter</td>
                                : <td>Side</td>
                    }
                        <td><input className="general-output" type="text" value={output1} disabled /></td>
                    </tr>
                    <tr>
                    {
                        stockSizeRequired ?
                            <td>Stock Length</td>
                            : <td>Length</td>
                    }
                        <td><input className="general-output" type="text" value={output2} disabled /></td>
                    </tr>
                </tbody>
            </table>

            {isErrorPopupOpen && (
                <PopupError isPopupOpen={isErrorPopupOpen} setIsPopupOpen={setIsErrorPopupOpen} content={errorContent} />
            )}
        </div>
    )
}

RollingWire.propTypes = {
    onRefresh: PropTypes.func.isRequired,
}

export default RollingWire