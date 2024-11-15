import { useState, useEffect } from 'react'
import { useUserSession } from '../contexts/UserContext'
import { useGetMetals, useUpdateMetals, useResetMetals } from '../common/APIs'
import { useCurrentPage } from '../contexts/CurrentPageContext'
import TableSchemas from '../common/TableSchemas'
import PopupConfirmation from '../popups/PopupConfirmation'
import EditableTable from '../components/EditableTable'

const MetalSettings = () => {
    const { userId } = useUserSession()
    const { setCurrentPage, Pages } = useCurrentPage()

    const [metalList, setMetalList] = useState([])
    const [originalMetalList, setOriginalMetalList] = useState([])
    const [validationMessage, setValidationMessage] = useState(' ')
    const [successMessage, setSuccessMessage] = useState(' ')
    const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false)

    // APIs
    const { getMetals } = useGetMetals()
    const { updateMetals } = useUpdateMetals()
    const { resetMetals } = useResetMetals()

    useEffect(() => {
        if (userId) {
            setCurrentPage(Pages.METAL_SETTINGS)
            loadMetalList()
        }
    }, [])

    useEffect(() => {
        setValidationMessage(' ')
        setSuccessMessage(' ')
    }, [metalList])

    const loadMetalList = async () => {
        const response = await getMetals(userId)
        setMetalList(response)
        setOriginalMetalList(response)
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
        await updateMetals(userId, metalList)

        setSuccessMessage('Metals have been updated.')
        setOriginalMetalList(metalList)
    }

    const handleReset = async () => {
        await resetMetals(userId)
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
        <div>
            <h1>Metal Settings</h1>

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
            
            {isConfirmationPopupOpen && (
                <PopupConfirmation isPopupOpen={isConfirmationPopupOpen} setIsPopupOpen={setIsConfirmationPopupOpen} onConfirm={handleReset} heading="Are you sure?" />
            )}
        </div>
    )
}

export default MetalSettings