import PropTypes from 'prop-types'
import Axios from 'axios'
import { useState, useEffect } from 'react'
import JewelleryPage from '../constants/JewelleryPages'
import URL from '../constants/URLs'
import PopupError from './PopupError'

const History = ({ userId, historyType, refresh }) => {
    const [history, setHistory] = useState([])

    // Error Popup
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)
    const [errorContent, setErrorContent] = useState('')

    useEffect(() => {
        if (userId) loadHistory()
    }, [refresh])

    const loadHistory = async () => {
        try {
            const response = await Axios.get(URL.GET_HISTORY(userId))
            setHistory(response.data.filter(h => h.historyType === historyType))
        }
        catch (error) {
            console.error({
                message: 'Failed to load history',
                error: error.message,
                stack: error.stack,
            })
            setErrorContent('Failed to load history\n' + error.message)
            setIsErrorPopupOpen(true)
        }
    }

    return (
        <div>
            <h3>History</h3>
            <ul>
            {
                historyType === JewelleryPage.NONE ?
                    <p>Go to any of the Jewellery Tools to get user history.</p>
                    : history.length > 0 ?
                        history.map(item => (
                                <li className="history" key={item.id}>
                                    {item.content}
                                </li>
                        )) : <p>No History Yet!</p>
            }
            </ul>

            {isErrorPopupOpen && (
                <PopupError isPopupOpen={isErrorPopupOpen} setIsPopupOpen={setIsErrorPopupOpen} content={errorContent} />
            )}
        </div>
    )
}

History.propTypes = {
    userId: PropTypes.string.isRequired,
    historyType: PropTypes.oneOf(Object.values(JewelleryPage)).isRequired,
    refresh: PropTypes.string
}

export default History