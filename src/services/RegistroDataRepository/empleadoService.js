import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 2000,
});

export async function getInfo(nombre, apellido) {
  try {
    const response = await apiClient.post('/empleado/info', {
      nombre,
      apellido
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener información del empleado:', error);
    throw error;
  }
}

export const getAllEmpleados = async () => {
  try {
    const response = await apiClient.get('/empleados');
    return response.data;
  } catch (error) {
    console.error('Error al obtener la información de los empleados:', error);
    throw error;
  }
};
