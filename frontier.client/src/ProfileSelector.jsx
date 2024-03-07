import PropTypes from 'prop-types';

const Profiles = [
    { name: 'Round' },
    { name: 'Half-Round' },
    { name: 'Square' },
    { name: 'Rectangle' },
];

const ProfileSelector = ({ label, onProfileChange }) => {
    const handleProfileChange = (e) => {
        onProfileChange(e.target.value)
    };

    return (
        <select
            aria-label={label}
            onChange={handleProfileChange}
        >
            <option value=""></option>
            {Profiles.map((profile, index) => (
                <option key={index} value={profile.name}>
                    {profile.name}
                </option>
            ))}
        </select>
    );
}

ProfileSelector.propTypes = {
    label: PropTypes.string.isRequired,
    onProfileChange: PropTypes.func.isRequired,
}

export default ProfileSelector;