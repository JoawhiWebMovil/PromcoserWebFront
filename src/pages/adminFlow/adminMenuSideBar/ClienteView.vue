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
              @click="eliminarCliente(cliente)"
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
  </div>
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
    const clienteSeleccionado = ref(null);
    const clienteTemporal = reactive({});
    const mostrarFormulario = ref(false);
    const esNuevoCliente = ref(false);
    const mostrarDialogoEliminar = ref(false); // Variable para controlar el pop-up
    const mostrarActivos = ref(true);

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

    const seleccionarCliente = (cliente) => {
      clienteSeleccionado.value = cliente;
      esNuevoCliente.value = false;
    };

    const abrirFormularioCreacion = () => {
      clienteSeleccionado.value = null;
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

    const guardarCambios = async () => {
      try {
        if (esNuevoCliente.value) {
          const { idCliente, ...entidadSinId } = clienteTemporal; // Quitar campo ID
          console.log("Crear nuevo cliente", entidadSinId);
          await createCliente(entidadSinId);
        } else {
          await updateCliente(clienteTemporal);
        }
        clienteSeleccionado.value = false;
        await obtenerClientes();
      } catch (error) {
        console.error("Error al guardar los cambios:", error);
      } finally {
        mostrarFormulario.value = false;
      }
    };

    const cancelarEdicion = () => {
      clienteSeleccionado.value = false;
      mostrarFormulario.value = false;
      mostrarDialogoEliminar.value = false;
    };

    const eliminarCliente = async (cliente) => {
      try {
        if (mostrarActivos.value) {
          await deactivate(cliente.idCliente);
        } else {
          await activate(cliente.idCliente);
        }
        await obtenerClientes();
      } catch (error) {
        console.error("Error al eliminar el cliente:", error);
      }
    };

    const onToggleChange = (value) => {
      obtenerClientes();
      clienteSeleccionado.value = false;
    };

    onMounted(() => {
      obtenerClientes();
    });

    return {
      clientes,
      clienteSeleccionado,
      clienteTemporal,
      mostrarFormulario,
      esNuevoCliente,
      mostrarDialogoEliminar, // Pasar la variable al template
      seleccionarCliente,
      abrirFormularioCreacion,
      abrirFormularioEdicion,
      guardarCambios,
      cancelarEdicion,
      eliminarCliente,
      mostrarActivos,
      onToggleChange,
      deactivate,
      activate,
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
