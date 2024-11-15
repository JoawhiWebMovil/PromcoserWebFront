<template>
  <div>
    <div class="botones-editar-eliminar">
      <q-btn
        @click="abrirFormularioCreacion"
        label="Crear Maquinaria"
        class="crear-maquinaria-button"
        color="primary"
      />
      <q-toggle
        v-model="mostrarActivos"
        label="Estado"
        color="primary"
        class="activo-toggle"
        left-label
        @update:model-value="onToggleChange"
      />
    </div>
    <table v-if="maquinarias.length > 0" class="maquinarias-table">
      <thead>
        <tr>
          <th>Id</th>
          <th>Marca</th>
          <th>Placa</th>
          <th>Modelo</th>
          <th>Horometro Compra</th>
          <th>Horometro Actual</th>
          <th>Tipo</th>
          <th>Año</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="maquinaria in maquinarias"
          :key="maquinaria.idMaquinaria"
          @click="seleccionarMaquinaria(maquinaria)"
        >
          <td>{{ maquinaria.idMaquinaria }}</td>
          <td>{{ maquinaria.nombreMarca }}</td>
          <td>{{ maquinaria.placa }}</td>
          <td>{{ maquinaria.modelo }}</td>
          <td>{{ maquinaria.horometroCompra }}</td>
          <td>{{ maquinaria.horometroActual }}</td>
          <td>{{ maquinaria.tipoMaquinaria }}</td>
          <td>{{ maquinaria.anoFabricacion }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="maquinariaSeleccionado" class="maquinaria-seleccionado">
      <div class="botones-editar-eliminar">
        <q-btn
          @click="abrirFormularioEdicion"
          label="Editar Datos:"
          color="primary"
          class="editar-button"
        />
        <q-btn
          @click="mostrarDialogoEliminar = true"
          :label="mostrarActivos ? 'Desactivar' : 'Activar'"
          color="negative"
          class="eliminar-button"
        />
      </div>
    </div>

    <div v-if="mostrarFormulario" class="modal-overlay">
      <div class="modal-content">
        <h2>
          {{ esNuevoMaquinaria ? "Crear Maquinaria" : "Editar Maquinaria" }}
        </h2>
        <form @submit.prevent="guardarCambios">
          <label for="opciones">Seleccione una Marca:</label>
          <select id="opciones" v-model="maquinariaTemporal.idMarca">
            <option
              v-for="marca in marcas"
              :key="marca.idMarca"
              :value="marca.idMarca"
            >
              {{ marca.nombreMarca }}
            </option>
          </select>

          <label for="placa">Placa:</label>
          <input id="placa" v-model="maquinariaTemporal.placa" type="text" />

          <label for="modelo">Modelo:</label>
          <input id="modelo" v-model="maquinariaTemporal.modelo" type="text" />

          <label for="horometroCompra">Horometro Compra:</label>
          <input
            id="horometroCompra"
            v-model="maquinariaTemporal.horometroCompra"
            type="text"
          />

          <label for="horometroActual">Horometro Actual:</label>
          <input
            id="horometroActual"
            v-model="maquinariaTemporal.horometroActual"
            type="text"
          />

          <label for="tipoMaquinaria">Tipo:</label>
          <input
            id="tipoMaquinaria"
            v-model="maquinariaTemporal.tipoMaquinaria"
            type="text"
          />

          <label for="anoFabricacion">Año Fabricacion:</label>
          <input
            id="anoFabricacion"
            v-model="maquinariaTemporal.anoFabricacion"
            type="text"
          />

          <button type="submit">Guardar</button>
          <button type="button" @click="cancelarEdicion">Cancelar</button>
        </form>
      </div>
    </div>
  </div>
  <q-dialog v-model="mostrarDialogoEliminar">
    <q-card>
      <q-card-section class="q-pt-none">
        <div class="text-h6">
          ¿Estás seguro de {{ mostrarActivos ? "desactivar" : "activar" }} esta
          maquinaria?
        </div>
      </q-card-section>

      <q-card-actions>
        <q-btn flat label="No" @click="cancelarEdicion" color="secondary" />
        <q-btn flat label="Sí" @click="eliminarMaquinaria" color="negative" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import {
  getAllMaquinariasActive,
  getAllMaquinariasInactive,
  updateMaquinaria,
  createMaquinaria,
  deactivate,
  activate,
} from "../../../services/RegistroDataRepository/maquinariaService";

import { getAllMarcasActive } from "../../../services/RegistroDataRepository/marcaService";

export default {
  name: "MaquinariaInfo",

  setup() {
    const maquinarias = ref([]);
    const maquinariaSeleccionado = ref(null);
    const maquinariaTemporal = reactive({});
    const mostrarFormulario = ref(false);
    const esNuevoMaquinaria = ref(false);
    const mostrarDialogoEliminar = ref(false); // Variable para controlar el pop-up
    const mostrarActivos = ref(true);
    const marcas = ref([]);

    const obtenerMarcas = async () => {
      try {
        marcas.value = await getAllMarcasActive();
        console.log(marcas.value);
      } catch (error) {
        console.error("Error al obtener la información de las marcas:", error);
      }
    };

    const obtenerMaquinarias = async () => {
      try {
        if (mostrarActivos.value) {
          maquinarias.value = await getAllMaquinariasActive();
        } else {
          maquinarias.value = await getAllMaquinariasInactive();
        }
      } catch (error) {
        console.error(
          "Error al obtener la información de los maquinarias:",
          error
        );
      }
    };

    const seleccionarMaquinaria = (maquinaria) => {
      maquinariaSeleccionado.value = maquinaria;
      esNuevoMaquinaria.value = false;
    };

    const abrirFormularioCreacion = () => {
      maquinariaSeleccionado.value = null;
      Object.assign(maquinariaTemporal, {
        idMarca: 0,
        nombreMarca: "",
        modelo: "",
        placa: "",
        horometroActual: 0,
        horometroCompra: 0,
        tipoMaquinaria: "",
        anoFabricacion: 0,
        estado: true,
      });
      esNuevoMaquinaria.value = true;
      mostrarFormulario.value = true;
    };

    const abrirFormularioEdicion = () => {
      if (maquinariaSeleccionado.value) {
        Object.assign(maquinariaTemporal, { ...maquinariaSeleccionado.value });
        esNuevoMaquinaria.value = false;
        mostrarFormulario.value = true;
      }
    };

    const guardarCambios = async () => {
      try {
        delete maquinariaTemporal.nombreMarca;
        if (esNuevoMaquinaria.value) {
          const { idMaquinaria, ...entidadSinId } = maquinariaTemporal; // Quitar campo ID
          console.log("Crear nuevo maquinaria", entidadSinId);
          await createMaquinaria(entidadSinId);
        } else {
          await updateMaquinaria(maquinariaTemporal);
        }
        maquinariaSeleccionado.value = false;
        await obtenerMaquinarias();
      } catch (error) {
        console.error("Error al guardar los cambios:", error);
      } finally {
        mostrarFormulario.value = false;
      }
    };

    const cancelarEdicion = () => {
      console.log(maquinariaTemporal);
      maquinariaSeleccionado.value = false;
      mostrarFormulario.value = false;
      mostrarDialogoEliminar.value = false;
    };

    const eliminarMaquinaria = async () => {
      try {
        if (maquinariaSeleccionado.value) {
          if (mostrarActivos.value) {
            await deactivate(maquinariaSeleccionado.value.idMaquinaria);
          } else {
            await activate(maquinariaSeleccionado.value.idMaquinaria);
          }
          await obtenerMaquinarias();
          maquinariaSeleccionado.value = false;
        }
      } catch (error) {
        console.error("Error al eliminar el maquinaria:", error);
      } finally {
        mostrarDialogoEliminar.value = false;
      }
    };

    const onToggleChange = (value) => {
      obtenerMaquinarias();
      maquinariaSeleccionado.value = false;
    };

    onMounted(() => {
      obtenerMaquinarias();
      obtenerMarcas();
    });

    return {
      maquinarias,
      maquinariaSeleccionado,
      maquinariaTemporal,
      mostrarFormulario,
      esNuevoMaquinaria,
      mostrarDialogoEliminar, // Pasar la variable al template
      seleccionarMaquinaria,
      abrirFormularioCreacion,
      abrirFormularioEdicion,
      guardarCambios,
      cancelarEdicion,
      eliminarMaquinaria,
      mostrarActivos,
      onToggleChange,
      deactivate,
      activate,
      getAllMarcasActive,
      obtenerMarcas,
      marcas,
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
  background-color: #1e3a8a;
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

.maquinaria-seleccionado {
  margin-top: 50px;
  font-size: 18px;
  text-align: left;
}

.botones-editar-eliminar {
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
  font-size: 18px;
  text-align: left;
}

.editar-button {
  margin-left: 8%;
  width: 20%;
}

.activo-toggle {
  margin-right: 8%;
}

.eliminar-button {
  margin-right: 8%;
  width: 20%;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 500px;
  max-width: 90%;
}

.modal-content label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.modal-content select,
.modal-content input {
  width: calc(100% - 20px);
  padding: 8px;
  margin-bottom: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-content button {
  margin-right: 10px;
}

body.modal-open {
  overflow: hidden;
}

.crear-maquinaria-button {
  margin-left: 8%;
  margin-top: 20px;
  padding: 10px 20px;
}
</style>
