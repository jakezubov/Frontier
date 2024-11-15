import Axios from 'axios'
import { useError } from '../contexts/ErrorPopupContext'

const urlPrefix = 'http://localhost:5221/api'
// const urlPrefix = 'https://jewellery.zubov.com.au/api'

//#region User CRUD

export const useGetAllUsers = () => {
    const { handleError } = useError()

    const getAllUsers = async () => {
        try {
            const response = await Axios.get(`${urlPrefix}/users`)
            return response.data
        } catch (error) {
            const title = 'Failed to load users'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
            })
        }
    }

    return { getAllUsers }
}

export const useGetUser = () => {
    const { handleError } = useError()

    const getUser = async (userId) => {
        try {
            const response = await Axios.get(`${urlPrefix}/users/${userId}`);
            return response.data
        }
        catch (error) {
            const title = 'Failed to get user'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
            })
        }
    }

    return { getUser }
}

export const useCreateUser = () => {
    const { handleError } = useError()

    const createUser = async (firstName, lastName, email, password, admin=false) => {
        try {
            await Axios.post(`${urlPrefix}/users/create`, {
                'FirstName': firstName,
                'LastName': lastName,
                'Email': email,
                'PasswordHash': password,
                'AdminTF': admin,
            })
        }
        catch (error) {
            const title = 'Failed to create account'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                firstName,
                lastName,
                email,
            })
        }
    }

    return { createUser }
}

export const useUpdateUser = () => {
    const { handleError } = useError()

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
            handleError(`${title}\n${error.message}`)
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
        }
    }

    return { updateUser }
}

export const useUpdatePassword = () => {
    const { handleError } = useError()

    const updatePassword = async (userId, email, newPassword) => {
        try {
            await Axios.put(`${urlPrefix}/users/${userId}/update/password`, {
                'Email': email,
                'Password': newPassword,
            })
        }
        catch (error) {
            const title = 'Failed to update password'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
                email,
            })
        }
    }

    return { updatePassword }
}

export const useDeleteUser = () => {
    const { handleError } = useError()

    const deleteUser = async (userId) => {
        try {
            await Axios.delete(`${urlPrefix}/users/${userId}/delete`)
        }
        catch (error) {
            const title = 'Failed to delete account'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
            })
        }
    }

    return { deleteUser }
}

//#endregion

//#region User Utility

export const useSwitchAdminStatus = () => {
    const { handleError } = useError()

    const switchAdminStatus = async (userId) => {
        try {
            await Axios.put(`${urlPrefix}/users/${userId}/admin`)
        }
        catch (error) {
            const title = 'Failed to switch admin status'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
            })
        }
    }

    return { switchAdminStatus }
}

export const useLogLogin = () => {
    const { handleError } = useError()

    const logLogin = async (userId) => {
        try {
            await Axios.put(`${urlPrefix}/users/${userId}/login`)
        }
        catch (error) {
            const title = 'Failed to log login'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
            })
        }
    }

    return { logLogin }
}

export const useLogLogout = () => {
    const { handleError } = useError()

    const logLogout = async (userId) => {
        try {
            await Axios.put(`${urlPrefix}/users/${userId}/logout`)
        }
        catch (error) {
            const title = 'Failed to log logout'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
            })
        }
    }

    return { logLogout }
}

export const useValidateUser = () => {
    const { handleError } = useError()

    const validateUser = async (email, password) => {
        try {
            const response = await Axios.post(`${urlPrefix}/users/validate`, { email, password })
            return response.data
        }
        catch (error) {
            const title = 'Failed to validate user'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                email,
            })
        }
    }

    return { validateUser }
}

export const useCheckEmailExists = () => {
    const { handleError } = useError()

    const checkEmailExists = async (email) => {
        try {
            const response = await Axios.post(`${urlPrefix}/users/check-email/${email}`)
            return response.data
        }
        catch (error) {
            const title = 'Failed to check if email exists'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                email,
            })
        }
    }

    return { checkEmailExists }
}

export const useVerifyAccount = () => {
    const { handleError } = useError()

    const verifyAccount = async (email) => {
        try {
            await Axios.put(`${urlPrefix}/users/verify-email/${email}`)
        }
        catch (error) {
            const title = 'Failed to verify account'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                email,
            })
        }
    }

    return { verifyAccount }
}

export const useUnverifyAccount = () => {
    const { handleError } = useError()

    const unverifyAccount = async (email) => {
        try {
            await Axios.put(`${urlPrefix}/users/unverify-email/${email}`)
        }
        catch (error) {
            const title = 'Failed to verify account'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                email,
            })
        }
    }

    return { unverifyAccount }
}

//#endregion

//#region History

export const useGetHistory = () => {
    const { handleError } = useError()

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
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
            })
        }
    }

    return { getHistory }
}

export const useSaveHistory = () => {
    const { handleError } = useError()

    const saveHistory = async (userId, historyType, content) => {
        try {
            await Axios.put(`${urlPrefix}/users/${userId}/history/create`, {
                'historyType': historyType,
                'content': content,
            })
        }
        catch (error) {
            const title = 'Failed to save history'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
                historyType,
                content,
            })
        }
    }

    return { saveHistory }
}

export const useDeleteUserHistory = () => {
    const { handleError } = useError()

    const deleteUserHistory = async (userId) => {
        try {
            await Axios.delete(`${urlPrefix}/users/${userId}/history/delete`)
        }
        catch (error) {
            const title = 'Failed to delete user history'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
            })
        }
    }

    return { deleteUserHistory }
}

//#endregion

//#region Metals

export const useGetMetals = () => {
    const { handleError } = useError()

    const getMetals = async (userId) => {
        try {
            const response = await Axios.get(`${urlPrefix}/users/${userId}/metals`)
            return response.data.sort((a, b) => a.listIndex - b.listIndex)
        }
        catch (error) {
            const title = 'Failed to get metals'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
            })
        }
    }

    return { getMetals }
}

export const useUpdateMetals = () => {
    const { handleError } = useError()

    const updateMetals = async (userId, metalList) => {
        try {
            await Axios.put(`${urlPrefix}/users/${userId}/metals/update`, metalList)
        }
        catch (error) {
            const title = 'Failed to update metals'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
                metalList,
            })
        }
    }

    return { updateMetals }
}

export const useResetMetals = () => {
    const { handleError } = useError()

    const resetMetals = async (userId) => {
        try {
            await Axios.put(`${urlPrefix}/users/${userId}/metals/reset`)
        }
        catch (error) {
            const title = 'Failed to update metals'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
            })
        }
    }

    return { resetMetals }
}

export const useGetDefaultMetals = () => {
    const { handleError } = useError()

    const getDefaultMetals = async () => {
        try {
            const response = await Axios.get(`${urlPrefix}/config/metals`)
            return response.data.sort((a, b) => a.listIndex - b.listIndex)
        }
        catch (error) {
            const title = 'Failed to get metals'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
            })
        }
    }

    return { getDefaultMetals }
}

export const useUpdateDefaultMetals = () => {
    const { handleError } = useError()

    const updateDefaultMetals = async (metalList) => {
        try {
            await Axios.put(`${urlPrefix}/config/metals/update`, metalList)
        }
        catch (error) {
            const title = 'Failed to update default metals'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                metalList,
            })
        }
    }

    return { updateDefaultMetals }
}

export const useResetDefaultMetals = () => {
    const { handleError } = useError()

    const resetDefaultMetals = async () => {
        try {
            await Axios.put(`${urlPrefix}/config/metals/reset`)
        }
        catch (error) {
            const title = 'Failed to reset default metals'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
            })
        }
    }

    return { resetDefaultMetals }
}

//#endregion

//#region Ring Sizes

export const useGetRingSizes = () => {
    const { handleError } = useError()

    const getRingSizes = async (userId) => {
        try {
            const response = await Axios.get(`${urlPrefix}/users/${userId}/ring-sizes`)
            return response.data.sort((a, b) => a.listIndex - b.listIndex)
        }
        catch (error) {
            const title = 'Failed to get ring sizes'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
            })
        }
    }

    return { getRingSizes }
}

export const useUpdateRingSizes = () => {
    const { handleError } = useError()

    const updateRingSizes = async (userId, ringSizeList) => {
        try {
            await Axios.put(`${urlPrefix}/users/${userId}/ring-sizes/update`, ringSizeList)
        }
        catch (error) {
            const title = 'Failed to update ring sizes'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
                ringSizeList,
            })
        }
    }

    return { updateRingSizes }
}

export const useResetRingSizes = () => {
    const { handleError } = useError()

    const resetRingSizes = async (userId) => {
        try {
            await Axios.put(`${urlPrefix}/users/${userId}/ring-sizes/reset`)
        }
        catch (error) {
            const title = 'Failed to update ring sizes'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                userId,
            })
        }
    }

    return { resetRingSizes }
}

export const useGetDefaultRingSizes = () => {
    const { handleError } = useError()

    const getDefaultRingSizes = async () => {
        try {
            const response = await Axios.get(`${urlPrefix}/config/ring-sizes`)
            return response.data.sort((a, b) => a.listIndex - b.listIndex)
        }
        catch (error) {
            const title = 'Failed to get default ring sizes'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
            })
        }
    }

    return { getDefaultRingSizes }
}

export const useUpdateDefaultRingSizes = () => {
    const { handleError } = useError()

    const updateDefaultRingSizes = async (ringSizeList) => {
        try {
            await Axios.put(`${urlPrefix}/config/ring-sizes/update`, ringSizeList)
        }
        catch (error) {
            const title = 'Failed to update default ring sizes'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                ringSizeList,
            })
        }
    }

    return { updateDefaultRingSizes }
}

export const useResetDefaultRingSizes = () => {
    const { handleError } = useError()

    const resetDefaultRingSizes = async () => {
        try {
            await Axios.put(`${urlPrefix}/config/ring-sizes/reset`)
        }
        catch (error) {
            const title = 'Failed to reset default ring sizes'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
            })
        }
    }

    return { resetDefaultRingSizes }
}

//#endregion 

//#region Sending Emails

export const useSendContactForm = () => {
    const { handleError } = useError()

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
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                name,
                email,
                message,
            })
        }
    }

    return { sendContactForm }
}

export const useSendPasswordReset = () => {
    const { handleError } = useError()

    const sendPasswordReset = async (email) => {
        try {
            await Axios.post(`${urlPrefix}/email/send/password-reset/${email}`)
        }
        catch (error) {
            const title = 'Failed to send password reset email'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                email,
            })
        }
    }

    return { sendPasswordReset }
}

export const useSendRegistration = () => {
    const { handleError } = useError()

    const sendRegistration = async (name, email) => {
        try {
            await Axios.post(`${urlPrefix}/email/send/registration/${name}/${email}`)
        }
        catch (error) {
            const title = 'Failed to send registration email'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                name,
                email,
            })
        }
    }

    return { sendRegistration }
}

export const useSendVerification = () => {
    const { handleError } = useError()

    const sendVerification = async (name, email) => {
        try {
            await Axios.post(`${urlPrefix}/email/send/verification/${name}/${email}`)
        }
        catch (error) {
            const title = 'Failed to send verification email'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                name,
                email,
            })
        }
    }

    return { sendVerification }
}

//#endregion

//#region Email Clients

export const useGetCurrentClientType = () => {
    const { handleError } = useError()

    const getCurrentClientType = async () => {
        try {
            const response = await Axios.get(`${urlPrefix}/email/client-type`)
            return response.data
        }
        catch (error) {
            const title = 'Failed to get the current client type'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
            })
        }
    }

    return { getCurrentClientType }
}

export const useUpdateCurrentClientType = () => {
    const { handleError } = useError()

    const updateCurrentClientType = async (newClientType) => {
        try {
            await Axios.put(`${urlPrefix}/email/client-type/update/${newClientType}`)
        }
        catch (error) {
            const title = 'Failed to update the current client type'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                newClientType,
            })
        }
    }

    return { updateCurrentClientType }
}


export const useGetAzureClient = () => {
    const { handleError } = useError()

    const getAzureClient = async () => {
        try {
            const response = await Axios.get(`${urlPrefix}/email/get/Azure/client`)
            return response.data
        }
        catch (error) {
            const title = 'Failed to get Azure client'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
            })
        }
    }

    return { getAzureClient }
}

export const useUpdateAzureClient = () => {
    const { handleError } = useError()

    const updateAzureClient = async (clientId, clientSecret, tenantId, sendingEmail, contactFormRecipient) => {
        try {
            await Axios.post(`${urlPrefix}/email/update/azure/client`, {
                'ClientId': clientId,
                'ClientSecret': clientSecret,
                'TenantId': tenantId,
                'SendingEmail': sendingEmail,
                'ContactFormRecipient': contactFormRecipient
            })
        }
        catch (error) {
            const title = 'Failed to update Azure client'
            handleError(`${title}\n${error.message}`)
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
        }
    }

    return { updateAzureClient }
}

export const useTestAzureClient = () => {
    const { handleError } = useError()

    const testAzureClient = async (clientId, clientSecret, tenantId, sendingEmail, contactFormRecipient) => {
        try {
            const response = await Axios.put(`${urlPrefix}/email/test/azure`, {
                'ClientId': clientId,
                'ClientSecret': clientSecret,
                'TenantId': tenantId,
                'SendingEmail': sendingEmail,
                'ContactFormRecipient': contactFormRecipient
            })
            return response
        }
        catch (error) {
            const title = 'Failed to test Azure client'
            handleError(`${title}\n${error.message}`)
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
        }
    }

    return { testAzureClient }
}

//#endregion

//#region Config

export const useGetInitialisedStatus = () => {
    const { handleError } = useError()

    const getInitialisedStatus = async () => {
        try {
            const response = await Axios.get(`${urlPrefix}/config/init`)
            return response.data
        }
        catch (error) {
            const title = 'Failed to get the initialised status'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
            })
        }
    }

    return { getInitialisedStatus }
}

export const useUpdateInitialisedStatus = () => {
    const { handleError } = useError()

    const updateInitialisedStatus = async (newStatus) => {
        try {
            await Axios.put(`${urlPrefix}/config/init/update/${newStatus}`)
        }
        catch (error) {
            const title = 'Failed to update the initialised status'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                newStatus,
            })
        }
    }

    return { updateInitialisedStatus }
}

export const useGenerateObjectId = () => {
    const { handleError } = useError()

    const generateObjectId = async () => {
        try {
            const response = await Axios.get(`${urlPrefix}/config/generate-id`)
            return response.data
        }
        catch (error) {
            const title = 'Failed to generate object Id'
            handleError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
            })
        }
    }

    return { generateObjectId }
}

//#endregion