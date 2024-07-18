import PropTypes from 'prop-types'
import Axios from 'axios'
import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import URL from '../constants/URLs'
import PopupError from '../components/PopupError'

const MetalSelector = ({ label, onMetalChange }) => {
    const { userId } = useContext(UserContext)
    const [metals, setMetals] = useState([])

    // Error Popup
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)
    const [errorContent, setErrorContent] = useState('')

    useEffect(() => {
        loadMetals()
    }, [ userId])

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
                userId,
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
            <select className="general-select" aria-label={label} onChange={handleMetalChange}>
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
    label: PropTypes.string.isRequired,
    onMetalChange: PropTypes.func.isRequired,
}

export default MetalSelector;