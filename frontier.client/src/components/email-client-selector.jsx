import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useGetCurrentClientType } from '../APIs/email'
import Client from '../consts/email-clients'

const EmailClientSelector = ({ onClientChange }) => {
    const [currentClient, setCurrentClient] = useState(Client.NONE.name)

    // APIs
    const { getCurrentClientType } = useGetCurrentClientType()

    useEffect(() => {
        fetchCurrentClientType()
    }, [])

    const fetchCurrentClientType = async () => {
        const clientKey = await getCurrentClientType()
        const selectedClient = Object.values(Client).find(client => client.key === clientKey);
        setCurrentClient(selectedClient)
        onClientChange(selectedClient)
    }

    const handleClientChange = (selectedName) => {
        const selectedClient = Object.values(Client).find(client => client.name === selectedName);
        setCurrentClient(selectedClient)
        onClientChange(selectedClient)
    }

    return (
        <div>
            <select className="general-select email-selector-width" onChange={(e) => handleClientChange(e.target.value)} value={currentClient.name}>
                {Object.values(Client).map(({ key, name }) => (
                    <option key={key} value={name}>{name}</option>
                    ))
                }
            </select>
        </div>
    )
}

EmailClientSelector.propTypes = {
    onClientChange: PropTypes.func.isRequired,
}

export default EmailClientSelector