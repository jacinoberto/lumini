import axios from "axios";

const api = axios.create({
    baseURL: 'https://api-lumini.onrender.com/api/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export default api;