import PropTypes from 'prop-types';

const RingSizes = [
    { letterSize: "A", numberSize: 0.5, diameter: 12.04 },
    { letterSize: "B", numberSize: 1.0, diameter: 12.45 },
    { letterSize: "C", numberSize: 1.5, diameter: 12.85 },
    { letterSize: "D", numberSize: 2.0, diameter: 13.26 },
    { letterSize: "E", numberSize: 2.5, diameter: 13.67 },
    { letterSize: "F", numberSize: 3.0, diameter: 14.07 },
    { letterSize: "G", numberSize: 3.5, diameter: 14.48 },
    { letterSize: "H", numberSize: 4.0, diameter: 14.88 },
    { letterSize: "I", numberSize: 4.5, diameter: 15.29 },
    { letterSize: "J", numberSize: 5.0, diameter: 15.49 },
    { letterSize: "K", numberSize: 5.5, diameter: 15.90 },
    { letterSize: "L", numberSize: 6.0, diameter: 16.31 },
    { letterSize: "M", numberSize: 6.5, diameter: 16.71 },
    { letterSize: "N", numberSize: 7.0, diameter: 17.12 },
    { letterSize: "O", numberSize: 7.5, diameter: 17.53 },
    { letterSize: "P", numberSize: 8.0, diameter: 17.93 },
    { letterSize: "Q", numberSize: 8.5, diameter: 18.34 },
    { letterSize: "R", numberSize: 9.0, diameter: 18.75 },
    { letterSize: "S", numberSize: 9.5, diameter: 19.15 },
    { letterSize: "T", numberSize: 10.0, diameter: 19.56 },
    { letterSize: "U", numberSize: 10.5, diameter: 19.96 },
    { letterSize: "V", numberSize: 11.0, diameter: 20.37 },
    { letterSize: "W", numberSize: 11.5, diameter: 20.78 },
    { letterSize: "X", numberSize: 12.0, diameter: 21.18 },
    { letterSize: "Y", numberSize: 12.5, diameter: 21.59 },
    { letterSize: "Z", numberSize: 13.0, diameter: 21.79 },
].map(ringSize => ({
    ...ringSize,
    name: `${ringSize.letterSize} / ${ringSize.numberSize}`
}));

const RingSizeSelector = ({ label, onSizeChange }) => {
    const handleSizeChange = (e) => {
        const selectedSizeName = e.target.value;
        const selectedSize = RingSizes.find(ringSize => ringSize.name === selectedSizeName);
        if (onSizeChange) {
            onSizeChange(selectedSize);
        }
    };

    return (
        <select
            aria-label={label}
            onChange={handleSizeChange}
        >
            <option value=""></option>
            {RingSizes.map((ringSize, index) => (
                <option key={index} value={ringSize.name}>
                    {ringSize.name}
                </option>
            ))}
        </select>
    );
}

RingSizeSelector.propTypes = {
    label: PropTypes.string.isRequired,
    onSizeChange: PropTypes.func.isRequired,
}

export default RingSizeSelector;