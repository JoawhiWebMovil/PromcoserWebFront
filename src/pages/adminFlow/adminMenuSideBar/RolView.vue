<template>
  <div>
    <div class="botones-editar-eliminar">
      <q-btn
        @click="abrirFormularioCreacion"
        label="Crear Rol"
        class="crear-rol-button"
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
    <table v-if="rols.length > 0" class="rols-table">
      <thead>
        <tr>
          <th>Id</th>
          <th>Rol</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="rol in rols" :key="rol.idRol" @click="seleccionarRol(rol)">
          <td>{{ rol.idRol }}</td>
          <td>{{ rol.descripcionRol }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="rolSeleccionado" class="rol-seleccionado">
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
        <h2>{{ esNuevoRol ? "Crear Rol" : "Editar Rol" }}</h2>
        <form @submit.prevent="guardarCambios">
          <label for="nombre">Rol:</label>
          <input id="nombre" v-model="rolTemporal.descripcionRol" type="text" />

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
          rol?
        </div>
      </q-card-section>

      <q-card-actions>
        <q-btn flat label="No" @click="cancelarEdicion" color="secondary" />
        <q-btn flat label="Sí" @click="eliminarRol" color="negative" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import {
  getAllRolsActive,
  getAllRolsInactive,
  updateRol,
  createRol,
  deactivate,
  activate,
} from "../../../services/RegistroDataRepository/rolService";

export default {
  name: "RolInfo",

  setup() {
    const rols = ref([]);
    const rolSeleccionado = ref(null);
    const rolTemporal = reactive({});
    const mostrarFormulario = ref(false);
    const esNuevoRol = ref(false);
    const mostrarDialogoEliminar = ref(false); // Variable para controlar el pop-up
    const mostrarActivos = ref(true);

    const obtenerRols = async () => {
      try {
        if (mostrarActivos.value) {
          rols.value = await getAllRolsActive();
        } else {
          rols.value = await getAllRolsInactive();
        }
      } catch (error) {
        console.error("Error al obtener la información de los rols:", error);
      }
    };

    const seleccionarRol = (rol) => {
      rolSeleccionado.value = rol;
      esNuevoRol.value = false;
    };

    const abrirFormularioCreacion = () => {
      rolSeleccionado.value = null;
      Object.assign(rolTemporal, {
        descripcionRol: "",
        estado: true,
      });
      esNuevoRol.value = true;
      mostrarFormulario.value = true;
    };

    const abrirFormularioEdicion = () => {
      if (rolSeleccionado.value) {
        Object.assign(rolTemporal, { ...rolSeleccionado.value });
        esNuevoRol.value = false;
        mostrarFormulario.value = true;
      }
    };

    const guardarCambios = async () => {
      try {
        if (esNuevoRol.value) {
          const { idRol, ...rolSinId } = rolTemporal; // Quitar campo ID
          await createRol(rolSinId);
        } else {
          await updateRol(rolTemporal);
        }
        rolSeleccionado.value = false;
        await obtenerRols();
      } catch (error) {
        console.error("Error al guardar los cambios:", error);
      } finally {
        mostrarFormulario.value = false;
      }
    };

    const cancelarEdicion = () => {
      rolSeleccionado.value = false;
      mostrarFormulario.value = false;
      mostrarDialogoEliminar.value = false;
    };

    const eliminarRol = async () => {
      try {
        if (rolSeleccionado.value) {
          if (mostrarActivos.value) {
            await deactivate(rolSeleccionado.value.idRol);
          } else {
            await activate(rolSeleccionado.value.idRol);
          }
          await obtenerRols();
          rolSeleccionado.value = false;
        }
      } catch (error) {
        console.error("Error al eliminar el rol:", error);
      } finally {
        mostrarDialogoEliminar.value = false;
      }
    };

    const onToggleChange = (value) => {
      obtenerRols();
      rolSeleccionado.value = false;
    };

    onMounted(() => {
      obtenerRols();
    });

    return {
      rols,
      rolSeleccionado,
      rolTemporal,
      mostrarFormulario,
      esNuevoRol,
      mostrarDialogoEliminar, // Pasar la variable al template
      seleccionarRol,
      abrirFormularioCreacion,
      abrirFormularioEdicion,
      guardarCambios,
      cancelarEdicion,
      eliminarRol,
      mostrarActivos,
      onToggleChange,
      deactivate,
      activate,
    };
  },
};
</script>

<style scoped>
.rols-table {
  width: 80%;
  margin-top: 70px;
  border-collapse: collapse;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-left: auto;
  margin-right: auto;
}

.rols-table th,
.rols-table td {
  padding: 12px;
  text-align: left;
}

.rols-table th {
  background-color: #1e3a8a;
  color: white;
  font-size: 16px;
}

.rols-table td {
  background-color: #f9fafb;
  color: #333;
  font-size: 14px;
}

.rols-table tr:nth-child(even) td {
  background-color: #e5e7eb;
}

.rols-table tr:hover td {
  background-color: #e0e7ff;
}

.rols-table td {
  border-bottom: 1px solid #ddd;
}

.rol-seleccionado {
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

.crear-rol-button {
  margin-left: 8%;
  margin-top: 20px;
  padding: 10px 20px;
}
</style>
