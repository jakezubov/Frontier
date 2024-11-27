import PropTypes from 'prop-types'

const Profiles = [
    { name: 'Round' },
    { name: 'Half-Round' },
    { name: 'Square' },
    { name: 'Rectangle' },
];

const ProfilesLimited = [
    { name: 'Round' },
    { name: 'Square' },
];

const ProfileSelector = ({ label, onProfileChange, isLimited }) => {
    const handleProfileChange = (e) => {
        onProfileChange(e.target.value)
    };

    return (
        <div>
        {
            isLimited ?
                <select className="general-select" aria-label={label} onChange={handleProfileChange}>
                <option value=""></option>
                {
                    ProfilesLimited.map((profile, index) => (
                        <option key={index} value={profile.name}>{profile.name}</option>
                    ))
                }
                </select> :
                <select className="general-select" aria-label={label} onChange={handleProfileChange}>
                    <option value=""></option>
                    {
                        Profiles.map((profile, index) => (
                            <option key={index} value={profile.name}>{profile.name}</option>
                        ))
                    }
                </select>
        }
        </div>
    )
}

ProfileSelector.propTypes = {
    label: PropTypes.string.isRequired,
    onProfileChange: PropTypes.func.isRequired,
    isLimited: PropTypes.bool,
}

ProfileSelector.defaultProps = {
    isLimited: false,
}

export default ProfileSelector