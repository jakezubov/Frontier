import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useGenerateObjectId } from '../common/APIs'
import { useCurrentPage } from '../contexts/current-page-context'

const EditableTable = ({ tableList, setTableList, columnSchema }) => {
    const { isMobile } = useCurrentPage()

    // APIs
    const { generateObjectId } = useGenerateObjectId()

    const handleInputChange = (id, field, value) => {
        setTableList(list => list.map(
            element => element.id === id ? {
                ...element, [field]: value
            } : element
        ))
    }

    const handleAddNew = async (index) => {
        const newId = await generateObjectId()

        const newElement = {
            ...columnSchema.reduce((element, column) => {
                element[column.key] = column.type === 'number' ? 0 : ''
                return element
            }, {}), id: newId, listIndex: index + 1
        }

        setTableList(currentList => {
            const newList = [...currentList]
            for (let i = 0; i < newList.length; i++) {
                if (newList[i].listIndex > index) {
                    newList[i] = {
                        ...newList[i],
                        listIndex: newList[i].listIndex + 1
                    }
                }
            }
            newList.splice(index, 0, newElement)
            return newList
        })
    }

    const handleDelete = (id) => {
        const deleteIndex = tableList.findIndex(element => element.id === id)
        setTableList(currentList => currentList
            .filter(element => element.id !== id)
            .map(element => {
                if (element.listIndex > deleteIndex) {
                    return {
                        ...element,
                        listIndex: element.listIndex - 1
                    }
                }
                return element
            })
        )
    }

    return (
        <div>
            { tableList.length > 0 ? (
                <div className="table-scroll">
                    <table className="editable-table">
                        <thead>
                            <tr>
                                {isMobile === "false" &&
                                    <th>Index</th>
                                }
                                {columnSchema.map(column => (
                                    <th key={column.key}>{column.name}</th>
                                ))}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableList.map((element) => (
                                <tr key={element.listIndex}>
                                    {isMobile === "false" &&
                                        <td>{element.listIndex}</td>
                                    }
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
                                        <button className="settings-icon" type="button" onClick={() => handleAddNew(element.listIndex)}><FontAwesomeIcon className="fa-lg" icon={faPlus} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div> )
                : <button className="settings-icon" type="button" onClick={() => handleAddNew(0)}><FontAwesomeIcon className="fa-lg" icon={faPlus} /> Add a new row</button>
            }
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