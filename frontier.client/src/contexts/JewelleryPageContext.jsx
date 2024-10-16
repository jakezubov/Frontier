import { createContext, useState, useEffect } from 'react'
import JewelleryPage from '../common/JewelleryPages'

export const JewelleryPageContext = createContext()

export const JewelleryPageProvider = ({ children }) => {
    const [jewelleryPage, setJewelleryPage] = useState(localStorage.getItem('jewelleryPage') || JewelleryPage.NONE)

    useEffect(() => {
        localStorage.setItem('jewelleryPage', jewelleryPage)
    }, [jewelleryPage])

    return (
        <JewelleryPageContext.Provider value={{ jewelleryPage, setJewelleryPage }}>
            {children}
        </JewelleryPageContext.Provider>
    )
}
