import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useVerifyAccount } from '../../common/APIs'

const VerifyAccount = () => {
    const [email, setEmail] = useState('')
    const location = useLocation()

    // APIs
    const { verifyAccount } = useVerifyAccount()

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
        await verifyAccount(email)
    }

    return (
        <div>
            <h1>Account has been verified!</h1>
        </div>
    )
}

export default VerifyAccount