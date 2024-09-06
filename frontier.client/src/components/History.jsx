import PropTypes from 'prop-types'
import Axios from 'axios'
import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import { JewelleryPageContext } from '../contexts/JewelleryPageContext'
import JewelleryPage from '../constants/JewelleryPages'
import URL from '../constants/URLs'
import PopupError from '../popups/PopupError'

const History = ({ refresh }) => {
    const { userId } = useContext(UserContext)
    const { jewelleryPage } = useContext(JewelleryPageContext)
    const [history, setHistory] = useState([])

    // Error Popup
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)
    const [errorContent, setErrorContent] = useState('')

    useEffect(() => {
        if (userId) loadHistory()
    }, [refresh, userId])

    const loadHistory = async () => {
        try {
            const response = await Axios.get(URL.GET_HISTORY(userId))
            setHistory(response.data.filter(h => h.historyType === jewelleryPage))
        }
        catch (error) {
            console.error({
                message: 'Failed to load history',
                error: error.message,
                stack: error.stack,
                userId,
            })
            setErrorContent('Failed to load history\n' + error.message)
            setIsErrorPopupOpen(true)
        }
    }

    return (
        <div>
            <h3>History</h3>
            {!userId ?
                <p>To save your calculation history, please create or log in to your account. </p>
                : jewelleryPage === JewelleryPage.NONE ?
                    <p>Navigate to any of the Jewellery Tools to access calculation history.</p>
                    : history.length > 0 ?
                        <ul className="padded-text">
                            {history.map(item => (
                                <li className="history" key={item.id}>
                                    {item.content}
                                    <hr />
                                </li>
                            ))}
                        </ul>
                        : <p>There is no history at the moment. Try running a calculation.</p>
            }
 
            {isErrorPopupOpen && (
                <PopupError isPopupOpen={isErrorPopupOpen} setIsPopupOpen={setIsErrorPopupOpen} content={errorContent} />
            )}
        </div>
    )
}

History.propTypes = {
    refresh: PropTypes.string
}

export default History