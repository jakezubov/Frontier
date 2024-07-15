import PropTypes from 'prop-types';
import Axios from 'axios';
import { useState, useEffect } from 'react';
import URL from '../constants/URLs';
import PopupError from './PopupError'

const RingSizeSelector = ({ userId, label, onSizeChange, refresh }) => {
    const [ringSizes, setRingSizes] = useState([])

    // Error Popup
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)
    const [errorContent, setErrorContent] = useState('')

    useEffect(() => {
        loadRingSizes()
    }, [refresh])

    const loadRingSizes = async () => {
        try {
            if (userId) {
                const response = await Axios.get(URL.GET_RING_SIZES(userId));
                setRingSizes(response.data)
            }
            else {
                const response = await Axios.get(URL.GET_DEFAULT_RING_SIZES);
                setRingSizes(response.data)
            }
        }
        catch (error) {
            console.error({
                message: 'Failed to load ring sizes',
                error: error.message,
                stack: error.stack,
            })
            setErrorContent('Failed to load ring sizes\n' + error.message)
            setIsErrorPopupOpen(true)
        }
    }

    const handleSizeChange = (e) => {
        const selectedSizeName = e.target.value;
        const selectedSize = ringSizes.find(ringSize => ringSize.name === selectedSizeName);
        if (onSizeChange) {
            onSizeChange(selectedSize);
        }
    }

    return (
        <div>
            <select aria-label={label} onChange={handleSizeChange}>
                <option value=""></option>
                {
                    ringSizes.map((ringSize, index) => (
                        <option key={index} value={ringSize.name}>{ringSize.name}</option>
                    ))
                }
            </select>

            {isErrorPopupOpen && (
                    <PopupError isPopupOpen={isErrorPopupOpen} setIsPopupOpen={setIsErrorPopupOpen} content={errorContent} />
            )}
        </div>
    )
}

RingSizeSelector.propTypes = {
    userId: PropTypes.string,
    label: PropTypes.string.isRequired,
    onSizeChange: PropTypes.func.isRequired,
    refresh: PropTypes.bool
}

export default RingSizeSelector;