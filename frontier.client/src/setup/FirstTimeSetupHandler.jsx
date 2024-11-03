import PropTypes from 'prop-types'
import { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { JewelleryPageContext } from '../contexts/JewelleryPageContext'
import { useGetInitialisedStatus } from '../common/APIs'
import JewelleryPage from '../common/JewelleryPages'
import Path from '../common/Paths'

const FirstTimeSetupHandler = ({ onNotAlreadySetup }) => {
    const navigate = useNavigate()
    const { getInitialisedStatus } = useGetInitialisedStatus()
    const { setJewelleryPage } = useContext(JewelleryPageContext)

    useEffect(() => {
        checkInitialization()
    }, [])

    const checkInitialization = async () => {
        const isInitialized = await getInitialisedStatus()
        if (!isInitialized) {
            onNotAlreadySetup()
            setJewelleryPage(JewelleryPage.SETUP)
            navigate(Path.FIRST_TIME_SETUP)
        }
    }

    return (
        <div></div>
    )
}

FirstTimeSetupHandler.propTypes = {
    onNotAlreadySetup: PropTypes.func.isRequired,
}

export default FirstTimeSetupHandler