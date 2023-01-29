import axios from 'axios';
const BASE_URL = 'https://localhost:7045/';

export default axios.create({
    baseURL: BASE_URL 
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'https://localhost:3000'},
    withCredentials: true 
});