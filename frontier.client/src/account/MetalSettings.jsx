import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import URL from '../constants/URLs'
import Axios from 'axios'

const MetalSettings = ({ userId }) => {
    const [metalList, setMetalList] = useState([])

    useEffect(() => {
        loadMetalList()
    }, [])

    const loadMetalList = async () => {
        try {
            const response = await Axios.get(URL.GET_METALS(userId))
            setMetalList(response.data)
        } catch (error) {
            console.log(error)
            alert('There was an error loading metals!')
        }
    };

    const handleSave = async () => {
        for (const metal of Object.values(metalList)) {
            if (metal.name === '' && metal.specificGravity === '') {
                alert('All metals must have a valid name and specific gravity!')
                return
            } else if (metal.name === '') {
                alert('All metals must have a valid name!')
                return
            } else if (metal.specificGravity === '') {
                alert('All metals must have a valid specific gravity!')
                return
            }
        }
        try {
            await Axios.put(URL.UPDATE_METALS(userId), metalList)
            alert('All metals updated successfully!')
            loadMetalList()
        } catch (error) {
            console.log(error)
            alert('There was an error updating the metals!')
        }
    }

    const handleReset = async () => {
        try {
            await Axios.put(URL.RESET_METALS(userId))
            alert('Metals reset!')
            loadMetalList()
        }
        catch (error) {
            console.log(error)
            alert('There was an error reseting the metals!')
        }
    }

    const handleInputChange = (id, field, value) => {
        setMetalList(metalList => metalList.map(
            metal => metal.id === id ? {
                ...metal, [field]: value
            } : metal
        ))
    }

    const handleAddNew = (index) => {
        const newMetal = { name: '', specificGravity: '' }
        const newMetalsList = [...metalList]
        newMetalsList.splice(index + 1, 0, newMetal)
        setMetalList(newMetalsList)
    }

    const handleDelete = (id) => {
        setMetalList(metalList => metalList.filter(metal => metal.id !== id))
    }

    return (
        <div>
            <h2>Metal Settings</h2>
            {
                metalList.length > 0 ? (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Specific Gravity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                metalList.map((metal, index) => (
                                <tr key={metal.id}>
                                    <td><input type="text" value={metal.name} onChange={(e) => handleInputChange(metal.id, 'name', e.target.value) } /></td>
                                    <td><input type="number" step="0.01" value={metal.specificGravity} onChange={(e) => handleInputChange(metal.id, 'specificGravity', e.target.value) } /></td>
                                    <td>
                                        <button className="simple-button" onClick={() => handleAddNew(index)}><b>+</b></button>
                                        <button className="simple-button" onClick={() => handleDelete(metal.id)}><b>-</b></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
                ) : (
                    <p>No metals found</p>
                )
            }
            <button onClick={handleSave}>Save Changes</button>
            <button onClick={handleReset}>Reset to Defaults</button>
        </div>
    )
}

MetalSettings.propTypes = {
    userId: PropTypes.string.isRequired,
}

export default MetalSettings