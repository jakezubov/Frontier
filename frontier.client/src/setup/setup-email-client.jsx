import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTestAzureClient, useUpdateAzureClient, useGetInitialisedStatus, useUpdateInitialisedStatus, useUpdateCurrentClientType } from '../common/APIs'
import { useCurrentPage } from '../contexts/current-page-context'
import { validateEmail } from '../common/validation'
import Path from '../common/paths'
import EmailClientSelector from '../components/email-client-selector'

const ConfigureEmail = ({ onConfigureEmailComplete }) => {
    const navigate = useNavigate()
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
    const [isSendingEmail, setIsSendingEmail] = useState(false)

    // APIs
    const { testAzureClient } = useTestAzureClient()
    const { updateAzureClient } = useUpdateAzureClient()
    const { getInitialisedStatus } = useGetInitialisedStatus()
    const { updateInitialisedStatus } = useUpdateInitialisedStatus()
    const { updateCurrentClientType } = useUpdateCurrentClientType()

    useEffect(() => {
        setCurrentPage(Pages.SETUP_EMAIL_CLIENT)
        const checkInitialization = async () => {
            const isInitialized = await getInitialisedStatus()
            if (isInitialized) {
                navigate(Path.HOME)
            }
        }
        checkInitialization()
    }, [])

    useEffect(() => {
        setValidationMessage(' ')
        setSuccessMessage(' ')
        setClientTestedTF(false)
    }, [selectedClient, clientId, clientSecret, tenantId, sendingEmail, contactFormRecipient])

    const handleTestClient = async () => {
        setSuccessMessage(' ')
        setIsSendingEmail(true)

        if (selectedClient == "Azure") {
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
        if (selectedClient == "Azure") {
            if (!clientId || !clientSecret || !tenantId || !sendingEmail || !contactFormRecipient) {
                setValidationMessage('Please fill all fields.')
                return
            }
            else if (!validateEmail(sendingEmail) || !validateEmail(contactFormRecipient)) {
                setValidationMessage('Please enter valid email addresses.')
                return
            }
            await updateAzureClient(clientId, clientSecret, tenantId, sendingEmail, contactFormRecipient)
            await updateCurrentClientType(selectedClient)
            await updateInitialisedStatus(true)

            onConfigureEmailComplete()
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
                                    {!clientTestedTF
                                        ? <td colSpan="2"><button className="general-button" type="button" onClick={handleTestClient}>Send Test Email</button></td>
                                        : <td colSpan="2"><button className="general-button" type="button" onClick={handleUpdateClient}>Save Client</button></td>
                                    }
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
                        <tr>
                            <td colSpan="2">
                                <p className="tight-top configure-email-text">{"A test email must be sent before changes can be saved, ensure you actually receive the email since the test only verifies that it was able to send the email."}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    )
}

ConfigureEmail.propTypes = {
    onConfigureEmailComplete: PropTypes.func.isRequired,
}

export default ConfigureEmail;