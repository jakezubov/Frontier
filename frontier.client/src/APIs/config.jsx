import Axios from 'axios'
import { useError } from '../contexts/error-context'
import { useUserSession } from '../contexts/user-context'

const urlPrefix = import.meta.env.VITE_URL_PREFIX

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
    const { userId } = useUserSession()

    const updateInitialisedStatus = async (newStatus) => {
        try {
            await Axios.post(`${urlPrefix}/config/init/update/${newStatus}`)
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