import PropTypes from 'prop-types'
import Axios from 'axios'
import { useState, useEffect } from 'react'
import JewelleryPage from '../constants/JewelleryPages'
import URL from '../constants/URLs'

const History = ({ userId, historyType, refresh }) => {
    const [history, setHistory] = useState([])

    useEffect(() => {
        if (userId) loadHistory()
    }, [refresh])

    const loadHistory = async () => {
        try {
            const response = await Axios.get(URL.GET_HISTORY(userId))
            setHistory(response.data.filter(h => h.historyType === historyType))
        }
        catch (error) {
            console.log(error)
            alert('There was an error loading history!')
        }
    }

    return (
        <div>
            <h3>History</h3>
            <ul>
            {
                historyType === JewelleryPage.NONE ?
                    <p>Go to any of the Jewellery Tools to get user history.</p>
                    : userId === null ?
                        <p>Login to see and save history.</p>
                        : history.length > 0 ?
                            history.map(item => (
                                    <li className="history" key={item.id}>
                                        {item.content}
                                    </li>
                            )) : <p>No History Yet!</p>
            }
            </ul>
        </div>
    )
}

History.propTypes = {
    userId: PropTypes.string,
    historyType: PropTypes.oneOf(Object.values(JewelleryPage)).isRequired,
    refresh: PropTypes.string
}

export default History