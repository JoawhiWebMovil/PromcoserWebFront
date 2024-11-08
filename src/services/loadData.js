import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 1000,
});

export const loadData = async () => {
  try {
    const response = await apiClient.get('/data');
    return response.data; 
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    throw error;
  }
};
