import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentPage } from '../contexts/current-page-context'
import { useUserSession } from '../contexts/user-context'
import { useGetAzureClient, useTestAzureClient, useUpdateAzureClient, useUpdateCurrentClientType } from '../common/APIs'
import { validateEmail } from '../common/validation'
import Client from '../common/email-clients'
import EmailClientSelector from '../components/email-client-selector'
import Path from '../common/paths'

const ConfigureEmail = () => {
    const { setCurrentPage, Pages, setIsEmailSetup } = useCurrentPage()
    const { adminStatus } = useUserSession()
    const navigate = useNavigate()

    const [selectedClient, setSelectedClient] = useState(null)
    const [clientId, setClientId] = useState('')
    const [clientSecret, setClientSecret] = useState('')
    const [tenantId, setTenantId] = useState('')
    const [sendingEmail, setSendingEmail] = useState('')
    const [contactFormRecipient, setContactFormRecipient] = useState('')
    const [validationMessage, setValidationMessage] = useState(' ')
    const [successMessage, setSuccessMessage] = useState(' ')
    const [clientTestedTF, setClientTestedTF] = useState(false)
    const [isSendingEmail, setIsSendingEmail] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // APIs
    const { getAzureClient } = useGetAzureClient()
    const { testAzureClient } = useTestAzureClient()
    const { updateAzureClient } = useUpdateAzureClient()
    const { updateCurrentClientType } = useUpdateCurrentClientType()

    useEffect(() => {
        setCurrentPage(Pages.CONFIGURE_EMAIL)
    }, [])

    useEffect(() => {
        if (!adminStatus) {
            navigate(Path.CONFIRMATION_SCREEN, {
                state: { message: 'You need to be an admin to access that page!' }
            })
        }
    }, [adminStatus])

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
        setIsLoading(false)
    }

    const handleTestClient = async () => {
        setSuccessMessage(' ')
        setIsSendingEmail(true)

        if (selectedClient === Client.AZURE) {
            if (!clientId || !clientSecret || !tenantId || !sendingEmail || !contactFormRecipient) {
                setValidationMessage('Please fill all fields.')
                setIsSendingEmail(false)
                return
            }
            else if (!validateEmail(sendingEmail) || !validateEmail(contactFormRecipient)) {
                setValidationMessage('Please enter valid email addresses.')
                setIsSendingEmail(false)
                return
            }
            const response = await testAzureClient(clientId, clientSecret, tenantId, sendingEmail, contactFormRecipient)

            if (!response) {
                setValidationMessage('Test was not successful')
                setIsSendingEmail(false)
                return
            }
            setSuccessMessage('Email has been sent.')
            setValidationMessage(' ')
            setClientTestedTF(true)
            setIsSendingEmail(false)
        }
    }

    const handleUpdateClient = async () => {
        if (selectedClient === Client.NONE) {
            await updateCurrentClientType(Client.NONE.key)
            setSuccessMessage('Client has been updated.')
            setValidationMessage(' ')
            setIsEmailSetup('false')
        }
        else if (selectedClient === Client.AZURE) {
            if (!clientId || !clientSecret || !tenantId || !sendingEmail || !contactFormRecipient) {
                setValidationMessage('Please fill all fields.')
                return
            }
            else if (!validateEmail(sendingEmail) || !validateEmail(contactFormRecipient)) {
                setValidationMessage('Please enter valid email addresses.')
                return
            }
            await updateAzureClient(clientId, clientSecret, tenantId, sendingEmail, contactFormRecipient)
            await updateCurrentClientType(Client.AZURE.key)

            setSuccessMessage('Client has been updated.')
            setValidationMessage(' ')
            setIsEmailSetup('true')
        }
    }

    return (
        <div>
            {isLoading ?
                <div className="loader"></div>
                :
                <form>
                    <table>
                        <tbody>
                            <tr>
                                <td>Client</td>
                                <td><EmailClientSelector label="Email Client" onClientChange={setSelectedClient} /></td>
                            </tr>
                            {selectedClient === Client.NONE && (
                                <tr>
                                    <td colSpan="2"><button className="general-button" type="button" onClick={handleUpdateClient}>Update Client</button></td>
                                </tr>
                            )}
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
                            <tr>
                                <td className="message-container" colSpan="2">
                                    {validationMessage !== ' ' ?
                                        <p className="pre-wrap warning-text">{validationMessage}</p>
                                        : successMessage !== ' ' ?
                                            <p className="pre-wrap success-text">{successMessage}</p>
                                            : isSendingEmail && <div className="email-loader-container tight-top"><div className="email-loader"></div></div>
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            }
        </div>
    )
}

export default ConfigureEmail;