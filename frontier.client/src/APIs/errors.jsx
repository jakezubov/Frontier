import Axios from 'axios'
import { useError } from '../contexts/error-context'
import { useUserSession } from '../contexts/user-context'

const urlPrefix = import.meta.env.VITE_URL_PREFIX

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
                errorId,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { deleteErrorLog }
}

export const useDeleteAllErrorLogs = () => {
    const { displayError, logError } = useError()
    const { userId } = useUserSession()

    const deleteAllErrorLogs = async (errorId) => {
        try {
            await Axios.delete(`${urlPrefix}/errors/delete-all`)
        }
        catch (error) {
            const title = 'Failed to delete all error logs'
            displayError(`${title}\n${error.message}`)
            console.error({
                title,
                error: error.message,
                stack: error.stack,
                errorId,
            })
            logError(userId, title, error.message, error.stack)
        }
    }

    return { deleteAllErrorLogs }
}