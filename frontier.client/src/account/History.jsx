import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import HistoryType from '../constants/HistoryTypes';
import URL from '../constants/URLs';
import Axios from 'axios';

const History = ({ userId, historyType, refresh }) => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (userId) loadHistory();
    }, [refresh]);

    const loadHistory = async () => {
        try {
            const response = await Axios.get(URL.GET_HISTORY(userId));
            setHistory(response.data.filter(h => h.historyType === historyType))
        }
        catch (error) {
            console.log(error)
            alert('There was an error loading history!')
        }
    }

    if (!userId) return null;

    return (
        <div>
            <h3>History</h3>
            <ul>
                {
                    history.length > 0 ?
                        history.map(item => (
                                <li className="history" key={item.id}>
                                    {item.content}
                                </li>
                            )) : <p>No History Yet!</p>
                }
            </ul>
        </div>
    );
}

History.propTypes = {
    userId: PropTypes.string,
    historyType: PropTypes.oneOf(Object.values(HistoryType)).isRequired,
    refresh: PropTypes.string
};

export default History;