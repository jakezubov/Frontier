export const validateNumber = (number) => {
    const parsed = parseFloat(number)
    return !isNaN(parsed) && isFinite(parsed) && parsed > 0
}