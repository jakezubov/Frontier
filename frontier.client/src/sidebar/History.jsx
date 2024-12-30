import { useUserSession } from '../contexts/user-context'
import { useHistory } from '../contexts/history-context'
import { useCurrentPage } from '../contexts/current-page-context'

const History = () => {
    const { userId } = useUserSession()
    const { history } = useHistory()
    const { currentPage, Pages } = useCurrentPage()

    return (
        <div>
            <h3>History</h3>
            {!userId ?
                <p>To save your calculation history, please create or log in to your account.</p>
                : currentPage !== Pages.METAL_CONVERTER && currentPage !== Pages.RING_RESIZER
                    && currentPage !== Pages.RING_WEIGHT && currentPage !== Pages.ROLLING_WIRE
                    ? <p>Navigate to any of the Jewellery Tools to access calculation history.</p>
                    : history.length > 0 ?
                        <ul className="padded-text history-scroll">
                            {history?.map(item => (
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

export default History