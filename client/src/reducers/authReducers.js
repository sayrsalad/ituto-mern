import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    ALL_USERS_REQUEST,
    ALL_USERS_SUCCESS,
    ALL_USERS_FAIL,
    ALL_USERS_DETAILS_REQUEST,
    ALL_USERS_DETAILS_SUCCESS,
    ALL_USERS_DETAILS_FAIL,
    UPDATE_ALL_USERS_REQUEST,
    UPDATE_ALL_USERS_SUCCESS,
    UPDATE_ALL_USERS_RESET,
    UPDATE_ALL_USERS_FAIL,
    CLEAR_ERRORS
} from '../constants/userConstants';

export const authReducer = (state = { user: {} }, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
        case REGISTER_REQUEST:
        case LOAD_USER_REQUEST:
            return {
                loading: true,
                isAuthenticated: false
            }

        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
        case LOAD_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload
            }

        case LOGOUT_SUCCESS:
            return {
                loading: false,
                isAuthenticated: false,
                user: null
            }

        case LOAD_USER_FAIL:
            return {
                loading: false,
                isAuthenticated: false,
                user: null,
                error: action.payload
            }

        case LOGOUT_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case LOGIN_FAIL:
        case REGISTER_FAIL:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}

export const allUsersReducer = (state = { users: [] }, action) => {
    switch (action.type) {

        case ALL_USERS_REQUEST:
            return {
                ...state,
                loading: true,
            }

        case ALL_USERS_SUCCESS:
            return {
                ...state,
                loading: false,
                users: action.payload
            }

        case ALL_USERS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}

export const allUsersUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_ALL_USERS_REQUEST:
            return {
                ...state,
                loading: true
            }

        case UPDATE_ALL_USERS_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: action.payload
            }
 
        case UPDATE_ALL_USERS_FAIL:
            return {
                ...state,
                error: action.payload
            }


        case UPDATE_ALL_USERS_RESET:
            return {
                ...state,
                isUpdated: false
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const allUsersDetailsReducer = (state = { user: {} }, action) => {
    switch (action.type) {

        case ALL_USERS_DETAILS_REQUEST:
            return {
                ...state,
                loading: true
            }

        case ALL_USERS_DETAILS_SUCCESS:
            return {
                loading: false,
                user: action.payload
            }

        case ALL_USERS_DETAILS_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}
