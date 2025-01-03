import { useState, useEffect } from 'react'
import { useUserSession } from '../contexts/user-context'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRepeat } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from '../contexts/history-context'
import { useCurrentPage } from '../contexts/current-page-context'
import { validateNumber } from '../common/validation'
import RingSizeSelector from '../components/ring-size-selector'
import ProfileSelector from '../components/profile-selector'

const RollingWire = () => {
    const { userId } = useUserSession()
    const { addHistory } = useHistory()
    const { setCurrentPage, Pages, isMobile } = useCurrentPage()

    // Inputs
    const [ringSize, setRingSize] = useState(null)
    const [profile, setProfile] = useState('')
    const [width, setWidth] = useState('')
    const [thickness, setThickness] = useState('')
    const [length, setLength] = useState('')
    const [stockSize, setStockSize] = useState('')
    const [validationMessage, setValidationMessage] = useState(' ')

    // Calculated
    const [lengthRingSizeSwitch, setLengthRingSizeSwitch] = useState(true)
    const [stockSizeRequired, setStockSizeRequired] = useState(true)
    const [output1, setOutput1] = useState('')
    const [output2, setOutput2] = useState('')

    useEffect(() => {
        setCurrentPage(Pages.ROLLING_WIRE)
    }, [])

    useEffect(() => {
        setValidationMessage(' ')
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
                content = `Desired LxWxT: ${length}mm x ${width}mm x ${thickness}mm | Stock Size: ${stockSize}mm | Stock Length: ${stock.toFixed(2)}mm | Roll To - Diameter: ${diameter.toFixed(2)}mm`
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
                content = `Desired LxWxT: ${length}mm x ${width}mm x ${thickness}mm | Stock Size: ${stockSize}mm | Stock Length: ${stock.toFixed(2)}mm | Roll To - Side: ${side.toFixed(2)}mm`
            }
            else {
                setOutput1(side.toFixed(2) + "g")
                setOutput2(lengthCalc.toFixed(2) + "g")
                content = `Desired LxWxT: ${length}mm x ${width}mm x ${thickness}mm | Required - Side: ${side.toFixed(2)}mm | Length: ${lengthCalc.toFixed(2)}mm`
            }
        }

        if (userId) {
            addHistory(content)
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
            { isMobile === "false"  ?
                <table>
                    <thead>
                        <tr>
                            <th colSpan="2"><h3>Required Dimensions</h3></th>
                            <th></th>
                            <th colSpan="2"><h3>Starting Metal</h3></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="rolling-wire-switch">
                                {lengthRingSizeSwitch ? <p>Length</p>
                                    : <p>Ring Size</p>}
                                <button className="settings-icon" type="button" onClick={handleLengthRingSizeSwitch}><FontAwesomeIcon icon={faRepeat} /></button>
                            </td>
                            <td>
                                {lengthRingSizeSwitch ? <input className="general-input" type="number" step="0.01" min="0.01" value={length} onChange={(e) => setLength(e.target.value)} />
                                    : <div><RingSizeSelector label="Ring Size" onSizeChange={handleRingSizeChange} /></div>}
                            </td>
                            <td className="table-break"></td>
                            <td>Profile</td>
                            <td><ProfileSelector label="Profile" onProfileChange={setProfile} isLimited={true} /></td>
                        </tr>
                        <tr>
                            <td>Width</td>
                            <td><input className="general-input" type="number" step="0.01" min="0.01" value={width} onChange={(e) => setWidth(e.target.value)} /></td>
                            <td className="table-break"></td>
                            <td>Starting with Stock</td>
                            <td><input type="checkbox" onClick={handleStockCheckbox} defaultChecked={true} /></td>
                        </tr>
                        <tr>
                            <td>Thickness</td>
                            <td><input className="general-input" type="number" step="0.01" min="0.01" value={thickness} onChange={(e) => setThickness(e.target.value)} /></td>
                            <td className="table-break"></td>
                            <td><div className="padded-text" >Stock Size</div></td>
                            <td><input className="general-input" type="number" step="0.01" min="0.01" value={stockSize} onChange={(e) => setStockSize(e.target.value)} disabled={!stockSizeRequired} /></td>
                        </tr>
                        <tr>
                            <td colSpan="5"><button className="general-button" type="button" onClick={handleCalculate}>Calculate</button></td>
                        </tr>
                        <tr>
                            <td colSpan="5">{validationMessage && <p className="pre-wrap warning-text tight-text">{validationMessage}</p>}</td>
                        </tr>
                    </tbody>
                </table>
                :
                <>
                    <table>
                        <thead>
                            <tr>
                                <th colSpan="2"><h3>Required Dimensions</h3></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="rolling-wire-switch">
                                    {lengthRingSizeSwitch ? <p>Length</p>
                                        : <p>Ring Size</p>}
                                    <button className="settings-icon" type="button" onClick={handleLengthRingSizeSwitch}><FontAwesomeIcon icon={faRepeat} /></button>
                                </td>
                                <td>
                                    {lengthRingSizeSwitch ? <input className="general-input" type="number" step="0.01" min="0.01" value={length} onChange={(e) => setLength(e.target.value)} />
                                        : <div><RingSizeSelector label="Ring Size" onSizeChange={handleRingSizeChange} /></div>}
                                </td>
                            </tr>
                            <tr>
                                <td>Width</td>
                                <td><input className="general-input" type="number" step="0.01" min="0.01" value={width} onChange={(e) => setWidth(e.target.value)} /></td>
                            </tr>
                            <tr>
                                <td>Thickness</td>
                                <td><input className="general-input" type="number" step="0.01" min="0.01" value={thickness} onChange={(e) => setThickness(e.target.value)} /></td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="table-break"></div>
                    <table>
                        <thead>
                            <tr>
                                <th colSpan="2"><h3>Starting Metal</h3></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Profile</td>
                                <td><ProfileSelector label="Profile" onProfileChange={setProfile} isLimited={true} /></td>
                            </tr>
                            <tr>
                                <td>Starting with Stock</td>
                                <td><input type="checkbox" onClick={handleStockCheckbox} defaultChecked={true} /></td>
                            </tr>
                            <tr>
                                <td><div className="padded-text" >Stock Size</div></td>
                                <td><input className="general-input" type="number" step="0.01" min="0.01" value={stockSize} onChange={(e) => setStockSize(e.target.value)} disabled={!stockSizeRequired} /></td>
                            </tr>
                            <tr>
                                <td colSpan="2"><button className="general-button" type="button" onClick={handleCalculate}>Calculate</button></td>
                            </tr>
                            <tr>
                                <td colSpan="2">{validationMessage && <p className="pre-wrap warning-text tight-text">{validationMessage}</p>}</td>
                            </tr>
                        </tbody>
                    </table>
                </>
            }
            </form> 

            <table>
                <thead>
                    <tr>
                        <th>
                            {profile === 'Round' ?
                                <h3 className="tight-bottom">Diameter</h3>
                                : <h3 className="tight-bottom">Side</h3>}
                        </th>
                        <th>
                            {stockSizeRequired ?
                                <h3 className="tight-bottom">Stock Length</h3>
                                : <h3 className="tight-bottom">Length</h3>}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input className="general-output" type="text" value={output1} disabled /></td>
                        <td><input className="general-output" type="text" value={output2} disabled /></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default RollingWire