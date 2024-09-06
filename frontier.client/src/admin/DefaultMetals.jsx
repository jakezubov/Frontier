import Axios from 'axios'
import { useState, useEffect, useContext } from 'react'
import PopupConfirmation from '../popups/PopupConfirmation'
import PopupError from '../popups/PopupError'
import URL from '../constants/URLs'
import TableSchemas from '../constants/TableSchemas'
import EditableTable from '../components/EditableTable'

const DefaultMetals = () => {
    const [metalList, setMetalList] = useState([])
    const [originalMetalList, setOriginalMetalList] = useState([])

    // Popups
    const [validationMessage, setValidationMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false)
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)
    const [errorContent, setErrorContent] = useState('')

    useEffect(() => {
        loadMetalList()
    }, [])

    useEffect(() => {
        setValidationMessage('')
        setSuccessMessage('')
    }, [metalList])

    const loadMetalList = async () => {
        try {
            const response = await Axios.get(URL.GET_DEFAULT_METALS)
            setMetalList(response.data)
            setOriginalMetalList(response.data)
        } catch (error) {
            console.error({
                message: 'Failed to load metals',
                error: error.message,
                stack: error.stack,
            })
            setErrorContent('Failed to load metals\n' + error.message)
            setIsErrorPopupOpen(true)
        }
    }

    const handleSave = async () => {
        for (const metal of Object.values(metalList)) {
            if (!metal.name || !metal.specificGravity) {
                setValidationMessage('All metals must have a valid name and specific gravity.')
                return
            }
            else if (metal.specificGravity <= 0) {
                setValidationMessage('All metals must have a specific gravity greater than zero.')
                return
            }
        }
        try {
            await Axios.put(URL.UPDATE_DEFAULT_METALS, metalList)
            setSuccessMessage('Metals have been updated.')
            setOriginalMetalList(metalList)
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
            await Axios.put(URL.RESET_DEFAULT_METALS)
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

    const handleClearChanges = () => {
        setMetalList(originalMetalList)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleSave()
        }
    }

    return (
        <div>
            <h1>Default Metal Settings</h1>

            <form onKeyDown={handleKeyDown}>
                <EditableTable tableList={metalList} setTableList={setMetalList} columnSchema={TableSchemas.Metals} />

                <table>
                    <tbody>
                        <tr>
                            <td><button className="general-button" type="button" onClick={handleSave}>Save Changes</button></td>
                            <td><button className="general-button" type="button" onClick={handleClearChanges}>Clear Changes</button></td>
                            <td><button className="general-button" type="button" onClick={() => setIsConfirmationPopupOpen(true)}>Reset to Defaults</button></td>
                        </tr>
                    </tbody>
                </table>
            </form>

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

export default DefaultMetals