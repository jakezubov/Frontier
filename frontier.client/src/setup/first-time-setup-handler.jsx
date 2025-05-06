import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetInitialisedStatus } from '../APIs/config'
import Path from '../consts/paths'

const FirstTimeSetupHandler = ({ onNotAlreadySetup }) => {
    const navigate = useNavigate()
    const { getInitialisedStatus } = useGetInitialisedStatus()

    useEffect(() => {
        checkInitialisation()
    }, [])

    const checkInitialisation = async () => {
        const isInitialised = await getInitialisedStatus()
        if (!isInitialised) {
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