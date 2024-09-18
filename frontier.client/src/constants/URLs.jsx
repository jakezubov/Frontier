const prefix = 'https://localhost:5221'

const URL = {
    /** User */
    GET_ALL_USERS: `${prefix}/api/users`,
    GET_USER: (userId) => `${prefix}/api/users/${userId}`,
    CREATE_USER: `${prefix}/api/users/create`,
    UPDATE_USER: (userId) => `${prefix}/api/users/${userId}/update`,
    UPDATE_PASSWORD: (userId) => `${prefix}/api/users/${userId}/update/password`,
    DELETE_USER: (userId) => `${prefix}/api/users/${userId}/delete`,
    SWITCH_ADMIN: (userId) => `${prefix}/api/users/${userId}/admin`,
    LOGIN_UPDATES: (userId) => `${prefix}/api/users/${userId}/login`,
    LOGOUT_UPDATES: (userId) => `${prefix}/api/users/${userId}/logout`,

    /** Validation */
    VALIDATE_USER: `${prefix}/api/users/validate`,
    CHECK_EMAIL: (email) => `${prefix}/api/users/check-email/${email}`,
    VERIFY_EMAIL: (email) => `${prefix}/api/users/verify-email/${email}`,
    UNVERIFY_EMAIL: (email) => `${prefix}/api/users/unverify-email/${email}`,

    /** History */
    GET_HISTORY: (userId) => `${prefix}/api/users/${userId}/history`,
    CREATE_HISTORY: (userId) => `${prefix}/api/users/${userId}/history/create`,
    DELETE_HISTORY: (userId) => `${prefix}/api/users/${userId}/history/delete`,

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
    UPDATE_DEFAULT_METALS: `${prefix}/api/defaults/metals/update`,
    UPDATE_DEFAULT_RING_SIZES: `${prefix}/api/defaults/ring-sizes/update`,
    RESET_DEFAULT_METALS: `${prefix}/api/defaults/metals/default`,
    RESET_DEFAULT_RING_SIZES: `${prefix}/api/defaults/ring-sizes/default`,

    /** Misc */
    GENERATE_OBJECT_ID: `${prefix}/api/defaults/generate-id`,
} 

export default URL;