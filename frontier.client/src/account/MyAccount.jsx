import UserSettings from '../components/UserSettings';
import MetalSettings from '../components/MetalSettings';
import RingSizeSettings from '../components/RingSizeSettings';

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