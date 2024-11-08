import { createContext, useState, useEffect, useContext, useCallback } from 'react'
import { UserContext } from '../contexts/UserContext'
import { JewelleryPageContext } from '../contexts/JewelleryPageContext'
import { useGetHistory, useSaveHistory } from '../common/APIs'

export const HistoryContext = createContext()

export const HistoryProvider = ({ children }) => {
    const { userId } = useContext(UserContext)
    const { jewelleryPage } = useContext(JewelleryPageContext)
    const [history, setHistory] = useState([])

    // APIs
    const { getHistory } = useGetHistory()
    const { saveHistory } = useSaveHistory()

    const loadHistory = useCallback(async () => {
        const response = await getHistory(userId, jewelleryPage)
        setHistory(response)
    }, [userId, jewelleryPage])

    const addHistory = useCallback(async (newHistory) => {
        await saveHistory(userId, jewelleryPage, newHistory)
        loadHistory()
    }, [userId, jewelleryPage])

    useEffect(() => {
        loadHistory()
    }, [userId, jewelleryPage])

    return (
        <HistoryContext.Provider value={{ history, addHistory }}>
            {children}
        </HistoryContext.Provider>
    )
}

export const useHistory = () => useContext(HistoryContext)