import Axios from 'axios'
import { useError } from '../contexts/error-context'
import { useUserSession } from '../contexts/user-context'

const urlPrefix = import.meta.env.VITE_URL_PREFIX

export const useGetMetals = () => {
    const { displayError, logError } = useError()

    const getMetals = async (userId) => {
        try {
            const response = await Axios.get(`${urlPrefix}/metals/${userId}`)
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
            await Axios.post(`${urlPrefix}/metals/${userId}/update`, metalList)
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
            await Axios.post(`${urlPrefix}/metals/${userId}/reset`)
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
            const response = await Axios.get(`${urlPrefix}/metals`)
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
    const { userId } = useUserSession()

    const updateDefaultMetals = async (metalList) => {
        try {
            await Axios.post(`${urlPrefix}/metals/update`, metalList)
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
            await Axios.post(`${urlPrefix}/metals/reset`)
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