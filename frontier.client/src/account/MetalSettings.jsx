import PropTypes from 'prop-types'
import Axios from 'axios'
import { useState, useEffect } from 'react'
import PopupConfirmation from '../components/PopupConfirmation'
import PopupError from '../components/PopupError'
import URL from '../constants/URLs'
import GenerateObjectId from '../constants/GenerateObjectId'

const MetalSettings = ({ userId }) => {
    const { generateId } = GenerateObjectId()
    const [metalList, setMetalList] = useState([])

    // Popups
    const [validationMessage, setValidationMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false)
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)
    const [errorContent, setErrorContent] = useState('')

    useEffect(() => {
        loadMetalList()
    }, [userId])

    useEffect(() => {
        setValidationMessage('')
        setSuccessMessage('')
    }, [metalList])

    const loadMetalList = async () => {
        try {
            const response = await Axios.get(URL.GET_METALS(userId))
            setMetalList(response.data)
        } catch (error) {
            console.error({
                message: 'Failed to load metals',
                error: error.message,
                stack: error.stack,
            })
            setErrorContent('Failed to load metals\n' + error.message)
            setIsErrorPopupOpen(true)
        }
    };

    const handleSave = async () => {
        for (const metal of Object.values(metalList)) {
            if (!metal.name || !metal.specificGravity) {
                setValidationMessage('All metals must have a valid name and specific gravity.')
                return
            }
        }
        try {
            await Axios.put(URL.UPDATE_METALS(userId), metalList)
            setSuccessMessage('Metals have been updated.')
        } catch (error) {
            console.error({
                message: 'Failed to save metals',
                error: error.message,
                stack: error.stack,
            })
            setErrorContent('Failed to save metals\n' + error.message)
            setIsErrorPopupOpen(true)
        }
    }

    const handleReset = async () => {
        try {
            await Axios.put(URL.RESET_METALS(userId))
            loadMetalList()
        }
        catch (error) {
            console.error({
                message: 'Failed to reset metals',
                error: error.message,
                stack: error.stack,
            })
            setErrorContent('Failed to reset metals\n' + error.message)
            setIsErrorPopupOpen(true)
        }
    }

    const handleInputChange = (id, field, value) => {
        setMetalList(metalList => metalList.map(
            metal => metal.id === id ? {
                ...metal, [field]: value
            } : metal
        ))
    }

    const handleAddNew = async (index) => {
        try {
            const newId = await generateId()
            const newMetal = { id: newId, name: '', specificGravity: '' }
            const newMetalsList = [...metalList]
            newMetalsList.splice(index + 1, 0, newMetal)
            setMetalList(newMetalsList)
        }
        catch (error) {
            console.error({
                message: 'Object Id failed to generate',
                error: error.message,
                stack: error.stack,
            })
            setErrorContent('Object Id failed to generate\n' + error.message)
            setIsErrorPopupOpen(true)
        }
    }

    const handleDelete = (id) => {
        setMetalList(metalList => metalList.filter(metal => metal.id !== id))
    }

    return (
        <div>
            <h1>Metal Settings</h1>
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
            <button onClick={() => setIsConfirmationPopupOpen(true)}>Reset to Defaults</button>
            {validationMessage && <p className="pre-wrap warning-text">{validationMessage}</p>}
            {successMessage && <p className="pre-wrap success-text">{successMessage}</p>}

            {isConfirmationPopupOpen && (
                <PopupConfirmation isPopupOpen={isConfirmationPopupOpen} setIsPopupOpen={setIsConfirmationPopupOpen} onConfirm={handleReset} heading="Are you sure?" />
            )}

            {isErrorPopupOpen && (
                <PopupError isPopupOpen={isErrorPopupOpen} setIsPopupOpen={setIsErrorPopupOpen} content={errorContent} />
            )}
        </div>
    )
}

MetalSettings.propTypes = {
    userId: PropTypes.string.isRequired,
}

export default MetalSettings