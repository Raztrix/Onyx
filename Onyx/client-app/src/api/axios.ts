import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api'; // port for docker

export default axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});
