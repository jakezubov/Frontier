import Axios from 'axios'
import { createContext, useState, useEffect, useContext } from 'react'
import { useGetUser } from '../APIs/users'

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState(localStorage.getItem('userId'))
    const [adminStatus, setAdminStatus] = useState(localStorage.getItem('adminStatus'))
    const [userToken, setUserToken] = useState(localStorage.getItem('userToken'))
    const [loggedInStatus, setLoggedInStatus] = useState(localStorage.getItem('loggedInStatus'))
    const [localFirstName, setFirstName] = useState(localStorage.getItem('firstName'))
    const [localLastName, setLastName] = useState(localStorage.getItem('lastName'))
    const [localEmail, setEmail] = useState(localStorage.getItem('email'))
    const [localHistoryAmount, setHistoryAmount] = useState(localStorage.getItem('historyAmount'))

    if (userToken) {
        Axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`
    }

    // APIs
    const { getUser } = useGetUser()
    
    useEffect(() => {
        if (userId) {
            updateUserSession(userId)
        } else {
            clearUserSession()
        }
    }, [userId])

    useEffect(() => {
        Axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`
        localStorage.setItem('userToken', userToken)
    }, [userToken])

    const updateUserSession = async () => {
        if (userId) {
            const user = await getUser(userId)

            if (user !== undefined) {
                // Update states
                setAdminStatus(user.adminTF)
                setLoggedInStatus(user.loggedInTF)
                setFirstName(user.firstName)
                setLastName(user.lastName)
                setEmail(user.email)
                setHistoryAmount(user.historyAmount)

                // Update Local Storage
                localStorage.setItem('userId', user.id)
                localStorage.setItem('adminStatus', user.adminTF)
                localStorage.setItem('loggedInStatus', user.loggedInTF)
                localStorage.setItem('firstName', user.firstName)
                localStorage.setItem('lastName', user.lastName)
                localStorage.setItem('email', user.email)
                localStorage.setItem('historyAmount', user.historyAmount)
            }
            else {
                clearUserSession()
            }
        }
    }

    const clearUserSession = () => {
        // Update states
        setFirstName(null)
        setLastName(null)
        setEmail(null)
        setHistoryAmount(null)
        setLoggedInStatus(false)
        setAdminStatus(false)
        setUserToken(null)
        Axios.defaults.headers.common['Authorization'] = null

        // Update Local Storage
        localStorage.removeItem('userId')
        localStorage.removeItem('firstName')
        localStorage.removeItem('lastName')
        localStorage.removeItem('email')
        localStorage.removeItem('historyAmount')
        localStorage.removeItem('userToken')
        localStorage.setItem('loggedInStatus', 'false')
        localStorage.setItem('adminStatus', 'false')
    }

    return (
        <UserContext.Provider value={{
            userId,
            setUserId,
            userToken,
            setUserToken,
            adminStatus,
            loggedInStatus,
            localFirstName,
            localLastName,
            localEmail,
            localHistoryAmount,
            updateUserSession,
        }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUserSession = () => useContext(UserContext)
