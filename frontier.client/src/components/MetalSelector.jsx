import PropTypes from 'prop-types'
import Axios from 'axios'
import { useState, useEffect } from 'react'
import URL from '../constants/URLs'

const MetalSelector = ({ userId, label, onMetalChange, refresh }) => {
    const [metals, setMetals] = useState([]);

    useEffect(() => {
        loadMetals();
    }, [refresh]);

    const loadMetals = async () => {
        try {
            if (userId) {
                const response = await Axios.get(URL.GET_METALS(userId));
                setMetals(response.data)
            }
            else {
                const response = await Axios.get(URL.GET_DEFAULT_METALS);
                setMetals(response.data)
            }
        }
        catch (error) {
            console.log(error)
            alert('There was an error loading metals!')
        }
    }

    const handleMetalChange = (e) => {
        const selectedMetalName = e.target.value;
        const selectedMetal = metals.find(metal => metal.name === selectedMetalName);
        if (onMetalChange) {
            onMetalChange(selectedMetal);
        }
    };

    return (
        <select aria-label={label} onChange={handleMetalChange}>
            <option value=""></option>
            {
                metals.map((metal, index) => (
                    <option key={index} value={metal.name}>{metal.name}</option>
                ))
            }
        </select>
    );
}

MetalSelector.propTypes = {
    userId: PropTypes.string,
    label: PropTypes.string.isRequired,
    onMetalChange: PropTypes.func.isRequired,
    refresh: PropTypes.string
}

export default MetalSelector;