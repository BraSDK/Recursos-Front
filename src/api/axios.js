import axios from 'axios';

const api = axios.create({
    baseURL: 'http://sistema-rrhh.test/api', 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export default api;