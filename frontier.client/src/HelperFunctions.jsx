export const validateNumber = (number) => {
    return number !== "" && !isNaN(parseFloat(number)) && isFinite(parseFloat(number)) && parseFloat(number) > 0;
}

export const calculateRingWeight = (profile, width, thickness, length, specificGravity) => {
    if (profile === "Round") {
        return (Math.PI * Math.pow(width, 2) * (length + width)) * specificGravity / 1000;
    } else if (profile === "Square") {
        return (length + width + width) * Math.PI * width * width * specificGravity / 1000;
    } else if (profile === "Half-Round") {
        return ((Math.PI * Math.pow(width, 2)) * (length + width + thickness)) * specificGravity / 1000;
    } else if (profile === "Rectangle") {
        return (length + width + thickness) * Math.PI * width * thickness * specificGravity / 1000;
    } else {
        return null; // Invalid profile
    }
}