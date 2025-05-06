import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetDefaultRingSizes, useUpdateDefaultRingSizes, useResetDefaultRingSizes } from '../APIs/ring-sizes'
import { useCurrentPage } from '../contexts/current-page-context'
import { useUserSession } from '../contexts/user-context'
import TableSchemas from '../consts/table-schemas'
import PopupConfirmation from '../popups/popup-confirmation'
import EditableTable from '../components/editable-table'
import Path from '../consts/paths'

const DefaultRingSizes = () => {
    const { setCurrentPage, Pages } = useCurrentPage()
    const { adminStatus } = useUserSession()
    const navigate = useNavigate()

    const [ringSizeList, setRingSizeList] = useState([])
    const [originalRingSizeList, setOriginalRingSizeList] = useState([])
    const [validationMessage, setValidationMessage] = useState(' ')
    const [successMessage, setSuccessMessage] = useState(' ')
    const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // APIs
    const { getDefaultRingSizes } = useGetDefaultRingSizes()
    const { updateDefaultRingSizes } = useUpdateDefaultRingSizes()
    const { resetDefaultRingSizes } = useResetDefaultRingSizes()

    useEffect(() => {
        setCurrentPage(Pages.DEFAULT_RING_SIZES)
        loadRingSizeList()
    }, [])

    useEffect(() => {
        if (!adminStatus) {
            navigate(Path.CONFIRMATION_SCREEN, {
                state: { message: 'You need to be an admin to access that page!' }
            })
        }
    }, [adminStatus])

    useEffect(() => {
        setValidationMessage(' ')
        setSuccessMessage(' ')
    }, [ringSizeList])

    const loadRingSizeList = async () => {
        const response = await getDefaultRingSizes()
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
        await updateDefaultRingSizes(ringSizeList)

        setSuccessMessage('Ring sizes have been updated.')
        setOriginalRingSizeList(ringSizeList)
    }

    const handleReset = async () => {
        await resetDefaultRingSizes()
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

export default DefaultRingSizes