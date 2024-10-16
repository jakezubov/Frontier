import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import { useGetRingSizes, useUpdateRingSizes, useResetRingSizes } from '../common/APIs'
import TableSchemas from '../common/TableSchemas'
import PopupConfirmation from '../popups/PopupConfirmation'
import EditableTable from '../components/EditableTable'

const RingSizeSettings = () => {
    const { userId } = useContext(UserContext)
    const [ringSizeList, setRingSizeList] = useState([])
    const [originalRingSizeList, setOriginalRingSizeList] = useState([])
    const [validationMessage, setValidationMessage] = useState(' ')
    const [successMessage, setSuccessMessage] = useState(' ')
    const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false)

    // APIs
    const { getRingSizes } = useGetRingSizes()
    const { updateRingSizes } = useUpdateRingSizes()
    const { resetRingSizes } = useResetRingSizes()

    useEffect(() => {
        loadRingSizeList()
    }, [userId])

    useEffect(() => {
        setValidationMessage(' ')
        setSuccessMessage(' ')
    }, [ringSizeList])

    const loadRingSizeList = async () => {
        const response = await getRingSizes(userId)
        setRingSizeList(response)
        setOriginalRingSizeList(response)
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
        await updateRingSizes(userId, ringSizeList)

        setSuccessMessage('Ring sizes have been updated.')
        setOriginalRingSizeList(ringSizeList)
    }

    const handleReset = async () => {
        await resetRingSizes(userId)
        loadRingSizeList()
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
            <h1>Ring Size Settings</h1>

            <form onKeyDown={handleKeyDown}>
                <EditableTable tableList={ringSizeList} setTableList={setRingSizeList} columnSchema={TableSchemas.RingSizes} />

                <table>
                    <tbody>
                        <tr>
                            <td><button className="general-button" type="button" onClick={handleSave}>Save Changes</button></td>
                            <td><button className="general-button" type="button" onClick={handleClearChanges}>Clear Changes</button></td>
                            <td><button className="general-button" type="button" onClick={() => setIsConfirmationPopupOpen(true)}>Reset to Defaults</button></td>
                        </tr>
                        <tr>
                            <td colSpan="3">{validationMessage !== ' ' ? <p className="pre-wrap warning-text">{validationMessage}</p>
                                : <p className="pre-wrap success-text">{successMessage}</p>}</td>
                        </tr>
                    </tbody>
                </table>
            </form>

            {isConfirmationPopupOpen && (
                <PopupConfirmation isPopupOpen={isConfirmationPopupOpen} setIsPopupOpen={setIsConfirmationPopupOpen} onConfirm={handleReset} heading="Are you sure?" />
            )}
        </div>
    )
}

export default RingSizeSettings