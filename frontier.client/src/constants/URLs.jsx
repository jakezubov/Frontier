const prefix = 'http://localhost:5221'

const URL = {
    /** User */
    GET_ALL_USERS: `${prefix}/api/users`,
    GET_USER: (id) => `${prefix}/api/users/${id}`,
    VALIDATE_USER: `${prefix}/api/users/validate`,
    CREATE_USER: `${prefix}/api/users`,
    UPDATE_USER: (id) => `${prefix}/api/users/${id}`,
    DELETE_USER: (id) => `${prefix}/api/users/${id}`,

    /** History */
    GET_HISTORY: (id) => `${prefix}/api/users/history/${id}`,
    CREATE_HISTORY: (id) => `${prefix}/api/users/history/${id}`,
    DELETE_HISTORY: (id) => `${prefix}/api/users/history/${id}`,

    /** Metals */
    GET_METALS: (userId) => `${prefix}/api/users/${userId}/metals`,
    UPDATE_METALS: (userId) => `${prefix}/api/users/${userId}/metals/update`,
    RESET_METALS: (userId) => `${prefix}/api/users/${userId}/metals/reset`,

    /** Ring Sizes */
    GET_RING_SIZES: (userId) => `${prefix}/api/users/${userId}/ring-sizes`,
    UPDATE_RING_SIZES: (userId) => `${prefix}/api/users/${userId}/ring-sizes/update`,
    RESET_RING_SIZES: (userId) => `${prefix}/api/users/${userId}/ring-sizes/reset`,

    /** Defaults */
    GET_DEFAULT_METALS: `${prefix}/api/defaults/metals`,
    GET_DEFAULT_RING_SIZES: `${prefix}/api/defaults/ring-sizes`,
};

export default URL;