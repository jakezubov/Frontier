const PasswordRequirements = () => {
    return (
        <div>
            <table className="flex-container column">
                <thead>
                    <tr>
                        <th className="left-align tight-text">Password must include the following:</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="left-align tight-text">- 8 or more characters</td>
                    </tr>
                    <tr>
                        <td className="left-align tight-text">- Uppercase and lowercase letters</td>
                    </tr>
                    <tr>
                        <td className="left-align tight-text">- A number</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default PasswordRequirements