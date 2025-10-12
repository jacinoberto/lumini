import axios from "axios";

const api = axios.create({
    baseURL: 'https://viacep.com.br/ws/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default async function getAddress(zipCode: string): Promise<any> {
    return api.get(`${zipCode}/json`);
};