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
        handlePageChange(currentPage)
    }, [initialList, itemsPerPage])

    const handlePageChange = (pageNumber) => {
        const startIndex = (pageNumber - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        const currentPageItems = initialList.slice(startIndex, endIndex)
        resultList(currentPageItems)
    }

    const handlePaginationChange = (event, pageNumber) => {
        setCurrentPage(pageNumber)
        handlePageChange(pageNumber)
    }

    return (
        <div className="break-top">
            <Pagination nextLabel="Next" label="Page" pageLabel="Page" pages={pageNumbers} previousLabel="Previous" onChange={handlePaginationChange} />
        </div>
    )
}

Paging.propTypes = {
    initialList: PropTypes.array.isRequired,
    resultList: PropTypes.func.isRequired,
    itemsPerPage: PropTypes.number,
}

export default Paging