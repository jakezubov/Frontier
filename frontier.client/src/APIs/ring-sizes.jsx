import Axios from 'axios'
import { useError } from '../contexts/error-context'
import { useUserSession } from '../contexts/user-context'

const urlPrefix = import.meta.env.VITE_URL_PREFIX

export const useGetRingSizes = () => {
    const { displayError, logError } = useError()

    const getRingSizes = async (userId) => {
        try {
            const response = await Axios.get(`${urlPrefix}/ringsizes/${userId}`)
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
            await Axios.post(`${urlPrefix}/ringsizes/${userId}/update`, ringSizeList)
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
            await Axios.post(`${urlPrefix}/ringsizes/${userId}/reset`)
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
            const response = await Axios.get(`${urlPrefix}/ringsizes`)
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
    const { userId } = useUserSession()

    const updateDefaultRingSizes = async (ringSizeList) => {
        try {
            await Axios.post(`${urlPrefix}/ringsizes/update`, ringSizeList)
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
            await Axios.post(`${urlPrefix}/ringsizes/reset`)
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