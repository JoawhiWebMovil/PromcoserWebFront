<template>
  <div>
    <div class="botones-editar-eliminar">
      <q-btn
        @click="abrirFormularioCreacion"
        label="Crear Marca"
        class="crear-marca-button"
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
    <table v-if="marcas.length > 0" class="marcas-table">
      <thead>
        <tr>
          <th>Id</th>
          <th>Marca</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="marca in marcas"
          :key="marca.idMarca"
          @click="seleccionarMarca(marca)"
        >
          <td>{{ marca.idMarca }}</td>
          <td>{{ marca.nombreMarca }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="marcaSeleccionado" class="marca-seleccionado">
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
        <h2>{{ esNuevoMarca ? "Crear Marca" : "Editar Marca" }}</h2>
        <form @submit.prevent="guardarCambios">
          <label for="nombre">Marca:</label>
          <input id="nombre" v-model="marcaTemporal.nombreMarca" type="text" />

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
          marca?
        </div>
      </q-card-section>

      <q-card-actions>
        <q-btn flat label="No" @click="cancelarEdicion" color="secondary" />
        <q-btn flat label="Sí" @click="eliminarMarca" color="negative" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import {
  getAllMarcasActive,
  getAllMarcasInactive,
  updateMarca,
  createMarca,
  deactivate,
  activate,
} from "../../../services/RegistroDataRepository/marcaService";

export default {
  name: "MarcaInfo",

  setup() {
    const marcas = ref([]);
    const marcaSeleccionado = ref(null);
    const marcaTemporal = reactive({});
    const mostrarFormulario = ref(false);
    const esNuevoMarca = ref(false);
    const mostrarDialogoEliminar = ref(false); // Variable para contmarcaar el pop-up
    const mostrarActivos = ref(true);

    const obtenerMarcas = async () => {
      try {
        if (mostrarActivos.value) {
          marcas.value = await getAllMarcasActive();
        } else {
          marcas.value = await getAllMarcasInactive();
        }
      } catch (error) {
        console.error("Error al obtener la información de los marcas:", error);
      }
    };

    const seleccionarMarca = (marca) => {
      marcaSeleccionado.value = marca;
      esNuevoMarca.value = false;
    };

    const abrirFormularioCreacion = () => {
      marcaSeleccionado.value = null;
      Object.assign(marcaTemporal, {
        nombreMarca: "",
        estado: true,
      });
      esNuevoMarca.value = true;
      mostrarFormulario.value = true;
    };

    const abrirFormularioEdicion = () => {
      if (marcaSeleccionado.value) {
        Object.assign(marcaTemporal, { ...marcaSeleccionado.value });
        esNuevoMarca.value = false;
        mostrarFormulario.value = true;
      }
    };

    const guardarCambios = async () => {
      try {
        if (esNuevoMarca.value) {
          const { idMarca, ...entidadSinId } = marcaTemporal; // Quitar campo ID
          await createMarca(entidadSinId);
        } else {
          await updateMarca(marcaTemporal);
        }
        marcaSeleccionado.value = false;
        await obtenerMarcas();
      } catch (error) {
        console.error("Error al guardar los cambios:", error);
      } finally {
        mostrarFormulario.value = false;
      }
    };

    const cancelarEdicion = () => {
      marcaSeleccionado.value = false;
      mostrarFormulario.value = false;
      mostrarDialogoEliminar.value = false;
    };

    const eliminarMarca = async () => {
      try {
        if (marcaSeleccionado.value) {
          if (mostrarActivos.value) {
            await deactivate(marcaSeleccionado.value.idMarca);
          } else {
            await activate(marcaSeleccionado.value.idMarca);
          }
          await obtenerMarcas();
          marcaSeleccionado.value = false;
        }
      } catch (error) {
        console.error("Error al eliminar el marca:", error);
      } finally {
        mostrarDialogoEliminar.value = false;
      }
    };

    const onToggleChange = (value) => {
      obtenerMarcas();
      marcaSeleccionado.value = false;
    };

    onMounted(() => {
      obtenerMarcas();
    });

    return {
      marcas,
      marcaSeleccionado,
      marcaTemporal,
      mostrarFormulario,
      esNuevoMarca,
      mostrarDialogoEliminar, // Pasar la variable al template
      seleccionarMarca,
      abrirFormularioCreacion,
      abrirFormularioEdicion,
      guardarCambios,
      cancelarEdicion,
      eliminarMarca,
      mostrarActivos,
      onToggleChange,
      deactivate,
      activate,
    };
  },
};
</script>

<style scoped>
.marcas-table {
  width: 80%;
  margin-top: 70px;
  border-collapse: collapse;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-left: auto;
  margin-right: auto;
}

.marcas-table th,
.marcas-table td {
  padding: 12px;
  text-align: left;
}

.marcas-table th {
  background-color: #1e3a8a;
  color: white;
  font-size: 16px;
}

.marcas-table td {
  background-color: #f9fafb;
  color: #333;
  font-size: 14px;
}

.marcas-table tr:nth-child(even) td {
  background-color: #e5e7eb;
}

.marcas-table tr:hover td {
  background-color: #e0e7ff;
}

.marcas-table td {
  border-bottom: 1px solid #ddd;
}

.marca-seleccionado {
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

.crear-marca-button {
  margin-left: 8%;
  margin-top: 20px;
  padding: 10px 20px;
}
</style>
