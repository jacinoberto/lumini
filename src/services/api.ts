import axios from "axios";

const api = axios.create({
    baseURL: 'https://api-lumini.onrender.com/api/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('authToken');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            delete config.headers['Authorization'];
        }

        return config;
    },
    error => {
        console.error("Erro no interceptor de requisição Axios:", error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response && error.response.status === 401) {
            console.warn("Recebido erro 401. Deslogando usuário.");
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            localStorage.removeItem('barbershopId');
            // Remove o header padrão do Axios, caso exista
            delete api.defaults.headers.common['Authorization'];

            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);


export default api;