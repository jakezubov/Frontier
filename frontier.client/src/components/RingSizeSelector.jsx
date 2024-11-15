import PropTypes from 'prop-types';
import { useState, useEffect } from 'react'
import { useUserSession } from '../contexts/UserContext'
import { useGetRingSizes, useGetDefaultRingSizes } from '../common/APIs'

const RingSizeSelector = ({ label, onSizeChange }) => {
    const { userId } = useUserSession()
    const [ringSizes, setRingSizes] = useState([])

    // APIs
    const { getRingSizes } = useGetRingSizes()
    const { getDefaultRingSizes } = useGetDefaultRingSizes()

    useEffect(() => {
        loadRingSizes()
    }, [userId])

    const loadRingSizes = async () => {
        if (userId) {
            const response = await getRingSizes(userId);
            setRingSizes(response)
        }
        else {
            const response = await getDefaultRingSizes();
            setRingSizes(response)
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
            <select className="general-select" aria-label={label} onChange={handleSizeChange}>
                <option value=""></option>
                {
                    ringSizes?.map((ringSize, index) => (
                        <option key={index} value={ringSize.name}>{ringSize.name}</option>
                    ))
                }
            </select>
        </div>
    )
}

RingSizeSelector.propTypes = {
    label: PropTypes.string.isRequired,
    onSizeChange: PropTypes.func.isRequired,
}

export default RingSizeSelector;