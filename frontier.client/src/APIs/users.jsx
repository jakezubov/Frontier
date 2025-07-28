import Axios from 'axios'
import { useError } from '../contexts/error-context'
import { useUserSession } from '../contexts/user-context'

const urlPrefix = import.meta.env.VITE_URL_PREFIX

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
        if (userId !== null) {
            try {
                const response = await Axios.get(`${urlPrefix}/users/${userId}`)
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
        else return null
    }

    return { getUser }
}

export const useCreateUser = () => {
    const { displayError, logError } = useError()
    const { userId } = useUserSession()

    const createUser = async (firstName, lastName, email, password, admin = false) => {
        try {
            const response = await Axios.post(`${urlPrefix}/users/create`, {
                'FirstName': firstName,
                'LastName': lastName,
                'Email': email,
                'PasswordHash': password,
                'AdminTF': admin,
                'ApiToken': '',
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
            await Axios.post(`${urlPrefix}/users/${userId}/update`, {
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
            await Axios.post(`${urlPrefix}/users/${userId}/update/password`, {
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

export const useSwitchAdminStatus = () => {
    const { displayError, logError } = useError()

    const switchAdminStatus = async (changedUserId) => {
        try {
            await Axios.post(`${urlPrefix}/users/${changedUserId}/admin`)
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

export const useRefreshUserToken = () => {
    const { displayError, logError } = useError()

    const refreshUserToken = async () => {
        try {
            await Axios.post(`${urlPrefix}/users/refresh-user-token`)
        }
        catch (error) {
            const title = 'Failed to refresh user token'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
            })
            logError(title, error.message, error.stack)
        }
    }

    return { refreshUserToken }
}

//#endregion
