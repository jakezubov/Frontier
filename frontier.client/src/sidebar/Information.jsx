import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCurrentPage } from '../contexts/current-page-context'
import Path from '../common/paths'

const Information = ({ retractSidebar }) => {
    const [information, setInformation] = useState('')
    const { currentPage, Pages } = useCurrentPage()

    useEffect(() => {
        loadInformation()
    }, [currentPage])

    const loadInformation = () => {
        let text = "Go to any of the Jewellery Tools to get more information about them."

        if (currentPage === Pages.METAL_CONVERTER) {
            text = "This application is a Metal Converter tool designed to help users convert the weight of a piece of metal from one type to another based on their specific gravities.\nThis is done by dividing the input weight by the specific gravity of the original metal, then multiplying the result by the specific gravity of the new metal."
        }
        else if (currentPage === Pages.RING_RESIZER) {
            text = "The Ring Resizer application helps users calculate the weight of a ring when resizing it from one size to another.\nThe calculation involves determining the volume of the ring for both the original and new sizes, and then using the specific gravity to convert these volumes to weights."
        }
        else if (currentPage === Pages.RING_WEIGHT) {
            text = "This application is a Ring Weight tool designed to help users calculate the weight of a ring based on its size, profile, width, thickness, and the specific gravity of the metal.\nThe calculation involves determining the volume of the ring and then converting this volume to weight using the specific gravity of the metal."
        }
        else if (currentPage === Pages.ROLLING_WIRE) {
            text = "This application is a Rolling Wire tool designed to help users calculate the dimensions and lengths of wire when it is rolled from one shape to flat wire based on the initial dimensions, profile, and desired final size."
        }
        setInformation(text)
    }

    return (
        <div>
            <h3>Information</h3>

            <div className="information">
                <table>                  
                    <tbody>
                        <tr>
                            <td><p className="pre-wrap">{information}</p></td>
                        </tr>
                        { currentPage === Pages.METAL_CONVERTER || currentPage === Pages.RING_RESIZER
                            || currentPage === Pages.RING_WEIGHT || currentPage === Pages.ROLLING_WIRE
                            ?
                            <tr>
                                <td><Link className="link-text" onClick={retractSidebar} to={Path.CALCULATIONS}>Extended Calculation Information</Link></td>
                            </tr>
                            : null
                        }
                    </tbody>
                </table>

                <table>
                    <tbody>
                        <tr>
                            <td><p>v1.2.1</p></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

Information.propTypes = {
    retractSidebar: PropTypes.func.isRequired,
}

export default Information