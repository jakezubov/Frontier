import Axios from 'axios'
import { useState, useEffect, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons'
import { UserContext } from '../contexts/UserContext'
import PopupConfirmation from '../components/PopupConfirmation'
import PopupError from '../components/PopupError'
import URL from '../constants/URLs'
import GenerateObjectId from '../constants/GenerateObjectId'

const RingSizeSettings = () => {
    const { userId } = useContext(UserContext)
    const { generateId } = GenerateObjectId()
    const [ringSizeList, setRingSizeList] = useState([])

    // Popups
    const [validationMessage, setValidationMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false)
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)
    const [errorContent, setErrorContent] = useState('')

    useEffect(() => {
        loadRingSizeList()
    }, [userId])

    useEffect(() => {
        setValidationMessage('')
        setSuccessMessage('')
    }, [ringSizeList])

    const loadRingSizeList = async () => {
        try {
            const response = await Axios.get(URL.GET_RING_SIZES(userId))
            setRingSizeList(response.data)
        } catch (error) {
            console.error({
                message: 'Failed to load ring sizes',
                error: error.message,
                stack: error.stack,
                userId,
            })
            setErrorContent('Failed to load ring sizes\n' + error.message)
            setIsErrorPopupOpen(true)
        }
    }

    const handleSave = async () => {
        for (const ringSize of Object.values(ringSizeList)) {
            if (!ringSize.letterSize || !ringSize.numberSize || !ringSize.diameter) {
                setValidationMessage('All ring sizes must have a valid size names and diameter.')
                return
            }
        }
        try {
            await Axios.put(URL.UPDATE_RING_SIZES(userId), ringSizeList)
            setSuccessMessage('Ring sizes have been updated.')
        } catch (error) {
            console.error({
                message: 'Failed to save ring sizes',
                error: error.message,
                stack: error.stack,
                userId,
            })
            setErrorContent('Failed to save ring sizes\n' + error.message)
            setIsErrorPopupOpen(true)
        }
    }

    const handleReset = async () => {
        try {
            await Axios.put(URL.RESET_RING_SIZES(userId))
            loadRingSizeList()
        }
        catch (error) {
            cconsole.error({
                message: 'Failed to reset ring sizes',
                error: error.message,
                stack: error.stack,
                userId,
            })
            setErrorContent('Failed to reset ring sizes\n' + error.message)
            setIsErrorPopupOpen(true)
        }
    }

    const handleInputChange = (id, field, value) => {
        setRingSizeList(ringSizeList => ringSizeList.map(
            ringSize => ringSize.id === id ? {
                ...ringSize, [field]: value
            } : ringSize
        ))
    }

    const handleAddNew = async (index) => {
        try {
            const newId = await generateId()
            const newRingSize = { id: newId, letterSize: '', numberSize: '', diameter: '' }
            const newRingSizeList = [...ringSizeList]
            newRingSizeList.splice(index + 1, 0, newRingSize)
            setRingSizeList(newRingSizeList)
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
        setRingSizeList(ringSizeList => ringSizeList.filter(ringSize => ringSize.id !== id))
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleSave()
        }
    }

    return (
        <div>
            <h1>Ring Size Settings</h1>

            <form onKeyDown={handleKeyDown}>
                {ringSizeList.length > 0 ? (
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
                                            <td><input className="general-input settings-narrow-input" type="text" value={ringSize.letterSize} onChange={(e) => handleInputChange(ringSize.id, 'letterSize', e.target.value)} /></td>
                                            <td><input className="general-input settings-narrow-input" type="number" min="0" step="0.5" value={ringSize.numberSize} onChange={(e) => handleInputChange(ringSize.id, 'numberSize', e.target.value)} /></td>
                                            <td><input className="general-input settings-narrow-input" type="number" min="0" step="0.01" value={ringSize.diameter} onChange={(e) => handleInputChange(ringSize.id, 'diameter', e.target.value)} /></td>
                                            <td>
                                                <button className="settings-icon" type="button" onClick={() => handleAddNew(index)}><FontAwesomeIcon className="fa-lg" icon={faPlus} /></button>
                                                <button className="settings-icon" type="button" onClick={() => handleDelete(ringSize.id)}><FontAwesomeIcon className="fa-lg" icon={faMinus} /></button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </>
                ) : <p>No ring sizes found</p>}

                <button className="general-button" type="button" onClick={handleSave}>Save Changes</button>
                <button className="general-button" type="button" onClick={() => setIsConfirmationPopupOpen(true)}>Reset to Defaults</button>
                {validationMessage && <p className="pre-wrap warning-text">{validationMessage}</p>}
                {successMessage && <p className="pre-wrap success-text">{successMessage}</p>}
            </form>

            {isConfirmationPopupOpen && (
                <PopupConfirmation isPopupOpen={isConfirmationPopupOpen} setIsPopupOpen={setIsConfirmationPopupOpen} onConfirm={handleReset} heading="Are you sure?" />
            )}

            {isErrorPopupOpen && (
                <PopupError isPopupOpen={isErrorPopupOpen} setIsPopupOpen={setIsErrorPopupOpen} content={errorContent} />
            )}
        </div>
    )
}

export default RingSizeSettings