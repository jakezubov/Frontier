import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { validateNumber } from '../consts/validation'

const CustomNumberInput = ({ step, min, onChange, startingNumber=0, disabled=false }) => {
    const [currentNumber, setCurrentNumber] = useState(startingNumber)

    useEffect(() => {
        onChange(currentNumber)
    }, [currentNumber])

    useEffect(() => {
        if (startingNumber === "") {
            setCurrentNumber(startingNumber)
        }
        else if (validateNumber(startingNumber)) {
            setCurrentNumber(parseFloat(startingNumber))
        }
    }, [startingNumber])

    const increaseNumber = () => {
        if (validateNumber(currentNumber)) {
            setCurrentNumber(prevNumber => parseFloat((prevNumber + step).toFixed(2)))
        }
        else setCurrentNumber(min)
    }

    const decreseNumber = () => {
        if (validateNumber(currentNumber) && currentNumber > min && (currentNumber - min) > min) {
            setCurrentNumber(prevNumber => parseFloat((prevNumber - step).toFixed(2)))
        }
        else setCurrentNumber(min)
    }

    const changeNumber = (e) => {
        const value = e.target.value
        if (value === "") {
            setCurrentNumber(value)
        }
        else if (validateNumber(value)) {
            setCurrentNumber(parseFloat(value))
        }
    }

    return (
        <div className="custom-input-container">
            <input className="general-input" type="number" inputMode="decimal" step={step} min={min} value={currentNumber} onChange={changeNumber} disabled={disabled} />
            <button className="custom-input-buttons" type="button" onClick={increaseNumber} disabled={disabled}><FontAwesomeIcon className="fa-xl" icon={faCaretUp} /></button>
            <button className="custom-input-buttons" type="button" onClick={decreseNumber} disabled={disabled}><FontAwesomeIcon className="fa-xl" icon={faCaretDown} /></button>
        </div>
    )
} 

CustomNumberInput.propTypes = {
    step: PropTypes.number,
    min: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
}

export default CustomNumberInput