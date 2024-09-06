import Axios from 'axios'
import { useState, useEffect } from 'react'
import PopupConfirmation from '../popups/PopupConfirmation'
import PopupError from '../popups/PopupError'
import URL from '../constants/URLs'
import TableSchemas from '../constants/TableSchemas'
import EditableTable from '../components/EditableTable'

const DefaultRingSizes = () => {
    const [ringSizeList, setRingSizeList] = useState([])
    const [originalRingSizeList, setOriginalRingSizeList] = useState([])

    // Popups
    const [validationMessage, setValidationMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false)
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)
    const [errorContent, setErrorContent] = useState('')

    useEffect(() => {
        loadRingSizeList()
    }, [])

    useEffect(() => {
        setValidationMessage('')
        setSuccessMessage('')
    }, [ringSizeList])

    const loadRingSizeList = async () => {
        try {
            const response = await Axios.get(URL.GET_DEFAULT_RING_SIZES)
            setRingSizeList(response.data)
            setOriginalRingSizeList(response.data)
        } catch (error) {
            console.error({
                message: 'Failed to load ring sizes',
                error: error.message,
                stack: error.stack,
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
            else if (ringSize.diameter <= 0) {
                setValidationMessage('All ring sizes must have a diameter greater than zero.')
                return
            }
        }
        try {
            await Axios.put(URL.UPDATE_DEFAULT_RING_SIZES, ringSizeList)
            setSuccessMessage('Ring sizes have been updated.')
            setOriginalRingSizeList(ringSizeList)
        } catch (error) {
            console.error({
                message: 'Failed to save ring sizes',
                error: error.message,
                stack: error.stack,
            })
            setErrorContent('Failed to save ring sizes\n' + error.message)
            setIsErrorPopupOpen(true)
        }
    }

    const handleReset = async () => {
        try {
            await Axios.put(URL.RESET_DEFAULT_RING_SIZES)
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

    const handleClearChanges = () => {
        setRingSizeList(originalRingSizeList)
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleSave()
        }
    }

    return (
        <div>
            <h1>Default Ring Size Settings</h1>

            <form onKeyDown={handleKeyDown}>
                <EditableTable tableList={ringSizeList} setTableList={setRingSizeList} columnSchema={TableSchemas.RingSizes} />

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

export default DefaultRingSizes