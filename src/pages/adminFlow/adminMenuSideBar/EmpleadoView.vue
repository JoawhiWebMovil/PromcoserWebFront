<template>
  <div>
    <table v-if="empleados.length > 0" class="empleados-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Edad</th>
          <th>Fecha de Nacimiento</th>
          <th>Rol del Empleado</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="empleado in empleados" :key="empleado.id" @click="seleccionarEmpleado(empleado)">
          <td>{{ empleado.nombre }}</td>
          <td>{{ empleado.apellido }}</td>
          <td>{{ empleado.edad }}</td>
          <td>{{ empleado.fechaNacimiento }}</td>
          <td>{{ empleado.rolEmpleado }}</td>
        </tr>
      </tbody>
    </table>

    <div v-else>
      <p>No hay empleados disponibles</p>
    </div>

    <div v-if="empleadoSeleccionado" class="empleado-seleccionado">
      <p><strong>Empleado Seleccionado:</strong> {{ empleadoSeleccionado.nombre }}</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getAllEmpleados } from '../../../services/RegistroDataRepository/empleadoService';

export default {
  name: 'EmpleadoInfo',

  setup() {
    const empleados = ref([]);
    const empleadoSeleccionado = ref(null); 

    const obtenerEmpleados = async () => {
      try {
        empleados.value = await getAllEmpleados();
      } catch (error) {
        console.error('Error al obtener la información de los empleados:', error);
      }
    };

    const seleccionarEmpleado = (empleado) => {
      empleadoSeleccionado.value = empleado;
    };

    onMounted(() => {
      obtenerEmpleados();
    });

    return {
      empleados,
      empleadoSeleccionado,
      obtenerEmpleados,
      seleccionarEmpleado,
    };
  },
};
</script>

<style scoped>
.empleados-table {
  width: 80%; 
  margin-top: 70px;
  border-collapse: collapse;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-left: auto;
  margin-right: auto;
}

.empleados-table th,
.empleados-table td {
  padding: 12px;
  text-align: left;
}

.empleados-table th {
  background-color: #1E3A8A;
  color: white;
  font-size: 16px;
}

.empleados-table td {
  background-color: #f9fafb;
  color: #333;
  font-size: 14px;
}

.empleados-table tr:nth-child(even) td {
  background-color: #e5e7eb;
}

.empleados-table tr:hover td {
  background-color: #e0e7ff;
}

.empleados-table td {
  border-bottom: 1px solid #ddd;
}

.empleado-seleccionado {
  margin-top: 50px;
  font-size: 18px;
  text-align: center;
}
</style>
