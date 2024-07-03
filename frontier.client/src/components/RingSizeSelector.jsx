import PropTypes from 'prop-types';
import Axios from 'axios';
import { useState, useEffect } from 'react';
import URL from '../constants/URLs';

const RingSizeSelector = ({ userId, label, onSizeChange, refresh }) => {
    const [ringSizes, setRingSizes] = useState([]);

    useEffect(() => {
        loadRingSizes();
    }, [refresh]);

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
            console.log(error)
            alert('There was an error loading ring sizes!')
        }
    }

    const handleSizeChange = (e) => {
        const selectedSizeName = e.target.value;
        const selectedSize = ringSizes.find(ringSize => ringSize.name === selectedSizeName);
        if (onSizeChange) {
            onSizeChange(selectedSize);
        }
    };

    return (
        <select aria-label={label} onChange={handleSizeChange}>
            <option value=""></option>
            {
                ringSizes.map((ringSize, index) => (
                    <option key={index} value={ringSize.name}>{ringSize.name}</option>
                ))
            }
        </select>
    );
}

RingSizeSelector.propTypes = {
    userId: PropTypes.string,
    label: PropTypes.string.isRequired,
    onSizeChange: PropTypes.func.isRequired,
    refresh: PropTypes.bool
}

export default RingSizeSelector;