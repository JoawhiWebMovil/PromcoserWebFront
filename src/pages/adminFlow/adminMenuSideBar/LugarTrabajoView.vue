<template>
  <div>
    <div class="botones-editar-eliminar">
      <q-btn
        @click="abrirFormularioCreacion"
        label="Crear Lugar"
        class="crear-lugar-button"
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
    <table v-if="lugars.length > 0" class="lugars-table">
      <thead>
        <tr>
          <th>Id</th>
          <th>Lugar</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="lugar in lugars"
          :key="lugar.idLugarTrabajo"
          @click="seleccionarLugar(lugar)"
        >
          <td>{{ lugar.idLugarTrabajo }}</td>
          <td>{{ lugar.descripcion }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="lugarSeleccionado" class="lugar-seleccionado">
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
        <h2>{{ esNuevoLugar ? "Crear Lugar" : "Editar Lugar" }}</h2>
        <form @submit.prevent="guardarCambios">
          <label for="nombre">Lugar:</label>
          <input id="nombre" v-model="lugarTemporal.descripcion" type="text" />

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
          ¿Estás seguro de {{ mostrarActivos ? "desactivar" : "activar" }} este
          lugar?
        </div>
      </q-card-section>

      <q-card-actions>
        <q-btn flat label="No" @click="cancelarEdicion" color="secondary" />
        <q-btn flat label="Sí" @click="eliminarLugar" color="negative" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import {
  getAllLugarsActive,
  getAllLugarsInactive,
  updateLugar,
  createLugar,
  deactivate,
  activate,
} from "../../../services/RegistroDataRepository/lugarTrabajoService";

export default {
  name: "LugarInfo",

  setup() {
    const lugars = ref([]);
    const lugarSeleccionado = ref(null);
    const lugarTemporal = reactive({});
    const mostrarFormulario = ref(false);
    const esNuevoLugar = ref(false);
    const mostrarDialogoEliminar = ref(false); // Variable para contlugarar el pop-up
    const mostrarActivos = ref(true);

    const obtenerLugars = async () => {
      try {
        if (mostrarActivos.value) {
          lugars.value = await getAllLugarsActive();
        } else {
          lugars.value = await getAllLugarsInactive();
        }
      } catch (error) {
        console.error("Error al obtener la información de los lugars:", error);
      }
    };

    const seleccionarLugar = (lugar) => {
      lugarSeleccionado.value = lugar;
      esNuevoLugar.value = false;
    };

    const abrirFormularioCreacion = () => {
      lugarSeleccionado.value = null;
      Object.assign(lugarTemporal, {
        descripcion: "",
        estado: true,
      });
      console.log("Crear nuevo lugar", lugarTemporal);
      esNuevoLugar.value = true;
      mostrarFormulario.value = true;
    };

    const abrirFormularioEdicion = () => {
      if (lugarSeleccionado.value) {
        Object.assign(lugarTemporal, { ...lugarSeleccionado.value });
        esNuevoLugar.value = false;
        mostrarFormulario.value = true;
      }
    };

    const guardarCambios = async () => {
      try {
        if (esNuevoLugar.value) {
          const { idLugarTrabajo, ...entidadSinId } = lugarTemporal; // Quitar campo ID
          console.log("Crear nuevo lugar", entidadSinId);
          await createLugar(entidadSinId);
        } else {
          await updateLugar(lugarTemporal);
        }
        lugarSeleccionado.value = false;
        await obtenerLugars();
      } catch (error) {
        console.error("Error al guardar los cambios:", error);
      } finally {
        mostrarFormulario.value = false;
      }
    };

    const cancelarEdicion = () => {
      lugarSeleccionado.value = false;
      mostrarFormulario.value = false;
      mostrarDialogoEliminar.value = false;
    };

    const eliminarLugar = async () => {
      try {
        if (lugarSeleccionado.value) {
          if (mostrarActivos.value) {
            await deactivate(lugarSeleccionado.value.idLugarTrabajo);
          } else {
            await activate(lugarSeleccionado.value.idLugarTrabajo);
          }
          await obtenerLugars();
          lugarSeleccionado.value = false;
        }
      } catch (error) {
        console.error("Error al eliminar el lugar:", error);
      } finally {
        mostrarDialogoEliminar.value = false;
      }
    };

    const onToggleChange = (value) => {
      obtenerLugars();
      lugarSeleccionado.value = false;
    };

    onMounted(() => {
      obtenerLugars();
    });

    return {
      lugars,
      lugarSeleccionado,
      lugarTemporal,
      mostrarFormulario,
      esNuevoLugar,
      mostrarDialogoEliminar, // Pasar la variable al template
      seleccionarLugar,
      abrirFormularioCreacion,
      abrirFormularioEdicion,
      guardarCambios,
      cancelarEdicion,
      eliminarLugar,
      mostrarActivos,
      onToggleChange,
      deactivate,
      activate,
    };
  },
};
</script>

<style scoped>
.lugars-table {
  width: 80%;
  margin-top: 70px;
  border-collapse: collapse;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-left: auto;
  margin-right: auto;
}

.lugars-table th,
.lugars-table td {
  padding: 12px;
  text-align: left;
}

.lugars-table th {
  background-color: #1e3a8a;
  color: white;
  font-size: 16px;
}

.lugars-table td {
  background-color: #f9fafb;
  color: #333;
  font-size: 14px;
}

.lugars-table tr:nth-child(even) td {
  background-color: #e5e7eb;
}

.lugars-table tr:hover td {
  background-color: #e0e7ff;
}

.lugars-table td {
  border-bottom: 1px solid #ddd;
}

.lugar-seleccionado {
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

.crear-lugar-button {
  margin-left: 8%;
  margin-top: 20px;
  padding: 10px 20px;
}
</style>
