import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import JewelleryPage from '../constants/JewelleryPages'

const Information = ({ informationType }) => {
    const [information, setInformation] = useState('')

    useEffect(() => {
        loadInformation()
    }, [informationType])

    const loadInformation = () => {
        let text = "Go to any of the Jewellery Tools to get more information about them."

        if (informationType === JewelleryPage.METAL_CONVERTER) {
            text = "This application is a Metal Converter tool designed to help users convert the weight of a piece of metal from one type to another based on their specific gravities.\nThis is done by dividing the input weight by the specific gravity of the original metal, then multiplying the result by the specific gravity of the new metal.\n\nCalculations:\nConverted Weight = (Weight of Original Metal / Specific Gravity of Original Metal) x Specific Gravity of New Metal"
        }
        else if (informationType === JewelleryPage.RING_RESIZER) {
            text = "The Ring Resizer application helps users calculate the weight of a ring when resizing it from one size to another.\nThe calculation involves determining the volume of the ring for both the original and new sizes, and then using the specific gravity to convert these volumes to weights.\n\nCalculations:\nCalculate Weight for both Rings = (Width x Thickness x Pi x Diameter) x Specific Gravity\nWeight Difference = New Weight - Original Weight"
        }
        else if (informationType === JewelleryPage.RING_WEIGHT) {
            text = "This application is a Ring Weight tool designed to help users calculate the weight of a ring based on its size, profile, width, thickness, and the specific gravity of the metal.\nThe calculation involves determining the volume of the ring and then converting this volume to weight using the specific gravity of the metal.\n\nCalculations:\nWeight = (Width x Thickness x Pi x Diameter) x Specific Gravity"
        }
        else if (informationType === JewelleryPage.ROLLING_WIRE) {
            text = "This application is a Rolling Wire tool designed to help users calculate the dimensions and lengths of wire when it is rolled from one shape to flat wire based on the initial dimensions, profile, and desired final size.\n\nCalculations:\nCalculate the side length = (Width^2 x Thickness)^1/3\nCalculate the Length = (Length x Width x Thickness) / Side^2\nIf Profile is Round; Calculate Diamter = (2 x Side) / Square Root(Pi)\nIf starting with a Round Stock; Calcualte the Stock Length = (4 x Side^2 x Length) / (Pi x Stock Size^2)\nIf starting with a Square Stock; Calcualte the Stock Length = (Side^2 x Length) / Stock Size^2"
        }
        setInformation(text)
    }

    return (
        <div>
            <h3>Information</h3>
            <p className="pre-wrap">{information}</p>
        </div>
    )
}

Information.propTypes = {
    informationType: PropTypes.oneOf(Object.values(JewelleryPage)).isRequired,
}

export default Information