import { useEffect } from 'react'
import { useCurrentPage } from '../contexts/CurrentPageContext'
import { useNavigate, useLocation } from 'react-router-dom'
import Path from '../common/Paths'

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
    }, [])

    return (
        <div>
            <h1 className="pre-wrap">{message}</h1>
        </div>
    )
}

export default ConfirmationScreen