export const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/
    return regex.test(String(password));
}

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(String(email).toLowerCase())
}

export const validateNumber = (number) => {
    const parsed = parseFloat(number)
    return !isNaN(parsed) && isFinite(parsed) && parsed > 0
}