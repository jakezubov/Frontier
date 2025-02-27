import { useState, useEffect, memo, useRef, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDivide, faXmark, faPlus, faMinus, faEquals } from '@fortawesome/free-solid-svg-icons'

const CalculateType = {
    NONE: { name: 'None', icon: null },
    ADDITION: { name: 'Addition', icon: faPlus },
    SUBTRACTION: { name: 'Subtraction', icon: faMinus },
    MULTIPLICATION: { name: 'Multiplication', icon: faXmark },
    DIVISION: { name: 'Division', icon: faDivide },
}

const Calculator = ({ refocusInput }) => {
    const [calculatorInput, setCalculatorInput] = useState('')
    const [calculateType, setCalculateType] = useState(CalculateType.NONE)
    const [firstNumber, setFirstNumber] = useState(null)
    const inputRef = useRef(null)
    const allowedKeys = ['1','2','3','4','5','6','7','8','9','0','.','=']

    useEffect(() => {
        // Focus the input element when component mounts
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [refocusInput])

    const handleButtonPress = (value) => {
        if (value === 'CLEAR') {
            setCalculatorInput('')
            setCalculateType(CalculateType.NONE)
            setFirstNumber(null)
            return
        }

        if (calculatorInput !== 'NaN') {
            if (value === '=') {
                if (firstNumber === null || calculateType === CalculateType.NONE) return

                if (parseFloat(calculatorInput)) {
                    const secondNumber = parseFloat(calculatorInput)
                    let result = 0

                    switch (calculateType) {
                        case CalculateType.ADDITION:
                            result = firstNumber + secondNumber
                            break
                        case CalculateType.SUBTRACTION:
                            result = firstNumber - secondNumber
                            break
                        case CalculateType.MULTIPLICATION:
                            result = firstNumber * secondNumber
                            break
                        case CalculateType.DIVISION:
                            result = firstNumber / secondNumber
                            break
                    }

                    setCalculatorInput(result.toString())
                }
                else setCalculatorInput('NaN')
                setCalculateType(CalculateType.NONE)
                setFirstNumber(null)
                return
            }

            // Handle operator selection
            if (typeof value === 'object' && value.name) {
                if (calculatorInput !== '') {
                    setFirstNumber(parseFloat(calculatorInput))
                    setCalculatorInput('')
                }
                setCalculateType(value)
                return
            }

            // Handle number and decimal input
            if (calculatorInput.length < 20) {
                setCalculatorInput(prev => {
                    if (value === '.' && prev.includes('.')) return prev
                    return prev + value
                })
            }
        }
    }

    const handleKeyDown = (event) => {
        event.preventDefault()
        if (event.key === 'Escape') {
            handleButtonPress('CLEAR')
            return
        }

        if (calculatorInput !== 'NaN') {
            if (event.key === '+') {
                handleButtonPress(CalculateType.ADDITION)
            }
            else if (event.key === '-') {
                handleButtonPress(CalculateType.SUBTRACTION)
            }
            else if (event.key === '*') {
                handleButtonPress(CalculateType.MULTIPLICATION)
            }
            else if (event.key === '/') {
                handleButtonPress(CalculateType.DIVISION)
            } 
            else if (event.key === 'Enter') {
                handleButtonPress('=')
            }
            else if (event.key === 'Backspace') {
                setCalculatorInput(prev => prev.slice(0, -1))
            }
            else if (allowedKeys.includes(event.key) && calculatorInput.length < 20) {
                handleButtonPress(event.key)
            }
        }
    }

    const handleInputChange = (value) => {
        const filteredValue = value.split('').filter(char => allowedKeys.includes(char)).join('')

        // Ensure we don't have multiple decimal points
        const parts = filteredValue.split('.')
        const sanitizedValue = parts[0] + (parts.length > 1 ? '.' + parts[1] : '')

        if (sanitizedValue.length <= 20) {
            setCalculatorInput(sanitizedValue)
        }
    }

    return (
        <div onKeyDown={handleKeyDown}>
            <h3 className="tight-top">Calculator</h3>
            
            <div className="calculator-container">
                <p className="calculator-first-number">{firstNumber}</p>
                <input className="general-input calculator-input" ref={inputRef} inputMode="none" value={calculatorInput} onChange={(e) => handleInputChange(e.target.value)} ></input>
                {calculateType !== CalculateType.NONE && <div className="calculator-type" ><FontAwesomeIcon className="fa-xl" icon={calculateType.icon} /></div>}
            </div>

            <table className="calculator-container">
                <tbody>
                    <tr>
                        <td><button className="calculator-button" onClick={() => handleButtonPress('7')}>7</button></td>
                        <td><button className="calculator-button" onClick={() => handleButtonPress('8')}>8</button></td>
                        <td><button className="calculator-button" onClick={() => handleButtonPress('9')}>9</button></td>
                        <td><button className="calculator-button" onClick={() => handleButtonPress(CalculateType.DIVISION)}><FontAwesomeIcon icon={faDivide} /></button></td>
                    </tr>
                    <tr>
                        <td><button className="calculator-button" onClick={() => handleButtonPress('4')}>4</button></td>
                        <td><button className="calculator-button" onClick={() => handleButtonPress('5')}>5</button></td>
                        <td><button className="calculator-button" onClick={() => handleButtonPress('6')}>6</button></td>
                        <td><button className="calculator-button" onClick={() => handleButtonPress(CalculateType.MULTIPLICATION)}><FontAwesomeIcon icon={faXmark} /></button></td>
                    </tr>
                    <tr>
                        <td><button className="calculator-button" onClick={() => handleButtonPress('1')}>1</button></td>
                        <td><button className="calculator-button" onClick={() => handleButtonPress('2')}>2</button></td>
                        <td><button className="calculator-button" onClick={() => handleButtonPress('3')}>3</button></td>
                        <td><button className="calculator-button" onClick={() => handleButtonPress(CalculateType.SUBTRACTION)}><FontAwesomeIcon icon={faMinus} /></button></td>
                    </tr>
                    <tr>
                        <td><button className="calculator-button" onClick={() => handleButtonPress('0')}>0</button></td>
                        <td><button className="calculator-button" onClick={() => handleButtonPress('.')}>.</button></td>
                        <td><button className="calculator-button" onClick={() => handleButtonPress('CLEAR')}>C</button></td>
                        <td><button className="calculator-button" onClick={() => handleButtonPress(CalculateType.ADDITION)}><FontAwesomeIcon icon={faPlus} /></button></td>
                    </tr>
                    <tr>
                        <td colSpan="4"><button className="calculator-button equals-button" onClick={() => handleButtonPress('=')}><FontAwesomeIcon icon={faEquals} /></button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default memo(Calculator)