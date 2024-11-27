import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetInitialisedStatus } from '../common/APIs'
import Path from '../common/paths'

const FirstTimeSetupHandler = ({ onNotAlreadySetup }) => {
    const navigate = useNavigate()
    const { getInitialisedStatus } = useGetInitialisedStatus()

    useEffect(() => {
        checkInitialization()
    }, [])

    const checkInitialization = async () => {
        const isInitialized = await getInitialisedStatus()
        if (!isInitialized) {
            onNotAlreadySetup()
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