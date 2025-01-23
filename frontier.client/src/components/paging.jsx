import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import Pagination from '@atlaskit/pagination'

const Paging = ({ itemsPerPage=5, initialList, resultList }) => {
    const [pageNumbers, setPageNumbers] = useState([1])
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        const totalPages = Math.ceil(initialList.length / itemsPerPage)
        const pagesArray = Array.from({ length: totalPages }, (_, index) => index + 1)
        setPageNumbers(pagesArray.length > 0 ? pagesArray : [1])
        if (currentPage > totalPages) {
            handlePageChange(totalPages > 0 ? totalPages : 1)
            return
        }
        handlePageChange(currentPage)
    }, [initialList, itemsPerPage])

    const handlePageChange = (pageNumber) => {
        const startIndex = (pageNumber - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        const currentPageItems = initialList.slice(startIndex, endIndex)
        setCurrentPage(pageNumber)
        resultList(currentPageItems)
    }

    const handlePaginationChange = (_event, pageNumber) => {
        handlePageChange(pageNumber)
    }

    return (
        <div className="break-top">
            <Pagination pages={pageNumbers} onChange={handlePaginationChange} selectedIndex={currentPage-1} />
        </div>
    )
}

Paging.propTypes = {
    itemsPerPage: PropTypes.number,
    initialList: PropTypes.array.isRequired,
    resultList: PropTypes.func.isRequired,
}

export default Paging