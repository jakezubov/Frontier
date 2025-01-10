import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { validateNumber } from '../common/validation'

const CustomNumberInput = ({ step, min, onChange, startingNumber=min, disabled=false }) => {
    const [currentNumber, setCurrentNumber] = useState(startingNumber)

    useEffect(() => {
        onChange(currentNumber)
    }, [currentNumber])

    const increaseNumber = () => {
        setCurrentNumber(prevNumber => parseFloat((prevNumber + step).toFixed(2)))
    }

    const decreseNumber = () => {
        setCurrentNumber(prevNumber => {
            const newNumber = prevNumber - step
            return parseFloat((newNumber < min ? min : newNumber).toFixed(2))
        })
    }

    const changeNumber = (e) => {
        const value = e.target.value
        if (validateNumber(value)) {
            value < min ? setCurrentNumber(min) : setCurrentNumber(parseFloat(value))
        }
    }

    return (
        <div className="custom-input-container">
            <input className="general-input" type="number" step={step} min={min} value={currentNumber} onChange={changeNumber} disabled={disabled} />
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