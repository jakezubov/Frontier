import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetDefaultMetals, useUpdateDefaultMetals, useResetDefaultMetals } from '../common/APIs'
import { useCurrentPage } from '../contexts/current-page-context'
import { useUserSession } from '../contexts/user-context'
import TableSchemas from '../common/table-schemas'
import PopupConfirmation from '../popups/popup-confirmation'
import EditableTable from '../components/editable-table'
import Path from '../common/paths'

const DefaultMetals = () => {
    const { setCurrentPage, Pages } = useCurrentPage()
    const { adminStatus } = useUserSession()
    const navigate = useNavigate()

    const [metalList, setMetalList] = useState([])
    const [originalMetalList, setOriginalMetalList] = useState([])
    const [validationMessage, setValidationMessage] = useState(' ')
    const [successMessage, setSuccessMessage] = useState(' ')
    const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // APIs
    const { getDefaultMetals } = useGetDefaultMetals()
    const { updateDefaultMetals } = useUpdateDefaultMetals()
    const { resetDefaultMetals } = useResetDefaultMetals()

    useEffect(() => {
        setCurrentPage(Pages.DEFAULT_METALS)
        loadMetalList()
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
    }, [metalList])

    const loadMetalList = async () => {
        const response = await getDefaultMetals()
        setMetalList(response)
        setOriginalMetalList(response)
        setIsLoading(false)
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
        await updateDefaultMetals(metalList)

        setSuccessMessage('Metals have been updated.')
        setOriginalMetalList(metalList)
    }

    const handleReset = async () => {
        await resetDefaultMetals()
        loadMetalList()
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
        <div className="table-margin-top">
            {isLoading ?
                <div class="loader"></div>
                :
                <form onKeyDown={handleKeyDown}>
                    <EditableTable tableList={metalList} setTableList={setMetalList} columnSchema={TableSchemas.Metals} />

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

export default DefaultMetals