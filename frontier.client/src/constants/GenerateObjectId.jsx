import Axios from 'axios'
import URL from './URLs'

const GenerateObjectId = () => {
    const generateId = async () => {
        const response = await Axios.get(URL.GENERATE_OBJECT_ID)
        return response.data
    }

    return { generateId }
}

export default GenerateObjectId