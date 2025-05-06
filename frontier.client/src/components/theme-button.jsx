import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons'
import { updateCSSVariables } from '../consts/themes'

const ThemeButton = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')

    useEffect(() => {
        updateCSSVariables(theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    const handleThemeChange = (e) => {
        e.preventDefault()
        theme === 'light' ? setTheme('dark') : setTheme('light')
    }

    return (
        <div>
            <button className="settings-icon navbar-icon" onClick={handleThemeChange}><FontAwesomeIcon className="fa-2xl" icon={faCircleHalfStroke} /></button>
        </div>
    )
}

export default ThemeButton