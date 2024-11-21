<template>
  <div>
    <div class="botones-editar-eliminar">
      <q-btn
        @click="abrirFormularioCreacion"
        label="Crear Cliente"
        class="crear-cliente-button"
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
    <table v-if="clientes.length > 0" class="clientes-table">
      <thead>
        <tr>
          <th>Id</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Razón Social</th>
          <th>RUC</th>
          <th>Teléfono</th>
          <th>Correo Electrónico</th>
          <th>Dirección</th>
          <th>Estado</th>
          <th>Editar</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cliente in clientes" :key="cliente.idCliente">
          <td>{{ cliente.idCliente }}</td>
          <td>{{ cliente.nombre }}</td>
          <td>{{ cliente.apellido }}</td>
          <td>{{ cliente.razonSocial }}</td>
          <td>{{ cliente.ruc }}</td>
          <td>{{ cliente.telefono }}</td>
          <td>{{ cliente.correoElectronico }}</td>
          <td>{{ cliente.direccion }}</td>
          <td>
            <q-btn
              @click="abrirDialogoEliminar(cliente)"
              :label="mostrarActivos ? 'Desactivar' : 'Activar'"
              color="negative"
              flat
            />
          </td>
          <td>
            <q-btn
              @click="abrirFormularioEdicion(cliente)"
              label="Editar"
              color="primary"
              flat
            />
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="mostrarFormulario" class="modal-overlay">
      <div class="modal-content">
        <h2>{{ esNuevoCliente ? "Crear Cliente" : "Editar Cliente" }}</h2>
        <form @submit.prevent="guardarCambios">
          <label for="nombre">Nombre:</label>
          <input id="nombre" v-model="clienteTemporal.nombre" type="text" />

          <label for="apellido">Apellido:</label>
          <input id="apellido" v-model="clienteTemporal.apellido" type="text" />

          <label for="razonSocial">Razón Social:</label>
          <input
            id="razonSocial"
            v-model="clienteTemporal.razonSocial"
            type="text"
          />

          <label for="ruc">RUC:</label>
          <input id="ruc" v-model="clienteTemporal.ruc" type="text" />

          <label for="correoElectronico">Correo Electrónico:</label>
          <input
            id="correoElectronico"
            v-model="clienteTemporal.correoElectronico"
            type="email"
          />

          <label for="telefono">Teléfono:</label>
          <input id="telefono" v-model="clienteTemporal.telefono" type="tel" />

          <label for="direccion">Dirección:</label>
          <input
            id="direccion"
            v-model="clienteTemporal.direccion"
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
          ¿Estás seguro de {{ mostrarActivos ? "desactivar" : "activar" }} este
          cliente?
        </div>
      </q-card-section>

      <q-card-actions>
        <q-btn flat label="No" @click="cancelarEdicion" color="secondary" />
        <q-btn flat label="Sí" @click="eliminarCliente" color="negative" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import {
  getAllClientesActive,
  getAllClientesInactive,
  updateCliente,
  createCliente,
  deactivate,
  activate,
} from "../../../services/RegistroDataRepository/clienteService";

export default {
  name: "ClienteInfo",

  setup() {
    const clientes = ref([]);
    const clienteTemporal = reactive({});
    const mostrarFormulario = ref(false);
    const esNuevoCliente = ref(false);
    const mostrarDialogoEliminar = ref(false); // Variable para controlar el pop-up
    const mostrarActivos = ref(true);
    const statusCliente = ref(false);
    const clienteSeleccionado = ref(null);

    const obtenerClientes = async () => {
      try {
        if (mostrarActivos.value) {
          clientes.value = await getAllClientesActive();
        } else {
          clientes.value = await getAllClientesInactive();
        }
      } catch (error) {
        console.error(
          "Error al obtener la información de los clientes:",
          error
        );
      }
    };

    const abrirFormularioCreacion = () => {
      Object.assign(clienteTemporal, {
        nombre: "",
        apellido: "",
        razonSocial: "",
        correoElectronico: "",
        telefono: "",
        direccion: "",
        ruc: "",
        estado: true,
      });
      esNuevoCliente.value = true;
      mostrarFormulario.value = true;
    };

    const abrirFormularioEdicion = (cliente) => {
      Object.assign(clienteTemporal, { ...cliente });
      esNuevoCliente.value = false;
      mostrarFormulario.value = true;
    };

    const abrirDialogoEliminar = (cliente) => {
      clienteSeleccionado.value = cliente; // Asigna el cliente seleccionado
      mostrarDialogoEliminar.value = true; // Muestra el diálogo
    };

    const guardarCambios = async () => {
      try {
        if (esNuevoCliente.value) {
          const { idCliente, ...entidadSinId } = clienteTemporal; // Quitar campo ID
          console.log("Crear nuevo cliente", entidadSinId);
          await createCliente(entidadSinId);
        } else {
          await updateCliente(clienteTemporal);
        }
        await obtenerClientes();
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

    const eliminarCliente = async () => {
      try {
        if (mostrarActivos.value) {
          await deactivate(clienteSeleccionado.value.idCliente);
        } else {
          await activate(clienteSeleccionado.value.idCliente);
        }
        await obtenerClientes();
      } catch (error) {
        console.error("Error al eliminar el cliente:", error);
      } finally {
        mostrarDialogoEliminar.value = false; // Cierra el diálogo
      }
    };

    const onToggleChange = (value) => {
      obtenerClientes();
    };

    onMounted(() => {
      obtenerClientes();
    });

    return {
      clientes,
      clienteTemporal,
      mostrarFormulario,
      esNuevoCliente,
      mostrarDialogoEliminar, // Pasar la variable al template
      abrirFormularioCreacion,
      abrirFormularioEdicion,
      guardarCambios,
      cancelarEdicion,
      eliminarCliente,
      mostrarActivos,
      onToggleChange,
      deactivate,
      activate,
      statusCliente,
      clienteSeleccionado,
      abrirDialogoEliminar,
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
  background-color: #1e3a8a;
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

.crear-cliente-button {
  margin-left: 8%;
  margin-top: 20px;
  padding: 10px 20px;
}
</style>
