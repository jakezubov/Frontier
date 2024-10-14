import Axios from 'axios'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import URL from '../../constants/URLs'
import PopupError from '../../popups/PopupError'

const VerifyAccount = () => {
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)
    const [errorContent, setErrorContent] = useState('')
    const [email, setEmail] = useState('')
    const location = useLocation()

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search)
        const emailFromURL = searchParams.get('email')
        setEmail(emailFromURL)
    }, [location])

    useEffect(() => {
        if (email) {
            verify()
        }
    }, [email])

    const verify = async () => {
        try {
            await Axios.put(URL.VERIFY_EMAIL(email))
        }
        catch (error) {
            console.error({
                message: 'Failed to verify account',
                error: error.message,
                stack: error.stack,
                email,
            })
            setErrorContent('Failed to verify account\n' + error.message)
            setIsErrorPopupOpen(true)
        }
    }

    return (
        <div>
            <h1>Account has been verified!</h1>

            {isErrorPopupOpen && (
                <PopupError isPopupOpen={isErrorPopupOpen} setIsPopupOpen={setIsErrorPopupOpen} content={errorContent} />
            )}
        </div>
    )
}

export default VerifyAccount