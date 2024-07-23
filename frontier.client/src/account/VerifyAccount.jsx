import Axios from 'axios'
import { useState, useEffect } from 'react'
import URL from '../constants/URLs'
import PopupError from '../components/PopupError'

const VerifyAccount = ({ email }) => {
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)
    const [errorContent, setErrorContent] = useState('')

    useEffect(() => {
        verify()
    }, [])

    const verify = async () => {
        try {
            var testEmail = "test@test.com"
            await Axios.put(URL.VERIFY_EMAIL(testEmail))
        }
        catch (error) {
            console.error({
                message: 'Failed to verify account',
                error: error.message,
                stack: error.stack,
                testEmail,
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