export const validatePassword = (password) => {
    const pass = String(password);

    return /[a-z]/.test(pass) &&
           /[A-Z]/.test(pass) &&
           /\d/.test(pass) &&
           pass.length >= 8;
}

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(String(email).toLowerCase())
}

export const validateNumber = (number) => {
    const parsed = parseFloat(number)
    return !isNaN(parsed) && isFinite(parsed) && parsed >= 0
}
