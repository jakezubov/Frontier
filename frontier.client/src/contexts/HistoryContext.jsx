import { createContext, useState, useEffect, useContext, useCallback } from 'react'
import { UserContext } from '../contexts/UserContext'
import { useGetHistory, useSaveHistory } from '../common/APIs'
import { useCurrentPage } from '../contexts/CurrentPageContext'

export const HistoryContext = createContext()

export const HistoryProvider = ({ children }) => {
    const { userId } = useContext(UserContext)
    const [history, setHistory] = useState([])
    const { currentPage } = useCurrentPage()

    // APIs
    const { getHistory } = useGetHistory()
    const { saveHistory } = useSaveHistory()

    const loadHistory = useCallback(async () => {
        const response = await getHistory(userId, currentPage)
        setHistory(response)
    }, [userId, currentPage])

    const addHistory = useCallback(async (newHistory) => {
        await saveHistory(userId, currentPage, newHistory)
        loadHistory()
    }, [userId, currentPage])

    useEffect(() => {
        loadHistory()
    }, [userId, currentPage])

    return (
        <HistoryContext.Provider value={{ history, addHistory }}>
            {children}
        </HistoryContext.Provider>
    )
}

export const useHistory = () => useContext(HistoryContext)