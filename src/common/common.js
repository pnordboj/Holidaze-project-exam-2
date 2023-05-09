/* Frequently used Constants */

// API
export const API_URL = 'https://api.noroff.dev/api/v1/holidaze';
export const API_URL_PROFILES = `${API_URL}/profiles`;
export const API_URL_AUTH = `${API_URL}/auth`;
export const API_URL_VENUES = `${API_URL}/venues`;

export const fetcher = async (url, method, body) => {
    const token = localStorage.getItem('token');
    return await fetch(url, {
        method: method,
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    }).then((res) => {
        if (res.ok) {
            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem('token');
                
            }
        }
    });
}
