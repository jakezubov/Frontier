import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useCurrentPage } from '../contexts/current-page-context'
import { useUserSession } from '../contexts/user-context'
import { useGetErrorLedger, useDeleteErrorLog } from '../common/APIs'
import Path from '../common/paths'
import Paging from '../components/paging'
import HoverText from '../components/hover-text'

const ErrorLedger = () => {
    const { setCurrentPage, Pages } = useCurrentPage()
    const { adminStatus } = useUserSession()
    const navigate = useNavigate()

    const [errorList, setErrorList] = useState([])
    const [filteredList, setFilteredList] = useState([])
    const [expandedErrors, setExpandedErrors] = useState(new Set())
    const [isLoading, setIsLoading] = useState(true)

    // APIs
    const { getErrorLedger } = useGetErrorLedger()
    const { deleteErrorLog } = useDeleteErrorLog()

    useEffect(() => {
        setCurrentPage(Pages.ERROR_LEDGER)
        loadLedger()
    }, [])

    useEffect(() => {
        if (!adminStatus) {
            navigate(Path.CONFIRMATION_SCREEN, {
                state: { message: 'You need to be an admin to access that page!' }
            })
        }
    }, [adminStatus])

    const loadLedger = async () => {
        const response = await getErrorLedger()
        const formattedErrors = response.map(error => ({
            ...error,
            errorTime: formatDateTime(error.errorTime)
        }))
        setErrorList(formattedErrors)
        setIsLoading(false)
    }

    const formatDateTime = (utcDate) => {
        const date = new Date(utcDate)

        // Format date as DD/MM/YYYY
        const dateString = date.toLocaleDateString('en-GB')

        // Format time as HH:MM:SS AM/PM
        const timeString = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        })

        return `${dateString} ${timeString}`
    }

    const toggleExpanded = (errorId) => {
        setExpandedErrors(prevExpanded => {
            const newExpanded = new Set(prevExpanded)
            if (newExpanded.has(errorId)) {
                newExpanded.delete(errorId)
            } else {
                newExpanded.add(errorId)
            }
            return newExpanded
        })
    }

    const handleDelete = async (errorId) => {
        await deleteErrorLog(errorId)
        loadLedger()
    }
    
    return (
        <div>
            {isLoading ?
                <div className="loader"></div>
                :
                <div>
                    <table className="read-only-table">
                        <thead>
                            <tr>
                                <th>User Details</th>
                                <th>Error Details</th>
                                <th>Date / Time</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        {filteredList.length > 0 ?
                            <tbody>
                                {filteredList.map(error => (
                                    <tr key={error.id}>
                                        <td>{error.userDetails}</td>
                                        {expandedErrors.has(error.id) ?
                                            <td>
                                                {error.title} | {error.message} | {error.stack}
                                                <HoverText text="Show Extra Information">
                                                    <button onClick={() => toggleExpanded(error.id)} className="settings-icon"><FontAwesomeIcon icon={faChevronUp} /></button>
                                                </HoverText>
                                            </td>
                                            :
                                            <td>
                                                {error.title} | {error.message} | More Details
                                                <HoverText text="Hide Extra Information">
                                                    <button onClick={() => toggleExpanded(error.id)} className="settings-icon"><FontAwesomeIcon icon={faChevronDown} /></button>
                                                </HoverText>
                                            </td>
                                        }
                                        <td>{error.errorTime}</td>
                                        <td>
                                            <HoverText text="Delete Error Entry">
                                                <button className="settings-icon" type="button" onClick={() => handleDelete(error.id)} ><FontAwesomeIcon className="fa-md" icon={faTrashCan} /></button>
                                            </HoverText>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            :
                            <tbody>
                                <tr>
                                    <td colSpan="4"><p>There have been no errors, great job!</p></td>
                                </tr>
                            </tbody>
                        }
                    </table>
                    <Paging itemsPerPage={6} initialList={errorList} resultList={setFilteredList} />
                </div>
            }
        </div>
    )
}

export default ErrorLedger