import axios from 'axios';

const client = axios.create({
  baseURL: 'http://192.168.1.38:8989',
});

export default client;
