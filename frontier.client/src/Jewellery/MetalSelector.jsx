import PropTypes from 'prop-types';

const Metals = [
    { name: 'Fine Silver', specificGravity: 10.64 },
    { name: 'Bright Silver', specificGravity: 10.50 },
    { name: 'Sterling Silver', specificGravity: 10.55 },
    { name: 'Fine Gold', specificGravity: 19.36 },
    { name: '9ct Yellow Gold', specificGravity: 11.64 },
    { name: '14ct Yellow Gold', specificGravity: 13.56 },
    { name: '18ct Yellow Gold', specificGravity: 16.04 },
    { name: '9ct White Gold', specificGravity: 13.04 },
    { name: '14ct White Gold', specificGravity: 14.02 },
    { name: '18ct White Gold', specificGravity: 16.59 },
    { name: '9ct Pink Gold', specificGravity: 11.71 },
    { name: '14ct Pink Gold', specificGravity: 14.00 },
    { name: '18ct Pink Gold', specificGravity: 15.45 },
    { name: 'Platinum', specificGravity: 21.24 },
    { name: 'Wax', specificGravity: 1.0 },
];

const MetalSelector = ({ label, onMetalChange }) => {
    const handleMetalChange = (e) => {
        const selectedMetalName = e.target.value;
        const selectedMetal = Metals.find(metal => metal.name === selectedMetalName);
        if (onMetalChange) {
            onMetalChange(selectedMetal);
        }
    };

    return (
        <select aria-label={label} onChange={handleMetalChange}>
            <option value=""></option>
            {
                Metals.map((metal, index) => (
                    <option key={index} value={metal.name}>{metal.name}</option>
                ))
            }
        </select>
    );
}

MetalSelector.propTypes = {
    label: PropTypes.string.isRequired,
    onMetalChange: PropTypes.func.isRequired,
}

export default MetalSelector;