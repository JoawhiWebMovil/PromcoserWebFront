<template>
  <div>
    <div class="botones-editar-eliminar">
      <q-btn
        @click="abrirFormularioCreacion"
        label="Crear Personal"
        class="crear-personal-button"
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
    <table v-if="personals.length > 0" class="personals-table">
      <thead>
        <tr>
          <th>Id</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Rol</th>
          <th>DNI</th>
          <th>Telefono</th>
          <th>Correo Electronico</th>
          <th>Direccion</th>
          <th>F. Ingerso</th>
          <th>F. Nacimiento</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="personal in personals"
          :key="personal.idPersonal"
          @click="seleccionarPersonal(personal)"
        >
          <td>{{ personal.idPersonal }}</td>
          <td>{{ personal.nombre }}</td>
          <td>{{ personal.apellido }}</td>
          <td>{{ personal.descripcionRol }}</td>
          <td>{{ personal.dni }}</td>
          <td>{{ personal.telefono }}</td>
          <td>{{ personal.correoElectronico }}</td>
          <td>{{ personal.direccion }}</td>
          <td>{{ personal.fechaIngreso }}</td>
          <td>{{ personal.fechaNacimiento }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="personalSeleccionado" class="personal-seleccionado">
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
          {{ esNuevoPersonal ? "Crear Personal" : "Editar Personal" }}
        </h2>
        <form @submit.prevent="guardarCambios">
          <label for="opciones">Seleccione un Rol:</label>
          <select id="opciones" v-model="personalTemporal.idRol">
            <option v-for="rol in rols" :key="rol.idRol" :value="rol.idRol">
              {{ rol.descripcionRol }}
            </option>
          </select>

          <label for="nombre">Nombre:</label>
          <input id="nombre" v-model="personalTemporal.nombre" type="text" />

          <label for="apellido">Apellido:</label>
          <input
            id="apellido"
            v-model="personalTemporal.apellido"
            type="text"
          />

          <label for="dni">DNI:</label>
          <input id="dni" v-model="personalTemporal.dni" type="text" />

          <label for="telefono">Telefono:</label>
          <input
            id="telefono"
            v-model="personalTemporal.telefono"
            type="text"
          />

          <label for="correoElectronico">Correo Electronico:</label>
          <input
            id="correoElectronico"
            v-model="personalTemporal.correoElectronico"
            type="text"
          />

          <label for="direccion">Direccion:</label>
          <input
            id="direccion"
            v-model="personalTemporal.direccion"
            type="text"
          />

          <label for="fechaIngreso">Fecha Ingreso:</label>
          <input
            id="fechaIngreso"
            v-model="personalTemporal.fechaIngreso"
            type="text"
          />

          <label for="fechaNacimiento">Fecha Nacimiento:</label>
          <input
            id="fechaNacimiento"
            v-model="personalTemporal.fechaNacimiento"
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
          personal?
        </div>
      </q-card-section>

      <q-card-actions>
        <q-btn flat label="No" @click="cancelarEdicion" color="secondary" />
        <q-btn flat label="Sí" @click="eliminarPersonal" color="negative" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import {
  getAllPersonalsActive,
  getAllPersonalsInactive,
  updatePersonal,
  createPersonal,
  deactivate,
  activate,
} from "../../../services/RegistroDataRepository/personalService";

import { getAllRolsActive } from "../../../services/RegistroDataRepository/rolService";

export default {
  name: "PersonalInfo",

  setup() {
    const personals = ref([]);
    const personalSeleccionado = ref(null);
    const personalTemporal = reactive({});
    const mostrarFormulario = ref(false);
    const esNuevoPersonal = ref(false);
    const mostrarDialogoEliminar = ref(false); // Variable para controlar el pop-up
    const mostrarActivos = ref(true);
    const rols = ref([]);

    const obtenerRols = async () => {
      try {
        rols.value = await getAllRolsActive();
      } catch (error) {
        console.error("Error al obtener la información de las rols:", error);
      }
    };

    const obtenerPersonals = async () => {
      try {
        if (mostrarActivos.value) {
          personals.value = await getAllPersonalsActive();
        } else {
          personals.value = await getAllPersonalsInactive();
        }
      } catch (error) {
        console.error(
          "Error al obtener la información de los personals:",
          error
        );
      }
    };

    const seleccionarPersonal = (personal) => {
      personalSeleccionado.value = personal;
      esNuevoPersonal.value = false;
    };

    const abrirFormularioCreacion = () => {
      personalSeleccionado.value = null;
      Object.assign(personalTemporal, {
        idRol: 0,
        descripcionRol: "",
        nombre: "",
        apellido: "",
        dni: "",
        telefono: "",
        correoElectronico: "",
        direccion: "",
        fechaIngreso: "",
        fechaNacimiento: "",
        estado: true,
      });
      esNuevoPersonal.value = true;
      mostrarFormulario.value = true;
    };

    const abrirFormularioEdicion = () => {
      if (personalSeleccionado.value) {
        Object.assign(personalTemporal, { ...personalSeleccionado.value });
        esNuevoPersonal.value = false;
        mostrarFormulario.value = true;
      }
    };

    const guardarCambios = async () => {
      try {
        delete personalTemporal.descripcionRol;
        if (esNuevoPersonal.value) {
          const { idPersonal, ...entidadSinId } = personalTemporal; // Quitar campo ID
          await createPersonal(entidadSinId);
        } else {
          await updatePersonal(personalTemporal);
        }
        personalSeleccionado.value = false;
        await obtenerPersonals();
      } catch (error) {
        console.error("Error al guardar los cambios:", error);
      } finally {
        mostrarFormulario.value = false;
      }
    };

    const cancelarEdicion = () => {
      personalSeleccionado.value = false;
      mostrarFormulario.value = false;
      mostrarDialogoEliminar.value = false;
    };

    const eliminarPersonal = async () => {
      try {
        if (personalSeleccionado.value) {
          if (mostrarActivos.value) {
            await deactivate(personalSeleccionado.value.idPersonal);
          } else {
            await activate(personalSeleccionado.value.idPersonal);
          }
          await obtenerPersonals();
          personalSeleccionado.value = false;
        }
      } catch (error) {
        console.error("Error al eliminar el personal:", error);
      } finally {
        mostrarDialogoEliminar.value = false;
      }
    };

    const onToggleChange = (value) => {
      obtenerPersonals();
      personalSeleccionado.value = false;
    };

    onMounted(() => {
      obtenerPersonals();
      obtenerRols();
    });

    return {
      personals,
      personalSeleccionado,
      personalTemporal,
      mostrarFormulario,
      esNuevoPersonal,
      mostrarDialogoEliminar, // Pasar la variable al template
      seleccionarPersonal,
      abrirFormularioCreacion,
      abrirFormularioEdicion,
      guardarCambios,
      cancelarEdicion,
      eliminarPersonal,
      mostrarActivos,
      onToggleChange,
      deactivate,
      activate,
      getAllRolsActive,
      obtenerRols,
      rols,
    };
  },
};
</script>

<style scoped>
.personals-table {
  width: 80%;
  margin-top: 70px;
  border-collapse: collapse;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-left: auto;
  margin-right: auto;
}

.personals-table th,
.personals-table td {
  padding: 12px;
  text-align: left;
}

.personals-table th {
  background-color: #1e3a8a;
  color: white;
  font-size: 16px;
}

.personals-table td {
  background-color: #f9fafb;
  color: #333;
  font-size: 14px;
}

.personals-table tr:nth-child(even) td {
  background-color: #e5e7eb;
}

.personals-table tr:hover td {
  background-color: #e0e7ff;
}

.personals-table td {
  border-bottom: 1px solid #ddd;
}

.personal-seleccionado {
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

.crear-personal-button {
  margin-left: 8%;
  margin-top: 20px;
  padding: 10px 20px;
}
</style>
