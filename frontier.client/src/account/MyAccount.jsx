import UserSettings from './UserSettings';
import MetalSettings from './MetalSettings';
import RingSizeSettings from './RingSizeSettings';

const MyAccount = ({ userId }) => {
    return (
        <div>
            <h1>My Account</h1>
            <UserSettings userId={userId} />

            <br />
            <br />

            <MetalSettings userId={userId} />

            <br />
            <br />

            <RingSizeSettings userId={userId} />
        </div>
    );
}

export default MyAccount;