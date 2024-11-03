import PropTypes from 'prop-types'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SetupRegister from './SetupRegister'
import SetupEmailClient from './SetupEmailClient'
import Path from '../common/Paths'

const FirstTimeSetup = ({ onSetupComplete }) => {
    const navigate = useNavigate()
    const [registerComplete, setRegisterComplete] = useState(false)

    const setupCompleted = () => {
        onSetupComplete()
        navigate(Path.HOME)
    }

    return (
        <div>
            {!registerComplete
                ? <SetupRegister onRegisterComplete={() => setRegisterComplete(true)} />
                : <SetupEmailClient onConfigureEmailComplete={setupCompleted} />}
        </div>
    )
}

FirstTimeSetup.propTypes = {
    onSetupComplete: PropTypes.func.isRequired,
}

export default FirstTimeSetup