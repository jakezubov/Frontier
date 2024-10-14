import Axios from 'axios'
import { useState, useEffect } from 'react'
import URL from '../constants/URLs'
import PopupError from '../popups/PopupError'
import EmailClientSelector from '../components/EmailClientSelector'

const ConfigureEmail = () => {
    const [selectedClient, setSelectedClient] = useState(null)
    const [clientId, setClientId] = useState('')
    const [clientSecret, setClientSecret] = useState('')
    const [tenantId, setTenantId] = useState('')
    const [sendingEmail, setSendingEmail] = useState('')
    const [contactFormRecipient, setContactFormRecipient] = useState('')

    // Popups
    const [validationMessage, setValidationMessage] = useState(' ')
    const [successMessage, setSuccessMessage] = useState(' ')
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)
    const [errorContent, setErrorContent] = useState('')

    useEffect(() => {
        loadEmailSettings()
    }, [selectedClient])

    useEffect(() => {
        setValidationMessage(' ')
        setSuccessMessage(' ')
    }, [selectedClient, clientId, clientSecret, tenantId, sendingEmail, contactFormRecipient])

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(String(email).toLowerCase())
    }

    const loadEmailSettings = async () => {
        try {
            if (selectedClient == "Azure") {
                const response = await Axios.get(URL.GET_AZURE)
                if (response.data) {
                    setClientId(response.data.clientId || '')
                    setClientSecret(response.data.clientSecret || '')
                    setTenantId(response.data.tenantId || '')
                    setSendingEmail(response.data.sendingEmail || '')
                    setContactFormRecipient(response.data.contactFormRecipient || '')
                }
            }
        } catch (error) {
            console.error({
                message: 'Failed to load client',
                error: error.message,
                stack: error.stack,
                selectedClient,
            })
            setErrorContent('Failed to load client\n' + error.message)
            setIsErrorPopupOpen(true)
        }
    }

    const handleUpdateClient = async () => {
        if (selectedClient == "Azure") {
            if (!clientId || !clientSecret || !tenantId || !sendingEmail || !contactFormRecipient) {
                setValidationMessage('Please fill all fields.')
                return
            }
            else if (!validateEmail(sendingEmail) || !validateEmail(contactFormRecipient)) {
                setValidationMessage('Please enter a valid email addresses.')
                return
            }
            try {
                setSuccessMessage('Updating...')
                await Axios.post(URL.UPDATE_AZURE, {
                    'ClientId': clientId,
                    'ClientSecret': clientSecret,
                    'TenantId': tenantId,
                    'SendingEmail': sendingEmail,
                    'ContactFormRecipient': contactFormRecipient
                })

                setSuccessMessage('Sending test email...')
                await Axios.post(URL.CONTACT_FORM, {
                    'Name': "Email Tester",
                    'Email': contactFormRecipient,
                    'Message': "This is a test email"
                })
                setSuccessMessage('Email has been sent.')
                setValidationMessage(' ')
            } catch (error) {
                console.error({
                    message: 'Failed to update azure client',
                    error: error.message,
                    stack: error.stack,
                    selectedClient,
                    clientId,
                    clientSecret,
                    tenantId,
                    sendingEmail,
                    contactFormRecipient
                })
                setErrorContent('Failed to update azure client\n' + error.message)
                setIsErrorPopupOpen(true)
            }
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleUpdateClient()
        }
    }

    return (
        <div>
            <h1>Configure Email</h1>

            <form onKeyDown={handleKeyDown}>
                <table>
                    <tbody>
                        <tr>
                            <td>Client</td>
                            <td><EmailClientSelector label="Email Client" onClientChange={setSelectedClient} /></td>
                        </tr>
                        {selectedClient == "Azure" && (
                            <>
                                <tr>
                                    <td>Client Id</td>
                                    <td><input className="general-input" value={clientId} onChange={(e) => setClientId(e.target.value)} /></td>
                                </tr>
                                <tr>
                                    <td>Client Secret</td>
                                    <td><input className="general-input" type="password" value={clientSecret} onChange={(e) => setClientSecret(e.target.value)} /></td>
                                </tr>
                                <tr>
                                    <td>Tenant Id</td>
                                    <td><input className="general-input" value={tenantId} onChange={(e) => setTenantId(e.target.value)} /></td>
                                </tr>
                                <tr>
                                    <td>Sending Email</td>
                                    <td><input className="general-input" value={sendingEmail} onChange={(e) => setSendingEmail(e.target.value)} /></td>
                                </tr>
                                <tr>
                                    <td>Contact Form Recipient</td>
                                    <td><input className="general-input" value={contactFormRecipient} onChange={(e) => setContactFormRecipient(e.target.value)} /></td>
                                </tr>
                                <tr>
                                    <td colSpan="2"><button className="general-button" type="button" onClick={handleUpdateClient}>Update Client and Send Test Email</button></td>
                                </tr>
                            </>
                        )}
                    </tbody>
                </table>
            </form>

            {validationMessage !== ' ' ? <p className="pre-wrap warning-text">{validationMessage}</p>
                : <p className="pre-wrap success-text">{successMessage}</p>}

            {isErrorPopupOpen && (
                <PopupError isPopupOpen={isErrorPopupOpen} setIsPopupOpen={setIsErrorPopupOpen} content={errorContent} />
            )}
        </div>
    )
}

export default ConfigureEmail;