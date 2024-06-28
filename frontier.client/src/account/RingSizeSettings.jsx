import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import URL from '../constants/URLs'
import Axios from 'axios'

const RingSizeSettings = ({ userId }) => {
    const [ringSizeList, setRingSizeList] = useState([])

    useEffect(() => {
        loadRingSizeList()
    }, [])

    const loadRingSizeList = async () => {
        try {
            const response = await Axios.get(URL.GET_RING_SIZES(userId))
            setRingSizeList(response.data)
        } catch (error) {
            console.log(error)
            alert('There was an error loading ring sizes!')
        }
    };

    const handleSave = async () => {
        for (const ringSize of Object.values(ringSizeList)) {
            if (ringSize.letterSize === '' && ringSize.numberSize === '' && ringSize.diameter) {
                alert('All ring sizes must have a valid size name and diameter!')
                return
            } else if (ringSize.letterSize === '' && ringSize.numberSize === '') {
                alert('All ring sizes must have a valid size name!')
                return
            } else if (ringSize.diameter === '') {
                alert('All ring sizes must have a valid diameter!')
                return
            }
        }
        try {
            await Axios.put(URL.UPDATE_RING_SIZES(userId), ringSizeList)
            alert('All ring sizes updated successfully!')
            loadRingSizeList()
        } catch (error) {
            console.log(error)
            alert('There was an error updating the ring sizes!')
        }
    }

    const handleReset = async () => {
        try {
            await Axios.put(URL.RESET_RING_SIZES(userId))
            alert('Ring sizes reset!')
            loadRingSizeList()
        }
        catch (error) {
            console.log(error)
            alert('There was an error reseting the ring sizes!')
        }
    }

    const handleInputChange = (id, field, value) => {
        setRingSizeList(ringSizeList => ringSizeList.map(
            ringSize => ringSize.id === id ? {
                ...ringSize, [field]: value
            } : ringSize
        ))
    }

    const handleAddNew = (index) => {
        const newRingSize = { letterSize: '', numberSize: '', diameter: '' }
        const newRingSizeList = [...ringSizeList]
        newRingSizeList.splice(index + 1, 0, newRingSize)
        setRingSizeList(newRingSizeList)
    }

    const handleDelete = (id) => {
        setRingSizeList(ringSizeList => ringSizeList.filter(ringSize => ringSize.id !== id))
    }

    return (
        <div>
            <h2>Ring Size Settings</h2>
            {
                ringSizeList.length > 0 ? (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Letter Size</th>
                                <th>Number Size</th>
                                <th>Diameter</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                ringSizeList.map((ringSize, index) => (
                                <tr key={ringSize.id}>
                                    <td><input type="text" value={ringSize.letterSize} onChange={(e) => handleInputChange(ringSize.id, 'letterSize', e.target.value) } /></td>
                                    <td><input type="text" value={ringSize.numberSize} onChange={(e) => handleInputChange(ringSize.id, 'numberSize', e.target.value) } /></td>
                                    <td><input type="number" step="0.01" value={ringSize.diameter} onChange={(e) => handleInputChange(ringSize.id, 'diameter', e.target.value) } /></td>
                                    <td>
                                        <button className="simple-button" onClick={() => handleAddNew(index)}><b>+</b></button>
                                        <button className="simple-button" onClick={() => handleDelete(ringSize.id)}><b>-</b></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
                ) : (
                    <p>No ring sizes found</p>
                )
            }
            <button onClick={handleSave}>Save Changes</button>
            <button onClick={handleReset}>Reset to Defaults</button>
        </div>
    )
}

RingSizeSettings.propTypes = {
    userId: PropTypes.string.isRequired,
}

export default RingSizeSettings