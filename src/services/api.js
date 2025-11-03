import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com/',
  timeout: 5000,
});

export const getUsers = async () => {
  const res = await api.get('/users');
  return res.data;
};

export default api;
