import { createContext, useState, useEffect, useContext, useCallback } from 'react'
import { UserContext } from '../contexts/UserContext'
import { JewelleryPageContext } from '../contexts/JewelleryPageContext'
import { useGetHistory, useSaveHistory } from '../common/APIs'

export const HistoryContext = createContext()

export const HistoryProvider = ({ children }) => {
    const { userId } = useContext(UserContext)
    const { jewelleryPage } = useContext(JewelleryPageContext)
    const [history, setHistory] = useState([])

    const { getHistory } = useGetHistory()
    const { saveHistory } = useSaveHistory()

    const loadHistory = useCallback(async () => {
        const response = await getHistory(userId, jewelleryPage)
        setHistory(response)
    }, [userId, jewelleryPage, getHistory])

    const addHistory = useCallback( (newHistory) => {
        setHistory(prev => [...prev, newHistory])
        saveHistory(userId, jewelleryPage, newHistory)
    }, [userId, jewelleryPage, saveHistory])

    useEffect(() => {
        loadHistory()
    }, [loadHistory])

    return (
        <HistoryContext.Provider value={{ history, addHistory }}>
            {children}
        </HistoryContext.Provider>
    )
}

export const useHistory = () => useContext(HistoryContext)