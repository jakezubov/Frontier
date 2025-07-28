import Axios from 'axios'
import { useError } from '../contexts/error-context'

const urlPrefix = import.meta.env.VITE_URL_PREFIX

export const useGetHistory = () => {
    const { displayError, logError } = useError()

    const getHistory = async (userId, historyType) => {
        if (userId !== null) {
            try {
                const response = await Axios.get(`${urlPrefix}/history/${userId}`)
                return response.data.filter(h => h.historyType === historyType)

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
        else return null
    }

    return { getHistory }
}

export const useSaveHistory = () => {
    const { displayError, logError } = useError()

    const saveHistory = async (userId, historyType, content) => {
        try {
            await Axios.post(`${urlPrefix}/history/${userId}/create`, {
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
            await Axios.delete(`${urlPrefix}/history/${userId}/delete`)
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