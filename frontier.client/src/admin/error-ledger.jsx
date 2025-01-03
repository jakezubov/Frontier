import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentPage } from '../contexts/current-page-context'
import { useUserSession } from '../contexts/user-context'
import { useGetErrorLedger } from '../common/APIs'
import Path from '../common/paths'

const ErrorLedger = () => {
    const { setCurrentPage, Pages } = useCurrentPage()
    const { adminStatus } = useUserSession()
    const navigate = useNavigate()

    const [errorList, setErrorList] = useState([])

    // APIs
    const { getErrorLedger } = useGetErrorLedger()

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
        setErrorList(response)
    }
    
    return (
        <div>
            <h1>Error Ledger</h1>

            <table className="user-table">
                <thead>
                    <tr>
                        <th>User Details</th>
                        <th>Title</th>
                        <th>Message</th>
                        <th>Stack</th>
                        <th>DateTime</th>
                    </tr>
                </thead>
                <tbody>
                    {errorList.map(error => (
                        <tr key={error.id}>
                            <td>{error.userDetails}</td>
                            <td>{error.title}</td>
                            <td>{error.message}</td>
                            <td>{error.stack}</td>
                            <td>{error.errorTime}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ErrorLedger