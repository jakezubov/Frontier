import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCurrentPage } from '../contexts/current-page-context'
import Path from '../consts/paths'

const ConfirmationScreen = () => {
    const { setCurrentPage, Pages } = useCurrentPage()
    const navigate = useNavigate()
    const location = useLocation()
    const message = location.state?.message

    useEffect(() => {
        setCurrentPage(Pages.CONFIRMATION_SCREEN)
        if (!message) {
            navigate(Path.HOME)
        }
    }, [message])

    return (
        <div>
            <h1 className="pre-wrap">{message}</h1>
        </div>
    )
}

export default ConfirmationScreen