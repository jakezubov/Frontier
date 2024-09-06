import PropTypes from 'prop-types'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import GenerateObjectId from '../constants/GenerateObjectId'
import PopupError from '../popups/PopupError'

const EditableTable = ({ tableList, setTableList, columnSchema }) => {
    const { generateId } = GenerateObjectId()

    // Popups
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false)
    const [errorContent, setErrorContent] = useState('')

    const handleInputChange = (id, field, value) => {
        setTableList(list => list.map(
            element => element.id === id ? {
                ...element, [field]: value
            } : element
        ))
    }

    const handleAddNew = async (index) => {
        try {
            const newId = await generateId()
            const newElement = columnSchema.reduce((element, column) => {
                element[column.key] = column.type === 'number' ? 0 : ''
                return element
            }, { id: newId })
            const newList = [...tableList]
            newList.splice(index + 1, 0, newElement)
            setTableList(newList)
        }
        catch (error) {
            console.error({
                message: 'Object Id failed to generate',
                error: error.message,
                stack: error.stack,
            })
            setErrorContent('Object Id failed to generate\n' + error.message)
            setIsErrorPopupOpen(true)
        }
    }

    const handleDelete = (id) => {
        setTableList(tableList => tableList.filter(element => element.id !== id))
    }

    return (
        <div>
            {tableList.length > 0 ? (
            <>
                <table>
                    <thead>
                        <tr>
                            {columnSchema.map(column => (
                                <th key={column.key}>{column.name}</th>
                            ))}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableList.map((element, index) => (
                            <tr key={element.id}>
                                {columnSchema.map((column) => (
                                    <td key={column.key}>
                                        <input
                                            className="general-input"
                                            type={column.type === 'number' ? 'number' : 'text'}
                                            step={column.type === 'number' ? '0.01' : undefined}
                                            min={column.type === 'number' ? '0.01' : undefined}
                                            value={element[column.key]}
                                            onChange={(e) => handleInputChange(element.id, column.key, e.target.value)}
                                        />
                                    </td>
                                ))}
                                <td className="tooltip">
                                    <button className="settings-icon" type="button" onClick={() => handleDelete(element.id)}><FontAwesomeIcon className="fa-md" icon={faTrash} /></button>
                                    <button className="settings-icon" type="button" onClick={() => handleAddNew(index)}><FontAwesomeIcon className="fa-lg" icon={faPlus} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>
            ) : <button className="settings-icon" type="button" onClick={() => handleAddNew(0)}><FontAwesomeIcon className="fa-lg" icon={faPlus} /> Add a new row</button>}

            {isErrorPopupOpen && (
                <PopupError isPopupOpen={isErrorPopupOpen} setIsPopupOpen={setIsErrorPopupOpen} content={errorContent} />
            )}
        </div>
    )
}

EditableTable.propTypes = {
    tableList: PropTypes.array.isRequired,
    setTableList: PropTypes.func.isRequired,
    columnSchema: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['string', 'number']).isRequired,
    })).isRequired,
}

export default EditableTable