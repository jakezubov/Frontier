import { useState, useEffect } from 'react'
import { useGetAzureClient, useUpdateAzureClient, useSendContactForm } from '../common/APIs'
import EmailClientSelector from '../components/EmailClientSelector'

const ConfigureEmail = () => {
    const [selectedClient, setSelectedClient] = useState(null)
    const [clientId, setClientId] = useState('')
    const [clientSecret, setClientSecret] = useState('')
    const [tenantId, setTenantId] = useState('')
    const [sendingEmail, setSendingEmail] = useState('')
    const [contactFormRecipient, setContactFormRecipient] = useState('')
    const [validationMessage, setValidationMessage] = useState(' ')
    const [successMessage, setSuccessMessage] = useState(' ')

    // APIs
    const { getAzureClient } = useGetAzureClient()
    const { updateAzureClient } = useUpdateAzureClient()
    const { sendContactForm } = useSendContactForm()

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
        if (selectedClient == "Azure") {
            const client = await getAzureClient()
            if (client) {
                setClientId(client.clientId || '')
                setClientSecret(client.clientSecret || '')
                setTenantId(client.tenantId || '')
                setSendingEmail(client.sendingEmail || '')
                setContactFormRecipient(client.contactFormRecipient || '')
            }
        }
    }

    const handleUpdateClient = async () => {
        if (selectedClient == "Azure") {
            if (!clientId || !clientSecret || !tenantId || !sendingEmail || !contactFormRecipient) {
                setValidationMessage('Please fill all fields.')
                return
            }
            else if (!validateEmail(sendingEmail) || !validateEmail(contactFormRecipient)) {
                setValidationMessage('Please enter valid email addresses.')
                return
            }
            setSuccessMessage('Updating...')
            await updateAzureClient(clientId, clientSecret, tenantId, sendingEmail, contactFormRecipient)

            setSuccessMessage('Sending test email...')
            await sendContactForm('Email Tester', contactFormRecipient, 'This is a test email')

            setSuccessMessage('Email has been sent.')
            setValidationMessage(' ')
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
        </div>
    )
}

export default ConfigureEmail;