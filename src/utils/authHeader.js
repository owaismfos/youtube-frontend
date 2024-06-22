const getAuthHeaders = (token) => {
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }
}

export default getAuthHeaders;