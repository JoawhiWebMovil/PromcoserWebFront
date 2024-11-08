<template>
  <div>
    <table v-if="clientes.length > 0" class="clientes-table">
      <thead>
        <tr>
          <th>Nombre Responsable</th>
          <th>Razón Social</th>
          <th>Ubicación</th>
          <th>Correo Electrónico</th>
          <th>Teléfono</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cliente in clientes" :key="cliente.id" @click="seleccionarCliente(cliente)">
          <td>{{ cliente.nombreResponsable }}</td>
          <td>{{ cliente.razonSocial }}</td>
          <td>{{ cliente.ubicacion }}</td>
          <td>{{ cliente.correoElectronico }}</td>
          <td>{{ cliente.telefono }}</td>
        </tr>
      </tbody>
    </table>

    <div v-else>
      <p>No hay clientes disponibles</p>
    </div>

    <div v-if="clienteSeleccionado" class="cliente-seleccionado">
      <p><strong>Cliente Seleccionado:</strong> {{ clienteSeleccionado.nombreResponsable }}</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getAllClientes } from '../../../services/RegistroDataRepository/clienteService'; // Asegúrate de tener este servicio

export default {
  name: 'ClienteInfo',

  setup() {
    const clientes = ref([]);
    const clienteSeleccionado = ref(null); 

    const obtenerClientes = async () => {
      try {
        clientes.value = await getAllClientes(); // Obtener clientes en vez de empleados
      } catch (error) {
        console.error('Error al obtener la información de los clientes:', error);
      }
    };

    const seleccionarCliente = (cliente) => {
      clienteSeleccionado.value = cliente;
    };

    onMounted(() => {
      obtenerClientes();
    });

    return {
      clientes,
      clienteSeleccionado,
      obtenerClientes,
      seleccionarCliente,
    };
  },
};
</script>

<style scoped>
.clientes-table {
  width: 80%; 
  margin-top: 70px;
  border-collapse: collapse;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-left: auto;
  margin-right: auto;
}

.clientes-table th,
.clientes-table td {
  padding: 12px;
  text-align: left;
}

.clientes-table th {
  background-color: #1E3A8A;
  color: white;
  font-size: 16px;
}

.clientes-table td {
  background-color: #f9fafb;
  color: #333;
  font-size: 14px;
}

.clientes-table tr:nth-child(even) td {
  background-color: #e5e7eb;
}

.clientes-table tr:hover td {
  background-color: #e0e7ff;
}

.clientes-table td {
  border-bottom: 1px solid #ddd;
}

.cliente-seleccionado {
  margin-top: 50px;
  font-size: 18px;
  text-align: center;
}
</style>
