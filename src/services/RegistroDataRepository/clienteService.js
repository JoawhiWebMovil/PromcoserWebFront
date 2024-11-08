import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 1000,
});

export async function getInfo(nombre, apellido) {
  try {
    const response = await apiClient.post('/cliente/info', {
      nombre,
      apellido
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener información del cliente:', error);
    throw error;
  }
}

export const getAllClientes = async () => {
  try {
    const response = await apiClient.get('/clientes');
    return response.data;
  } catch (error) {
    console.error('Error al obtener la información de los clientes:', error);
    throw error;
  }
};