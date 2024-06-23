const URL = {
    GET_ALL_USERS: `http://localhost:5221/api/Users`,
    GET_USER: (id) => `http://localhost:5221/api/Users/${id}`,
    VALIDATE_USER: `http://localhost:5221/api/Users/validate`,
    CREATE_USER: `http://localhost:5221/api/Users`,
    UPDATE_USER: (id) => `http://localhost:5221/api/Users/${id}`,
    DELETE_USER: (id) => `http://localhost:5221/api/Users/${id}`,
    GET_HISTORY: (id) => `http://localhost:5221/api/Users/history/${id}`,
    ADD_HISTORY: (id) => `http://localhost:5221/api/Users/history/${id}`,
    DELETE_HISTORY: (id) => `http://localhost:5221/api/Users/history/${id}`,
};

export default URL;