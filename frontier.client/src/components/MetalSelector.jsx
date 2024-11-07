import PropTypes from 'prop-types'
import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import { useGetMetals, useGetDefaultMetals } from '../common/APIs'

const MetalSelector = ({ label, onMetalChange }) => {
    const { userId } = useContext(UserContext)
    const [metals, setMetals] = useState([])

    // APIs
    const { getMetals } = useGetMetals()
    const { getDefaultMetals } = useGetDefaultMetals()

    useEffect(() => {
        loadMetals()
    }, [ userId])

    const loadMetals = async () => {
        if (userId) {
            const response = await getMetals(userId)
            setMetals(response)
        }
        else {
            const response = await getDefaultMetals()
            setMetals(response)
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
                    metals?.map((metal, index) => (
                        <option key={index} value={metal.name}>{metal.name}</option>
                    ))
                }
            </select>
        </div>
    )
}

MetalSelector.propTypes = {
    label: PropTypes.string.isRequired,
    onMetalChange: PropTypes.func.isRequired,
}

export default MetalSelector;