import { createContext, useState, useEffect, useContext } from 'react'

const CurrentPageContext = createContext()

export const CurrentPageProvider = ({ children }) => {
    const [currentPage, setCurrentPage] = useState(sessionStorage.getItem('currentPage') || ' ')
    const [isMobile, setIsMobile] = useState(sessionStorage.getItem('isMobile') || "false")

    useEffect(() => {
        window.addEventListener('resize', checkIfMobile);
        return () => {
            window.removeEventListener('resize', checkIfMobile);
        }
    }, []);

    useEffect(() => {
        sessionStorage.setItem('currentPage', currentPage)
    }, [currentPage])

    useEffect(() => {
        sessionStorage.setItem('isMobile', isMobile)
    }, [isMobile])

    const checkIfMobile = () => {
        const deviceWidth = window.innerWidth
        deviceWidth <= 768 ? setIsMobile("true") : setIsMobile("false")
    }

    return (
        <CurrentPageContext.Provider value={{ currentPage, setCurrentPage, Pages, isMobile }}>
            {children}
        </CurrentPageContext.Provider>
    )
}

export const useCurrentPage = () => useContext(CurrentPageContext)

export const Pages = {
    HOME: 'Home',
    RESET_PASSWORD: 'Reset Password',
    CONFIRMATION_SCREEN: 'Confirmation Screen',
    FORGOT_PASSWORD: 'Forgot Password',
    LOGIN: 'Login',
    METAL_SETTINGS: 'Metal Settings',
    REGISTER: 'Register',
    RING_SIZE_SETTINGS: 'Ring Size Settings',
    UPDATE_PASSWORD: 'Update Password',
    USER_SETTINGS: 'User Settings',
    CONFIGURE_EMAIL: 'Configure Email',
    DEFAULT_METALS: 'Default Metals',
    DEFAULT_RING_SIZES: 'Default Ring Sizes',
    USER_ACCOUNTS: 'User Accounts',
    SETUP_EMAIL_CLIENT: 'Setup Email Client',
    SETUP_REGISTER: 'Setup Register',
    METAL_CONVERTER: 'Metal Converter',
    RING_WEIGHT: 'Ring Weight',
    RING_RESIZER: 'Ring Resizer',
    ROLLING_WIRE: 'Rolling Wire',
    CALCULATIONS: 'Calculations',
}
