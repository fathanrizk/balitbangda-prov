const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api';

async function request(method, path, { body, params } = {}) {
    let url = `${API_BASE}${path}`;

    if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                searchParams.append(key, String(value));
            }
        });
        const qs = searchParams.toString();
        if (qs) url += `?${qs}`;
    }

    const options = {
        method,
        headers: {},
        credentials: 'include',
    };

    if (body) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(body);
    }

    const res = await fetch(url, options);

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const error = new Error(errorData.error || `Request failed (${res.status})`);
        error.status = res.status;
        throw error;
    }

    return res.json();
}

export const api = {
    get: (path, params) => request('GET', path, { params }),
    post: (path, body) => request('POST', path, { body }),
    put: (path, body) => request('PUT', path, { body }),
    delete: (path) => request('DELETE', path),
};
