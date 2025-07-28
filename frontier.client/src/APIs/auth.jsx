import Axios from 'axios'
import { useError } from '../contexts/error-context'

const urlPrefix = import.meta.env.VITE_URL_PREFIX

export const useLoginUser = () => {
    const { displayError, logError } = useError()

    const loginUser = async (email, password) => {
        try {
            const response = await Axios.post(`${urlPrefix}/auth/login`, { email, password })
            return response.data
        }
        catch (error) {
            const title = 'Failed to login user'
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

    return { loginUser }
}

export const useLogoutUser = () => {
    const { displayError, logError } = useError()

    const logoutUser = async (userId) => {
        if (userId) {
            try {
                await Axios.post(`${urlPrefix}/auth/${userId}/logout`)
            }
            catch (error) {
                const title = 'Failed to logout user'
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
    }

    return { logoutUser }
}

export const useValidateUser = () => {
    const { displayError, logError } = useError()

    const validateUser = async (email, password) => {
        try {
            const response = await Axios.post(`${urlPrefix}/auth/validate`, { email, password })
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