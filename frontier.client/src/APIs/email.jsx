import Axios from 'axios'
import { useError } from '../contexts/error-context'
import { useUserSession } from '../contexts/user-context'

const urlPrefix = import.meta.env.VITE_URL_PREFIX

//#region Sending Emails

export const useSendContactForm = () => {
    const { displayError, logError } = useError()

    const sendContactForm = async (name, email, message) => {
        try {
            await Axios.post(`${urlPrefix}/email/send/contact-form`, {
                'Name': name,
                'Email': email,
                'Message': message,
            })
        }
        catch (error) {
            const title = 'Failed to send contact form email'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                name,
                email,
                message,
            })
            logError(email, title, error.message, error.stack)
        }
    }

    return { sendContactForm }
}

export const useSendPasswordReset = () => {
    const { displayError, logError } = useError()

    const sendPasswordReset = async (email) => {
        try {
            await Axios.post(`${urlPrefix}/email/send/password-reset/${email}`)
        }
        catch (error) {
            const title = 'Failed to send password reset email'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                email,
            })
            logError(email, title, error.message, error.stack)
        }
    }

    return { sendPasswordReset }
}

//#endregion

//#region Email Clients

export const useGetCurrentClientType = () => {
    const { displayError, logError } = useError()
    const { userId } = useUserSession()

    const getCurrentClientType = async () => {
        try {
            const response = await Axios.get(`${urlPrefix}/email/client-type`)
            return response.data
        }
        catch (error) {
            const title = 'Failed to get the current client type'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { getCurrentClientType }
}

export const useUpdateCurrentClientType = () => {
    const { displayError, logError } = useError()
    const { userId } = useUserSession()

    const updateCurrentClientType = async (newClientType) => {
        try {
            await Axios.post(`${urlPrefix}/email/client-type/update/${newClientType}`)
        }
        catch (error) {
            const title = 'Failed to update the current client type'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                newClientType,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { updateCurrentClientType }
}


export const useGetAzureClient = () => {
    const { displayError, logError } = useError()
    const { userId } = useUserSession()

    const getAzureClient = async () => {
        try {
            const response = await Axios.get(`${urlPrefix}/email/Azure/client`)
            return response.data
        }
        catch (error) {
            const title = 'Failed to get Azure client'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { getAzureClient }
}

export const useUpdateAzureClient = () => {
    const { displayError, logError } = useError()
    const { userId } = useUserSession()

    const updateAzureClient = async (clientId, clientSecret, tenantId, sendingEmail, contactFormRecipient) => {
        try {
            await Axios.post(`${urlPrefix}/email/azure/client/update`, {
                'ClientId': clientId,
                'ClientSecret': clientSecret,
                'TenantId': tenantId,
                'SendingEmail': sendingEmail,
                'ContactFormRecipient': contactFormRecipient
            })
        }
        catch (error) {
            const title = 'Failed to update Azure client'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                clientId,
                clientSecret,
                tenantId,
                sendingEmail,
                contactFormRecipient,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { updateAzureClient }
}

export const useTestAzureClient = () => {
    const { displayError, logError } = useError()
    const { userId } = useUserSession()

    const testAzureClient = async (clientId, clientSecret, tenantId, sendingEmail, contactFormRecipient) => {
        try {
            const response = await Axios.post(`${urlPrefix}/email/azure/test`, {
                'ClientId': clientId,
                'ClientSecret': clientSecret,
                'TenantId': tenantId,
                'SendingEmail': sendingEmail,
                'ContactFormRecipient': contactFormRecipient
            })
            if (response && response.status !== 200) {
                return null
            }
            return response
        }
        catch (error) {
            const title = 'Failed to test Azure client'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                clientId,
                clientSecret,
                tenantId,
                sendingEmail,
                contactFormRecipient,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { testAzureClient }
}

//#endregion

//#region Verification

export const useSendRegistration = () => {
    const { displayError, logError } = useError()

    const sendRegistration = async (name, email) => {
        try {
            await Axios.post(`${urlPrefix}/email/send/registration/${name}/${email}`)
        }
        catch (error) {
            const title = 'Failed to send registration email'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                name,
                email,
            })
            logError(email, title, error.message, error.stack)
        }
    }

    return { sendRegistration }
}

export const useSendVerification = () => {
    const { displayError, logError } = useError()

    const sendVerification = async (name, email) => {
        try {
            await Axios.post(`${urlPrefix}/email/send/verification/${name}/${email}`)
        }
        catch (error) {
            const title = 'Failed to send verification email'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                name,
                email,
            })
            logError(email, title, error.message, error.stack)
        }
    }

    return { sendVerification }
}

export const useCheckVerificationCode = () => {
    const { displayError, logError } = useError()

    const checkVerificationCode = async (email, code) => {
        try {
            const response = await Axios.delete(`${urlPrefix}/email/verification/${email}/${code}`)
            return response
        }
        catch (error) {
            const title = 'Failed to check verification code'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                email,
                code,
            })
            logError(email, title, error.message, error.stack)
        }
    }

    return { checkVerificationCode }
}

//#endregion