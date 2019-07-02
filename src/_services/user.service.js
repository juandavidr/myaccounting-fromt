import { authHeader, handleResponse } from '@/_helpers';

export const userService = {
    getAll
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${process.env.REACT_APP_TEST_BACKEND_URL}/users`, requestOptions).then(handleResponse);
}