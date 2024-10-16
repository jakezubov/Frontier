import PropTypes from 'prop-types'
import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import { JewelleryPageContext } from '../contexts/JewelleryPageContext'
import { useGetHistory } from '../common/APIs'
import JewelleryPage from '../common/JewelleryPages'

const History = ({ refresh }) => {
    const { userId } = useContext(UserContext)
    const { jewelleryPage } = useContext(JewelleryPageContext)
    const [history, setHistory] = useState([])

    // APIs
    const { getHistory } = useGetHistory()

    useEffect(() => {
        if (userId) loadHistory()
    }, [refresh, userId])

    const loadHistory = async () => {
        const response = await getHistory(userId, jewelleryPage)
        console.log(response)
        setHistory(response)
    }

    return (
        <div>
            <h3>History</h3>
            {!userId ?
                <p>To save your calculation history, please create or log in to your account. </p>
                : jewelleryPage === JewelleryPage.NONE ?
                    <p>Navigate to any of the Jewellery Tools to access calculation history.</p>
                    : history.length > 0 ?
                        <ul className="padded-text history-scroll">
                            {history.map(item => (
                                <li className="history" key={item.id}>
                                    {item.content}
                                    <hr />
                                </li>
                            ))}
                        </ul>
                        : <p>There is no history at the moment. Try running a calculation.</p>
            }
        </div>
    )
}

History.propTypes = {
    refresh: PropTypes.string
}

export default History