import axios from 'axios';

const BASE_URL = 'https://localhost:7225/api'; // Check your port!

export default axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});
