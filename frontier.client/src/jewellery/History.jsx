import { useState } from 'react';

const HistoryType = [
    { type: 'MetalConverter' },
    { type: 'RingWeight' },
    { type: 'RingResizer' },
    { type: 'RollingWire' },
];

const History = () => {
    const [historyType, setHistoryType] = useState(null);


    return (
        <div>
            <h3>History</h3>
            
            
        </div>
    );
}

export default History;