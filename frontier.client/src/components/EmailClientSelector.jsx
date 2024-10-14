import PropTypes from 'prop-types'

const Clients = [
    { name: 'Azure' },
];

const EmailClientSelector = ({ label, onClientChange }) => {
    const handleClientChange = (e) => {
        onClientChange(e.target.value)
    };

    return (
        <div>
            <select className="general-select" aria-label={label} onChange={handleClientChange}>
                <option value=""></option>
                {
                    Clients.map((client, index) => (
                        <option key={index} value={client.name}>{client.name}</option>
                    ))
                }
            </select>
        </div>
    )
}

EmailClientSelector.propTypes = {
    label: PropTypes.string.isRequired,
    onClientChange: PropTypes.func.isRequired,
}

export default EmailClientSelector