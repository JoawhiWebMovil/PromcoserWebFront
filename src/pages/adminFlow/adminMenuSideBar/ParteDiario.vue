<template>
  <div>
    <div class="botones-editar-eliminar">
      <q-btn
        @click="abrirFormularioCreacion"
        label="Crear Parte Diario"
        class="crear-parteDiario-button"
        color="primary"
        icon="add_circle_outline"
      />
      <q-toggle
        v-model="mostrarActivos"
        label="Estado"
        color="green"
        class="activo-toggle"
        left-label
        @update:model-value="onToggleChange"
      />
    </div>
    <table v-if="parteDiarios.length > 0" class="parteDiarios-table">
      <thead>
        <tr>
          <th>Id</th>
          <th>Cliente</th>
          <th>Personal</th>
          <th>Maquinaria</th>
          <th>Lugar</th>
          <th>Horometro Inicio</th>
          <th>Horometro Final</th>
          <th>Cant. Petroleo</th>
          <th>Cant. Aceite</th>
          <th>Fecha</th>
          <th>Estado</th>
          <th>Editar</th>
          <th>Detalle</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="parteDiario in parteDiarios"
          :key="parteDiario.idParteDiario"
        >
          <td>{{ parteDiario.idParteDiario }}</td>
          <td>{{ parteDiario.razonSocial }}</td>
          <td>{{ parteDiario.personal }}</td>
          <td>{{ parteDiario.placa }}</td>
          <td>{{ parteDiario.descripcion }}</td>
          <td>{{ parteDiario.horometroInicio }}</td>
          <td>{{ parteDiario.horometroFinal }}</td>
          <td>{{ parteDiario.cantidadPetroleo }}</td>
          <td>{{ parteDiario.cantidadAceite }}</td>
          <td>{{ parteDiario.fecha }}</td>
          <td>
            <q-btn
              @click="abrirDialogoEliminar(parteDiario)"
              :label="mostrarActivos ? 'Desactivar' : 'Activar'"
              color="negative"
              flat
            />
          </td>
          <td>
            <q-btn
              @click="abrirFormularioEdicion(parteDiario)"
              label="Editar"
              color="primary"
              icon="edit"
              flat
            />
          </td>
          <td>
            <q-btn
              @click="abrirFormularioEdicion(parteDiario)"
              color="secondary"
              icon="description"
              flat
            />
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="mostrarFormulario" class="modal-overlay">
      <div class="modal-content">
        <h2>
          {{ esNuevoParteDiario ? "Crear Parte Diario" : "Editar ParteDiario" }}
        </h2>
        <form @submit.prevent="guardarCambios">
          <label for="opcionesCl">Seleccione un Cliente:</label>
          <select id="opcionesCl" v-model="parteDiarioTemporal.idCliente">
            <option
              v-for="cliente in clientes"
              :key="cliente.idCliente"
              :value="cliente.idCliente"
            >
              {{ cliente.razonSocial }}
            </option>
          </select>

          <label for="opcionesPe">Seleccione un Personal:</label>
          <select id="opcionesPe" v-model="parteDiarioTemporal.idPersonal">
            <option
              v-for="personal in personales"
              :key="personal.idPersonal"
              :value="personal.idPersonal"
            >
              {{ personal.nombre + " " + personal.apellido }}
            </option>
          </select>

          <label for="opcionesMa">Seleccione una Maquinaria:</label>
          <select id="opcionesMa" v-model="parteDiarioTemporal.idMaquinaria">
            <option
              v-for="maquinaria in maquinarias"
              :key="maquinaria.idMaquinaria"
              :value="maquinaria.idMaquinaria"
            >
              {{ maquinaria.placa }}
            </option>
          </select>

          <label for="opcionesLu">Seleccione un Lugar de Trabajo:</label>
          <select id="opcionesLu" v-model="parteDiarioTemporal.idLugarTrabajo">
            <option
              v-for="lugar in lugaresTrabajo"
              :key="lugar.idLugarTrabajo"
              :value="lugar.idLugarTrabajo"
            >
              {{ lugar.descripcion }}
            </option>
          </select>

          <label for="hrIni">Horometro Inicio:</label>
          <input
            id="hrIni"
            v-model="parteDiarioTemporal.horometroInicio"
            type="text"
          />

          <label for="hrFin">Horometro Final:</label>
          <input
            id="hrFin"
            v-model="parteDiarioTemporal.horometroFinal"
            type="text"
          />

          <label for="cantPetro">Cantidad Pretroleo:</label>
          <input
            id="cantPetro"
            v-model="parteDiarioTemporal.cantidadPetroleo"
            type="text"
          />

          <label for="cantAce">Cantidad Aceite:</label>
          <input
            id="cantAce"
            v-model="parteDiarioTemporal.cantidadAceite"
            type="text"
          />

          <label for="fechaParte">Fecha:</label>
          <input
            id="fechaParte"
            v-model="parteDiarioTemporal.fecha"
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
          parteDiario?
        </div>
      </q-card-section>

      <q-card-actions>
        <q-btn flat label="No" @click="cancelarEdicion" color="secondary" />
        <q-btn flat label="Sí" @click="eliminarParteDiario" color="negative" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import {
  getAllParteDiariosActive,
  getAllParteDiariosInactive,
  updateParteDiario,
  createParteDiario,
  deactivate,
  activate,
} from "../../../services/RegistroDataRepository/parteDiarioService";

import { getAllPersonalsActive } from "../../../services/RegistroDataRepository/personalService";
import { getAllMaquinariasActive } from "../../../services/RegistroDataRepository/maquinariaService";
import { getAllClientesActive } from "../../../services/RegistroDataRepository/clienteService";
import { getAllLugarsActive } from "../../../services/RegistroDataRepository/lugarTrabajoService";

export default {
  name: "ParteDiarioInfo",

  setup() {
    const parteDiarios = ref([]);
    const parteDiarioTemporal = reactive({});
    const mostrarFormulario = ref(false);
    const esNuevoParteDiario = ref(false);
    const mostrarDialogoEliminar = ref(false); // Variable para controlar el pop-up
    const mostrarActivos = ref(true);
    const clientes = ref([]);
    const maquinarias = ref([]);
    const personales = ref([]);
    const lugaresTrabajo = ref([]);
    const parteDiarioSeleccionado = ref(null);

    const obtenerClientes = async () => {
      try {
        clientes.value = await getAllClientesActive();
      } catch (error) {
        console.error("Error al obtener la información de los cliente:", error);
      }
    };
    const obtenerMaquinarias = async () => {
      try {
        maquinarias.value = await getAllMaquinariasActive();
      } catch (error) {
        console.error(
          "Error al obtener la información de las maquinas:",
          error
        );
      }
    };
    const obtenerLugares = async () => {
      try {
        lugaresTrabajo.value = await getAllLugarsActive();
      } catch (error) {
        console.error("Error al obtener la información de los lugares:", error);
      }
    };
    const obtenerPeronales = async () => {
      try {
        personales.value = await getAllPersonalsActive();
      } catch (error) {
        console.error("Error al obtener la información de el personal:", error);
      }
    };

    const obtenerParteDiarios = async () => {
      try {
        if (mostrarActivos.value) {
          parteDiarios.value = await getAllParteDiariosActive();
        } else {
          parteDiarios.value = await getAllParteDiariosInactive();
        }
      } catch (error) {
        console.error(
          "Error al obtener la información de los parteDiarios:",
          error
        );
      }
    };

    const abrirFormularioCreacion = () => {
      parteDiarioSeleccionado.value = null;
      Object.assign(parteDiarioTemporal, {
        idCliente: 0,
        idMaquinaria: 0,
        idLugarTrabajo: 0,
        idPersonal: 0,
        razonSocial: "",
        placa: "",
        descripcion: "",
        personal: "",
        horometroInicio: "",
        horometroFinal: "",
        cantidadPetroleo: "",
        cantidadAceite: "",
        firmas: "",
        serie: "",
        fecha: "",
        estado: true,
      });
      esNuevoParteDiario.value = true;
      mostrarFormulario.value = true;
    };

    const abrirFormularioEdicion = (parteDiario) => {
      Object.assign(parteDiarioTemporal, { ...parteDiario });
      esNuevoParteDiario.value = false;
      mostrarFormulario.value = true;
    };

    const abrirDialogoEliminar = (parteDiario) => {
      parteDiarioSeleccionado.value = parteDiario; // Asigna el cliente seleccionado
      mostrarDialogoEliminar.value = true; // Muestra el diálogo
    };

    const guardarCambios = async () => {
      try {
        if (esNuevoParteDiario.value) {
          const { idParteDiario, ...entidadSinId } = parteDiarioTemporal; // Quitar campo ID
          await createParteDiario(entidadSinId);
        } else {
          await updateParteDiario(parteDiarioTemporal);
        }
        await obtenerParteDiarios();
      } catch (error) {
        console.error("Error al guardar los cambios:", error);
      } finally {
        mostrarFormulario.value = false;
      }
    };

    const cancelarEdicion = () => {
      mostrarFormulario.value = false;
      mostrarDialogoEliminar.value = false;
    };

    const eliminarParteDiario = async () => {
      try {
        if (mostrarActivos.value) {
          await deactivate(parteDiarioSeleccionado.value.idParteDiario);
        } else {
          await activate(parteDiarioSeleccionado.value.idParteDiario);
        }
        await obtenerParteDiarios();
      } catch (error) {
        console.error("Error al eliminar el parteDiario:", error);
      } finally {
        mostrarDialogoEliminar.value = false;
      }
    };

    const onToggleChange = (value) => {
      obtenerParteDiarios();
    };

    onMounted(() => {
      obtenerParteDiarios();
      obtenerLugares();
      obtenerClientes();
      obtenerMaquinarias();
      obtenerPeronales();
    });

    return {
      parteDiarios,
      parteDiarioSeleccionado,
      parteDiarioTemporal,
      mostrarFormulario,
      esNuevoParteDiario,
      mostrarDialogoEliminar, // Pasar la variable al template
      abrirFormularioCreacion,
      abrirFormularioEdicion,
      guardarCambios,
      cancelarEdicion,
      eliminarParteDiario,
      mostrarActivos,
      onToggleChange,
      deactivate,
      activate,
      abrirDialogoEliminar,
      obtenerParteDiarios,
      obtenerLugares,
      obtenerClientes,
      obtenerMaquinarias,
      obtenerPeronales,
      clientes,
      maquinarias,
      personales,
      lugaresTrabajo,
    };
  },
};
</script>

<style scoped>
/* Estilos generales de la tabla de parteDiarioes */
.parteDiarios-table {
  width: 80%;
  margin-top: 40px;
  border-collapse: collapse;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-left: auto;
  margin-right: auto;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
}

/* Estilo para los encabezados de la tabla de parteDiarioes */
.parteDiarios-table th {
  background-color: #b91c1c; /* Rojo para el encabezado */
  color: white;
  font-size: 16px;
  text-transform: uppercase;
  padding: 12px;
  text-align: center;
}

/* Estilo para las celdas de la tabla de parteDiarioes */
.parteDiarios-table td {
  background-color: #f9fafb;
  color: #333;
  font-size: 14px;
  border-bottom: 1px solid #e2e8f0;
  padding: 12px;
  text-align: center;
}

/* Estilo para las filas alternadas en la tabla de parteDiarioes */
.parteDiarios-table tr:nth-child(even) td {
  background-color: #e5e7eb;
}

/* Estilo para el hover de las filas en la tabla de parteDiarioes */
.parteDiarios-table tr:hover td {
  background-color: #fddede; /* Rojo claro para hover */
}

/* Estilo para el cuadro de parteDiario seleccionado */
.parteDiario-seleccionado {
  margin-top: 50px;
  font-size: 18px;
  text-align: left;
}

/* Estilo para los botones de editar y eliminar */
.botones-editar-eliminar {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  font-size: 18px;
  text-align: left;
  align-items: center;
}

/* Estilo para los botones de editar y eliminar */
.editar-button,
.eliminar-button {
  padding: 12px 24px;
  background-color: #1e3a8a; /* Azul para los botones */
  color: white;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.editar-button:hover,
.eliminar-button:hover {
  background-color: #1d4ed8; /* Azul más oscuro para hover */
}

/* Estilo para el botón de crear parteDiario */
.crear-parteDiario-button {
  margin-left: 10%;
  margin-top: 20px;
  padding: 12px 24px;
  font-size: 16px;
  background-color: #e53e3e; /* Rojo para el botón de crear parteDiario */
  color: white;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.crear-parteDiario-button:hover {
  background-color: #c53a3a; /* Rojo más oscuro para hover */
}

/* Modal de Crear/Editar ParteDiario */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Fondo oscuro con opacidad */
  display: flex;
  justify-content: center; /* Centra el contenido horizontalmente */
  align-items: center; /* Centra el contenido verticalmente */
  z-index: 1000; /* Asegura que el modal esté encima de otros elementos */
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 12px; /* Bordes redondeados */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Sombra suave para dar profundidad */
  width: 80%;
  max-width: 1200px;
  margin: 0 auto; /* Centra el formulario horizontalmente */
  overflow-y: auto;
  display: flex;
  flex-direction: column; /* Hace que el contenido del formulario esté en columna */
  align-items: center;
}

.modal-content h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
  font-weight: 600;
  text-align: center; /* Centra el título */
}

/* Usamos Grid para dividir el formulario en 2 filas y 4 columnas */
.modal-content form {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 columnas con igual tamaño */
  gap: 20px;
  width: 100%; /* Asegura que el formulario ocupe todo el ancho */
}

/* Estilo para las etiquetas */
.modal-content label {
  display: block;
  font-weight: bold;
  font-size: 16px;
  color: #555;
  display: flex;
  align-items: center;
}

/* Estilo para los campos de entrada (select y input) */
.modal-content select,
.modal-content input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
}

/* Estilo para los botones dentro del formulario */
.modal-content button {
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  background-color: #e53e3e; /* Rojo para el botón */
  color: white;
  transition: background-color 0.3s ease;
}

/* Estilo para el toggle de estado activo */
.activo-toggle {
  margin-right: 8%;
  color: #af1712; /* Cambiar el color del texto o la etiqueta */
}

.activo-toggle .q-toggle__control {
  border: 2px solid #b91c1c; /* Cambiar el color del borde */
}

/* Para que los campos se ajusten bien en pantallas pequeñas */
@media (max-width: 768px) {
  .modal-content form {
    grid-template-columns: 1fr 1fr; /* En pantallas pequeñas, dos columnas */
  }
}

/* Para evitar el scroll cuando el modal esté abierto */
body.modal-open {
  overflow: hidden;
}
</style>
