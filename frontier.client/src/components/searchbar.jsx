import PropTypes from 'prop-types'
import { useState } from 'react'

const Searchbar = ({ searchFields, initialList, resultList }) => {
    const [searchTerm, setSearchTerm] = useState('')

    const handleSearch = (e) => {
        const newSearchTerm = e.target.value
        setSearchTerm(newSearchTerm)

        if (newSearchTerm === '') {
            resultList(initialList)
            return
        }

        const filteredResults = initialList.filter(item => {
            const concatenatedFields = searchFields.map(field => item[field] ? item[field].toString().toLowerCase() : '').join(' ')
            return concatenatedFields.includes(newSearchTerm.toLowerCase())
        })
        resultList(filteredResults)
    }

    return (
        <div>
            <input className="general-input searchbar-width" value={searchTerm} onChange={handleSearch} placeholder="Search..."></input>
        </div>
    )
}

Searchbar.propTypes = {
    searchFields: PropTypes.array.isRequired,
    initialList: PropTypes.array.isRequired,
    resultList: PropTypes.func.isRequired,
}

export default Searchbar