<template>
    <div>
      <table v-if="maquinarias.length > 0" class="maquinarias-table">
        <thead>
          <tr>
            <th>Placa</th>
            <th>Modelo</th>
            <th>Tipo</th>
            <th>Año de Fabricación</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="maquinaria in maquinarias" :key="maquinaria.placa" @click="seleccionarMaquinaria(maquinaria)">
            <td>{{ maquinaria.placa }}</td>
            <td>{{ maquinaria.modelo }}</td>
            <td>{{ maquinaria.tipo }}</td>
            <td>{{ maquinaria.anioFabricacion }}</td>
          </tr>
        </tbody>
      </table>
  
      <div v-else>
        <p>No hay maquinarias disponibles</p>
      </div>
  
      <div v-if="maquinariaSeleccionada" class="maquinaria-seleccionada">
        <p><strong>Maquinaria Seleccionada:</strong> {{ maquinariaSeleccionada.placa }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { getAllMaquinas } from '../../../services/RegistroDataRepository/maquinariaService';
  
  export default {
    name: 'MaquinariaInfo',
  
    setup() {
      const maquinarias = ref([]);
      const maquinariaSeleccionada = ref(null);
  
      const obtenerMaquinarias = async () => {
        try {
          maquinarias.value = await getAllMaquinas();
        } catch (error) {
          console.error('Error al obtener la información de las maquinarias:', error);
        }
      };
  
      const seleccionarMaquinaria = (maquinaria) => {
        maquinariaSeleccionada.value = maquinaria;
      };
  
      onMounted(() => {
        obtenerMaquinarias();
      });
  
      return {
        maquinarias,
        maquinariaSeleccionada,
        obtenerMaquinarias,
        seleccionarMaquinaria,
      };
    },
  };
  </script>
  
  <style scoped>
  .maquinarias-table {
    width: 80%; 
    margin-top: 70px;
    border-collapse: collapse;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-left: auto;
    margin-right: auto;
  }
  
  .maquinarias-table th,
  .maquinarias-table td {
    padding: 12px;
    text-align: left;
  }
  
  .maquinarias-table th {
    background-color: #1E3A8A;
    color: white;
    font-size: 16px;
  }
  
  .maquinarias-table td {
    background-color: #f9fafb;
    color: #333;
    font-size: 14px;
  }
  
  .maquinarias-table tr:nth-child(even) td {
    background-color: #e5e7eb;
  }
  
  .maquinarias-table tr:hover td {
    background-color: #e0e7ff;
  }
  
  .maquinarias-table td {
    border-bottom: 1px solid #ddd;
  }
  
  .maquinaria-seleccionada {
    margin-top: 50px;
    font-size: 18px;
    text-align: center;
  }
</style>
  