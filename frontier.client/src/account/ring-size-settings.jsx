import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserSession } from '../contexts/user-context'
import { useGetRingSizes, useUpdateRingSizes, useResetRingSizes } from '../common/APIs'
import { useCurrentPage } from '../contexts/current-page-context'
import TableSchemas from '../common/table-schemas'
import PopupConfirmation from '../popups/popup-confirmation'
import EditableTable from '../components/editable-table'
import Path from '../common/paths'

const RingSizeSettings = () => {
    const { userId, loggedInStatus } = useUserSession()
    const { setCurrentPage, Pages } = useCurrentPage()
    const navigate = useNavigate()

    const [ringSizeList, setRingSizeList] = useState([])
    const [originalRingSizeList, setOriginalRingSizeList] = useState([])
    const [validationMessage, setValidationMessage] = useState(' ')
    const [successMessage, setSuccessMessage] = useState(' ')
    const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // APIs
    const { getRingSizes } = useGetRingSizes()
    const { updateRingSizes } = useUpdateRingSizes()
    const { resetRingSizes } = useResetRingSizes()

    useEffect(() => {
        if (userId) {
            setCurrentPage(Pages.RING_SIZE_SETTINGS)
            loadRingSizeList()
        }
    }, [])

    useEffect(() => {
        if (!loggedInStatus) {
            navigate(Path.CONFIRMATION_SCREEN, {
                state: { message: 'You need to be logged in to access that page!' }
            })
        }
    }, [loggedInStatus])

    useEffect(() => {
        setValidationMessage(' ')
        setSuccessMessage(' ')
    }, [ringSizeList])

    const loadRingSizeList = async () => {
        const response = await getRingSizes(userId)
        setRingSizeList(response)
        setOriginalRingSizeList(response)
        setIsLoading(false)
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
        <div className="table-margin-top">
            {isLoading ?
                <div className="loader"></div>
                :
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
                                <td colSpan="3">{validationMessage !== ' ' ? <p className="pre-wrap warning-text tight-top">{validationMessage}</p>
                                    : <p className="pre-wrap success-text tight-top">{successMessage}</p>}</td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            }
            {isConfirmationPopupOpen && (
                <PopupConfirmation isPopupOpen={isConfirmationPopupOpen} setIsPopupOpen={setIsConfirmationPopupOpen} onConfirm={handleReset} heading="Are you sure?" />
            )}
        </div>
    )
}

export default RingSizeSettings