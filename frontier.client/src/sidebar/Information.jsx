import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCurrentPage } from '../contexts/current-page-context'
import Path from '../common/paths'

const Information = ({ retractSidebar }) => {
    const [information, setInformation] = useState('')
    const { currentPage, Pages, isMobile } = useCurrentPage()

    useEffect(() => {
        loadInformation()
    }, [currentPage])

    const loadInformation = () => {
        let text = "This is the Jewellery Calculation Suite. It's primary purpose is to help people work out how much metal they may require to perform a certain task and can be used to assist with quoting.\n\nCreate an account so you can log a history of your calculations and create/modify your own custom Metals and Ring Sizes to use for your calculations.\n\nAll calculations are estimations ONLY. Use them at your own risk. We are not liable for lost income due to a calculation being incorrect."

        if (currentPage === Pages.METAL_CONVERTER) {
            text = "This application is a Metal Converter tool designed to help users convert the weight of a piece of metal from one type to another based on their specific gravities.\n\nThis is done by dividing the input weight by the specific gravity of the original metal, then multiplying the result by the specific gravity of the new metal."
        }
        else if (currentPage === Pages.RING_RESIZER) {
            text = "The Ring Resizer application helps users calculate the weight of a ring when resizing it from one size to another.\n\nThe calculation involves determining the volume of the ring for both the original and new sizes, and then using the specific gravity to convert these volumes to weights."
        }
        else if (currentPage === Pages.RING_WEIGHT) {
            text = "This application is a Ring Weight tool designed to help users calculate the weight of a ring based on its size, profile, width, thickness, and the specific gravity of the metal.\n\nThe calculation involves determining the volume of the ring and then converting this volume to weight using the specific gravity of the metal."
        }
        else if (currentPage === Pages.ROLLING_WIRE) {
            text = "This application is a Rolling Wire tool designed to help users calculate the dimensions and lengths of wire when it is rolled from one shape to flat wire based on the initial dimensions, profile, and desired final size."
        }
        else if (currentPage === Pages.REGISTER) {
            text = "Create an account so you can log a history of your calculations and create/modify your own custom Metals and Ring Sizes to use for your calculations."
        }
        else if (currentPage === Pages.LOGIN) {
            text = "Login to your account so you can log a history of your calculations and create/modify your own custom Metals and Ring Sizes to use for your calculations."
        }
        else if (currentPage === Pages.FORGOT_PASSWORD) {
            text = "If you have previously created an account but forgot your password you can reset it here."
        }
        else if (currentPage === Pages.METAL_SETTINGS) {
            text = "Update the metals that are used for calculations in the jewellery tools. All fields must be filled to save the changes.\n\nIf you need to start from scratch you can do so with the 'Reset To Defaults' button."
        }
        else if (currentPage === Pages.RING_SIZE_SETTINGS) {
            text = "Update the ring sizes that are used for calculations in the jewellery tools. All fields must be filled to save the changes.\n\nIf you need to start from scratch you can do so with the 'Reset To Defaults' button."
        }
        else if (currentPage === Pages.DEFAULT_METALS) {
            text = "Update the default metals that are used for calculations in the jewellery tools. All fields must be filled to save the changes.\n\nThe metals listed here will be the defaults for new users and also when a user clicks the 'Reset To Defaults' button in their user settings it will default to this list.\n\nMaking changes here doesn't overwrite any existing user settings."
        }
        else if (currentPage === Pages.DEFAULT_RING_SIZES) {
            text = "Update the default ring sizes that are used for calculations in the jewellery tools. All fields must be filled to save the changes.\n\nThe ring sizes listed here will be the defaults for new users and also when a user clicks the 'Reset To Defaults' button in their user settings it will default to this list.\n\nMaking changes here doesn't overwrite any existing user settings."
        }
        else if (currentPage === Pages.USER_ACCOUNTS) {
            text = "Provides a list all all current user accounts. You can make other users admins and also delete accounts.\n\nMore functionality will be added in the future."
        }
        else if (currentPage === Pages.ERROR_LEDGER) {
            text = "Shows all API requests that have failed. You can manually delete the logs if you wish.\n\n Ideally there should be nothing in here."
        }
        else if (currentPage === Pages.CONFIGURE_EMAIL) {
            text = "Currently the only email method that can be used is Microsoft Graph. To set this up you need an application created in Microsft Azure, which is also where you can get the required details.\n\nA test email must be sent before it can be saved, ensure you actually receive the email since the test only verifies that it was able to send the email."
        }

        setInformation(text)
    }

    return (
        <div>
            <h3 className="tight-top">Information</h3>

            <div className="information">
                <table>                  
                    <tbody>
                        <tr>
                            <td><p className="pre-wrap">{information}</p></td>
                        </tr>
                        {currentPage === Pages.METAL_CONVERTER || currentPage === Pages.RING_RESIZER || currentPage === Pages.RING_WEIGHT || currentPage === Pages.ROLLING_WIRE ?
                            <tr>
                                <td><Link className="link-text" onClick={retractSidebar} to={Path.CALCULATIONS}>Extended Calculation Information</Link></td>
                            </tr> : null
                        }
                    </tbody>
                </table>

                <table>
                    <tbody>
                        <tr>
                            <td><p>v1.2.5</p></td>
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