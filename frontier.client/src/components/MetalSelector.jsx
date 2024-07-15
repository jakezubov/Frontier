import PropTypes from 'prop-types'
import Axios from 'axios'
import { useState, useEffect } from 'react'
import URL from '../constants/URLs'
import PopupError from '../components/PopupError'

const MetalSelector = ({ userId, label, onMetalChange, refresh }) => {
    const [metals, setMetals] = useState([])

    // Error Popup
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)
    const [errorContent, setErrorContent] = useState('')

    useEffect(() => {
        loadMetals()
    }, [refresh])

    const loadMetals = async () => {
        try {
            if (userId) {
                const response = await Axios.get(URL.GET_METALS(userId))
                setMetals(response.data)
            }
            else {
                const response = await Axios.get(URL.GET_DEFAULT_METALS)
                setMetals(response.data)
            }
        }
        catch (error) {
            console.error({
                message: 'Failed to load metals',
                error: error.message,
                stack: error.stack,
            })
            setErrorContent('Failed to load metals\n' + error.message)
            setIsErrorPopupOpen(true)
        }
    }

    const handleMetalChange = (e) => {
        const selectedMetalName = e.target.value
        const selectedMetal = metals.find(metal => metal.name === selectedMetalName)
        if (onMetalChange) {
            onMetalChange(selectedMetal)
        }
    };

    return (
        <div>
            <select aria-label={label} onChange={handleMetalChange}>
                <option value=""></option>
                {
                    metals.map((metal, index) => (
                        <option key={index} value={metal.name}>{metal.name}</option>
                    ))
                }
            </select>

            {isErrorPopupOpen && (
                <PopupError isPopupOpen={isErrorPopupOpen} setIsPopupOpen={setIsErrorPopupOpen} content={errorContent} />
            )}
        </div>
    )
}

MetalSelector.propTypes = {
    userId: PropTypes.string,
    label: PropTypes.string.isRequired,
    onMetalChange: PropTypes.func.isRequired,
    refresh: PropTypes.string
}

export default MetalSelector;