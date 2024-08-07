export const updateCSSVariables = (theme) => {
    const root = document.documentElement

    const themes = {
        light: {
            '--background-colour': '#fafafa',
            '--text-colour': '#000000',
            '--primary-colour': '#7BD3EA',
            '--secondary-colour': '#A1EEBD',
            '--accent-colour': '#F6D6D6', 
        },
        dark: {
            '--background-colour': '#1a1625',
            '--text-colour': '#faf5ef',
            '--primary-colour': '#2f2b3a',
            '--secondary-colour': '#46424f',
            '--accent-colour': '#443e94',
        },
    }

    const selectedTheme = themes[theme];

    if (selectedTheme) {
        for (const [key, value] of Object.entries(selectedTheme)) {
            root.style.setProperty(key, value)
        }
    }
}
