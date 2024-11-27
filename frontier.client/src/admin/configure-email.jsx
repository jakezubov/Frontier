import { useState, useEffect } from 'react'
import { useCurrentPage } from '../contexts/current-page-context'
import { useGetAzureClient, useTestAzureClient, useUpdateAzureClient } from '../common/APIs'
import { validateEmail } from '../common/validation'
import Client from '../common/email-clients'
import EmailClientSelector from '../components/email-client-selector'

const ConfigureEmail = () => {
    const { setCurrentPage, Pages } = useCurrentPage()

    const [selectedClient, setSelectedClient] = useState(null)
    const [clientId, setClientId] = useState('')
    const [clientSecret, setClientSecret] = useState('')
    const [tenantId, setTenantId] = useState('')
    const [sendingEmail, setSendingEmail] = useState('')
    const [contactFormRecipient, setContactFormRecipient] = useState('')
    const [validationMessage, setValidationMessage] = useState(' ')
    const [successMessage, setSuccessMessage] = useState(' ')
    const [clientTestedTF, setClientTestedTF] = useState(false)

    // APIs
    const { getAzureClient } = useGetAzureClient()
    const { testAzureClient } = useTestAzureClient()
    const { updateAzureClient } = useUpdateAzureClient()

    useEffect(() => {
        setCurrentPage(Pages.CONFIGURE_EMAIL)
    }, [])

    useEffect(() => {
        loadEmailSettings()
    }, [selectedClient])

    useEffect(() => {
        setValidationMessage(' ')
        setSuccessMessage(' ')
        setClientTestedTF(false)
    }, [selectedClient, clientId, clientSecret, tenantId, sendingEmail, contactFormRecipient])

    const loadEmailSettings = async () => {
        if (selectedClient === Client.AZURE) {
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

    const handleTestClient = async () => {
        if (selectedClient === Client.AZURE) {
            if (!clientId || !clientSecret || !tenantId || !sendingEmail || !contactFormRecipient) {
                setValidationMessage('Please fill all fields.')
                return
            }
            else if (!validateEmail(sendingEmail) || !validateEmail(contactFormRecipient)) {
                setValidationMessage('Please enter valid email addresses.')
                return
            }
            setSuccessMessage('Sending test email...')
            const response = await testAzureClient(clientId, clientSecret, tenantId, sendingEmail, contactFormRecipient)

            if (response && response.status !== 200) {
                setValidationMessage('Test was not successful')
                return
            }
            setSuccessMessage('Email has been sent.')
            setValidationMessage(' ')
            setClientTestedTF(true)
        }
    }

    const handleUpdateClient = async () => {
        if (selectedClient === Client.AZURE) {
            if (!clientId || !clientSecret || !tenantId || !sendingEmail || !contactFormRecipient) {
                setValidationMessage('Please fill all fields.')
                return
            }
            else if (!validateEmail(sendingEmail) || !validateEmail(contactFormRecipient)) {
                setValidationMessage('Please enter valid email addresses.')
                return
            }
            await updateAzureClient(clientId, clientSecret, tenantId, sendingEmail, contactFormRecipient)

            setSuccessMessage('Client has been updated.')
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
                        {selectedClient === Client.AZURE && (
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
                                    <td><button className="general-button" type="button" onClick={handleTestClient}>Send Test Email</button></td>
                                    <td><button className="general-button" type="button" onClick={handleUpdateClient} disabled={!clientTestedTF}>Update Client</button></td>
                                </tr>
                            </>
                        )}
                    </tbody>
                </table>
            </form>

            {validationMessage !== ' ' ? <p className="pre-wrap warning-text tight-top">{validationMessage}</p>
                : <p className="pre-wrap success-text tight-top">{successMessage}</p>}
        </div>
    )
}

export default ConfigureEmail;