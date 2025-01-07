import Axios from 'axios'
import { useError } from '../contexts/error-context'
import { useUserSession } from '../contexts/user-context'

// const urlPrefix = 'http://localhost:5221/api'
const urlPrefix 'https://jewellery.zubov.com.au/api'

//#region User CRUD

export const useGetAllUsers = () => {
    const { displayError, logError } = useError()
    const { userId } = useUserSession()

    const getAllUsers = async () => {
        try {
            const response = await Axios.get(`${urlPrefix}/users`)
            return response.data
        } catch (error) {
            const title = 'Failed to load users'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { getAllUsers }
}

export const useGetUser = () => {
    const { displayError, logError } = useError()

    const getUser = async (userId) => {
        try {
            const response = await Axios.get(`${urlPrefix}/users/${userId}`);
            return response.data
        }
        catch (error) {
            const title = 'Failed to get user'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { getUser }
}

export const useCreateUser = () => {
    const { displayError, logError } = useError()
    const { apiToken, userId } = useUserSession()

    const createUser = async (firstName, lastName, email, password, admin=false) => {
        try {
            const response = await Axios.post(`${urlPrefix}/users/create`, {
                'FirstName': firstName,
                'LastName': lastName,
                'Email': email,
                'PasswordHash': password,
                'AdminTF': admin,
                'ApiToken': apiToken,
            })
            if (response && (response.status === 201 || response.status === 204)) {
                return response
            }
            return null
        }
        catch (error) {
            const title = 'Failed to create account'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                firstName,
                lastName,
                email,
                apiToken,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { createUser }
}

export const useUpdateUser = () => {
    const { displayError, logError } = useError()

    const updateUser = async (userId, firstName, lastName, email, historyAmount) => {
        try {
            await Axios.put(`${urlPrefix}/users/${userId}/update`, {
                'FirstName': firstName,
                'LastName': lastName,
                'Email': email,
                'PasswordHash': '',
                'HistoryAmount': Math.round(historyAmount),
            })
        }
        catch (error) {
            const title = 'Failed to update account'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
                firstName,
                lastName,
                email,
                historyAmount,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { updateUser }
}

export const useUpdatePassword = () => {
    const { displayError, logError } = useError()

    const updatePassword = async (userId, email, newPassword) => {
        try {
            await Axios.put(`${urlPrefix}/users/${userId}/update/password`, {
                'Email': email,
                'Password': newPassword,
            })
        }
        catch (error) {
            const title = 'Failed to update password'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
                email,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { updatePassword }
}

export const useDeleteUser = () => {
    const { displayError, logError } = useError()

    const deleteUser = async (userId) => {
        try {
            await Axios.delete(`${urlPrefix}/users/${userId}/delete`)
        }
        catch (error) {
            const title = 'Failed to delete account'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { deleteUser }
}

//#endregion

//#region User Utility

export const useSwitchAdminStatus = () => {
    const { displayError, logError } = useError()
    const { apiToken } = useUserSession()

    const switchAdminStatus = async (changedUserId) => {
        try {
            await Axios.put(`${urlPrefix}/users/${changedUserId}/admin/${apiToken}`)
        }
        catch (error) {
            const title = 'Failed to switch admin status'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { switchAdminStatus }
}

export const useLogLogin = () => {
    const { displayError, logError } = useError()

    const logLogin = async (userId) => {
        try {
            await Axios.put(`${urlPrefix}/users/${userId}/login`)
        }
        catch (error) {
            const title = 'Failed to log login'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { logLogin }
}

export const useLogLogout = () => {
    const { displayError, logError } = useError()

    const logLogout = async (userId) => {
        try {
            await Axios.put(`${urlPrefix}/users/${userId}/logout`)
        }
        catch (error) {
            const title = 'Failed to log logout'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { logLogout }
}

export const useValidateUser = () => {
    const { displayError, logError } = useError()

    const validateUser = async (email, password) => {
        try {
            const response = await Axios.post(`${urlPrefix}/users/validate`, { email, password })
            return response.data
        }
        catch (error) {
            const title = 'Failed to validate user'
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

    return { validateUser }
}

export const useCheckEmailExists = () => {
    const { displayError, logError } = useError()

    const checkEmailExists = async (email) => {
        try {
            const response = await Axios.post(`${urlPrefix}/users/check-email/${email}`)
            return response.data
        }
        catch (error) {
            const title = 'Failed to check if email exists'
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

    return { checkEmailExists }
}

//#endregion

//#region History

export const useGetHistory = () => {
    const { displayError, logError } = useError()

    const getHistory = async (userId, historyType) => {
        try {
            if (userId) {
                const response = await Axios.get(`${urlPrefix}/users/${userId}/history`)
                return response.data.filter(h => h.historyType === historyType)
            }
            return null
        }
        catch (error) {
            const title = 'Failed to get history'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { getHistory }
}

export const useSaveHistory = () => {
    const { displayError, logError } = useError()

    const saveHistory = async (userId, historyType, content) => {
        try {
            await Axios.put(`${urlPrefix}/users/${userId}/history/create`, {
                'historyType': historyType,
                'content': content,
            })
        }
        catch (error) {
            const title = 'Failed to save history'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
                historyType,
                content,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { saveHistory }
}

export const useDeleteUserHistory = () => {
    const { displayError, logError } = useError()

    const deleteUserHistory = async (userId) => {
        try {
            await Axios.delete(`${urlPrefix}/users/${userId}/history/delete`)
        }
        catch (error) {
            const title = 'Failed to delete user history'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { deleteUserHistory }
}

//#endregion

//#region Metals

export const useGetMetals = () => {
    const { displayError, logError } = useError()

    const getMetals = async (userId) => {
        try {
            const response = await Axios.get(`${urlPrefix}/users/${userId}/metals`)
            return response.data.sort((a, b) => a.listIndex - b.listIndex)
        }
        catch (error) {
            const title = 'Failed to get metals'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { getMetals }
}

export const useUpdateMetals = () => {
    const { displayError, logError } = useError()

    const updateMetals = async (userId, metalList) => {
        try {
            await Axios.put(`${urlPrefix}/users/${userId}/metals/update`, metalList)
        }
        catch (error) {
            const title = 'Failed to update metals'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
                metalList,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { updateMetals }
}

export const useResetMetals = () => {
    const { displayError, logError } = useError()

    const resetMetals = async (userId) => {
        try {
            await Axios.put(`${urlPrefix}/users/${userId}/metals/reset`)
        }
        catch (error) {
            const title = 'Failed to update metals'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { resetMetals }
}

export const useGetDefaultMetals = () => {
    const { displayError, logError } = useError()
    const { userId } = useUserSession()

    const getDefaultMetals = async () => {
        try {
            const response = await Axios.get(`${urlPrefix}/config/metals`)
            return response.data.sort((a, b) => a.listIndex - b.listIndex)
        }
        catch (error) {
            const title = 'Failed to get metals'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { getDefaultMetals }
}

export const useUpdateDefaultMetals = () => {
    const { displayError, logError } = useError()
    const { apiToken, userId } = useUserSession()

    const updateDefaultMetals = async (metalList) => {
        try {
            await Axios.put(`${urlPrefix}/config/metals/update/${apiToken}`, metalList)
        }
        catch (error) {
            const title = 'Failed to update default metals'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                metalList,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { updateDefaultMetals }
}

export const useResetDefaultMetals = () => {
    const { displayError, logError } = useError()
    const { userId } = useUserSession()

    const resetDefaultMetals = async () => {
        try {
            await Axios.put(`${urlPrefix}/config/metals/reset`)
        }
        catch (error) {
            const title = 'Failed to reset default metals'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { resetDefaultMetals }
}

//#endregion

//#region Ring Sizes

export const useGetRingSizes = () => {
    const { displayError, logError } = useError()

    const getRingSizes = async (userId) => {
        try {
            const response = await Axios.get(`${urlPrefix}/users/${userId}/ring-sizes`)
            return response.data.sort((a, b) => a.listIndex - b.listIndex)
        }
        catch (error) {
            const title = 'Failed to get ring sizes'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { getRingSizes }
}

export const useUpdateRingSizes = () => {
    const { displayError, logError } = useError()

    const updateRingSizes = async (userId, ringSizeList) => {
        try {
            await Axios.put(`${urlPrefix}/users/${userId}/ring-sizes/update`, ringSizeList)
        }
        catch (error) {
            const title = 'Failed to update ring sizes'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
                ringSizeList,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { updateRingSizes }
}

export const useResetRingSizes = () => {
    const { displayError, logError } = useError()

    const resetRingSizes = async (userId) => {
        try {
            await Axios.put(`${urlPrefix}/users/${userId}/ring-sizes/reset`)
        }
        catch (error) {
            const title = 'Failed to update ring sizes'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { resetRingSizes }
}

export const useGetDefaultRingSizes = () => {
    const { displayError, logError } = useError()
    const { userId } = useUserSession()

    const getDefaultRingSizes = async () => {
        try {
            const response = await Axios.get(`${urlPrefix}/config/ring-sizes`)
            return response.data.sort((a, b) => a.listIndex - b.listIndex)
        }
        catch (error) {
            const title = 'Failed to get default ring sizes'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { getDefaultRingSizes }
}

export const useUpdateDefaultRingSizes = () => {
    const { displayError, logError } = useError()
    const { apiToken, userId } = useUserSession()

    const updateDefaultRingSizes = async (ringSizeList) => {
        try {
            await Axios.put(`${urlPrefix}/config/ring-sizes/update/${apiToken}`, ringSizeList)
        }
        catch (error) {
            const title = 'Failed to update default ring sizes'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                ringSizeList,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { updateDefaultRingSizes }
}

export const useResetDefaultRingSizes = () => {
    const { displayError, logError } = useError()
    const { userId } = useUserSession()

    const resetDefaultRingSizes = async () => {
        try {
            await Axios.put(`${urlPrefix}/config/ring-sizes/reset`)
        }
        catch (error) {
            const title = 'Failed to reset default ring sizes'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { resetDefaultRingSizes }
}

//#endregion 

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
    const { apiToken, userId } = useUserSession()

    const updateCurrentClientType = async (newClientType) => {
        try {
            await Axios.put(`${urlPrefix}/email/client-type/update/${newClientType}/${apiToken}`)
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
            const response = await Axios.get(`${urlPrefix}/email/get/Azure/client`)
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
    const { apiToken, userId } = useUserSession()

    const updateAzureClient = async (clientId, clientSecret, tenantId, sendingEmail, contactFormRecipient) => {
        try {
            await Axios.post(`${urlPrefix}/email/update/azure/client/${apiToken}`, {
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
    const { apiToken, userId } = useUserSession()

    const testAzureClient = async (clientId, clientSecret, tenantId, sendingEmail, contactFormRecipient) => {
        try {
            const response = await Axios.put(`${urlPrefix}/email/test/azure/${apiToken}`, {
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

//#region Config

export const useGetInitialisedStatus = () => {
    const { displayError, logError } = useError()

    const getInitialisedStatus = async () => {
        try {
            const response = await Axios.get(`${urlPrefix}/config/init`)
            return response.data
        }
        catch (error) {
            const title = 'Failed to get the initialised status'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
            })
            logError("N/A", title, error.message, error.stack)
        }
    }

    return { getInitialisedStatus }
}

export const useUpdateInitialisedStatus = () => {
    const { displayError, logError } = useError()
    const { apiToken, userId } = useUserSession()

    const updateInitialisedStatus = async (newStatus) => {
        try {
            await Axios.put(`${urlPrefix}/config/init/update/${newStatus}/${apiToken}`)
        }
        catch (error) {
            const title = 'Failed to update the initialised status'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                newStatus,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { updateInitialisedStatus }
}

export const useGenerateObjectId = () => {
    const { displayError, logError } = useError()
    const { userId } = useUserSession()

    const generateObjectId = async () => {
        try {
            const response = await Axios.get(`${urlPrefix}/config/generate-id`)
            return response.data
        }
        catch (error) {
            const title = 'Failed to generate object Id'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { generateObjectId }
}

//#endregion

//#region Error Ledger

export const useGetErrorLedger = () => {
    const { displayError, logError } = useError()
    const { userId } = useUserSession()

    const getErrorLedger = async () => {
        try {
            const response = await Axios.get(`${urlPrefix}/errors`)
            return response.data
        }
        catch (error) {
            const title = 'Failed to get the error ledger'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { getErrorLedger }
}

export const useCreateErrorLog = () => {
    const createErrorLog = async (userDetails, title, message, stack) => {
        try {
            await Axios.post(`${urlPrefix}/errors/create`, {
                'UserDetails': userDetails,
                'Title': title,
                'Message': message,
                'Stack': stack,
            })
        }
        catch (error) {
            const title = 'Failed to create an error log'
            console.error({
                title,
                error: error.message,
                stack: error.stack,
            })
        }
    }

    return { createErrorLog }
}

export const useDeleteErrorLog = () => {
    const { displayError, logError } = useError()
    const { userId } = useUserSession()

    const deleteErrorLog = async (errorId) => {
        try {
            await Axios.delete(`${urlPrefix}/errors/${errorId}/delete`)
        }
        catch (error) {
            const title = 'Failed to delete an error log'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                errorId: errorId,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { createErrorLog }
}

//#endregion