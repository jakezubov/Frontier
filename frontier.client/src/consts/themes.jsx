export const updateCSSVariables = (theme) => {
    const root = document.documentElement

    const themes = {
        light: {
            'color-scheme': 'light',
            '--background-colour': '#fafafa',
            '--text-colour': '#000000',
            '--primary-colour': '#a8dfff',
            '--secondary-colour': '#b9c0c4',
            '--accent-colour': '#4296c7', 
            '--output-colour': 'rgba(185, 192, 196, 0.3)',
        },
        dark: {
            'color-scheme': 'dark',
            '--background-colour': '#1a1625',
            '--text-colour': '#faf5ef',
            '--primary-colour': '#2f2b3a',
            '--secondary-colour': '#46424f',
            '--accent-colour': '#443e94',
            '--output-colour': 'rgba(70, 66, 79, 0.3)',
        },
    }

    const selectedTheme = themes[theme];

    if (selectedTheme) {
        for (const [key, value] of Object.entries(selectedTheme)) {
            root.style.setProperty(key, value)
        }
    }
}
