<template>
  <div class="change-password-container">
    <h1 class="title">Cambio de Contraseña</h1>
    <div class="user-info">
      <p class="username">Usuario: {{ username }}</p>
    </div>
    <form @submit.prevent="handleChangePassword" class="form">
      <div class="form-group">
        <label for="current-password" class="label">Contraseña Actual</label>
        <input
          id="current-password"
          type="password"
          v-model="currentPassword"
          class="input"
          placeholder="Ingresa tu contraseña actual"
          required
        />
      </div>
      <div class="form-group">
        <label for="new-password" class="label">Nueva Contraseña</label>
        <input
          id="new-password"
          type="password"
          v-model="newPassword"
          class="input"
          placeholder="Ingresa tu nueva contraseña"
          required
        />
      </div>
      <div class="form-group">
        <label for="confirm-password" class="label"
          >Confirma Nueva Contraseña</label
        >
        <input
          id="confirm-password"
          type="password"
          v-model="confirmPassword"
          class="input"
          placeholder="Confirma tu nueva contraseña"
          required
        />
      </div>
      <button type="submit" class="button">Cambiar Contraseña</button>
    </form>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { changePassword } from "../../../services/RegistroDataRepository/personalService";

export default {
  name: "ChangePassword",
  setup() {
    // Obtener usuario desde localStorage
    const userData = ref(localStorage.getItem("userData"));
    const username = computed(() => {
      try {
        return JSON.parse(userData.value)?.username || "Invitado";
      } catch (error) {
        console.error("Error parsing user data:", error);
        return "Invitado";
      }
    });

    // Manejo de estado del formulario
    const currentPassword = ref("");
    const newPassword = ref("");
    const confirmPassword = ref("");
    const errorMessage = ref("");
    const successMessage = ref("");

    // Función para cambiar contraseña
    const handleChangePassword = async () => {
      if (
        !currentPassword.value ||
        !newPassword.value ||
        !confirmPassword.value
      ) {
        errorMessage.value = "Por favor, completa todos los campos.";
        successMessage.value = "";
        return;
      }

      if (newPassword.value !== confirmPassword.value) {
        errorMessage.value = "Las contraseñas no coinciden.";
        successMessage.value = "";
        return;
      }

      try {
        const response = await changePassword({
          Usuario: username.value,
          Contrasena: currentPassword.value,
          NewContrasena: newPassword.value,
        });

        successMessage.value = response || "Contraseña cambiada exitosamente.";
        errorMessage.value = "";

        // Limpiar los campos después de un cambio exitoso
        currentPassword.value = "";
        newPassword.value = "";
        confirmPassword.value = "";
      } catch (error) {
        errorMessage.value =
          error.response?.data?.message || "Error al cambiar la contraseña.";
        successMessage.value = "";
      }
    };

    return {
      username,
      currentPassword,
      newPassword,
      confirmPassword,
      errorMessage,
      successMessage,
      handleChangePassword,
    };
  },
};
</script>

<style scoped>
.change-password-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #ffffff;
  color: #333;
  border-radius: 10px;
  max-width: 400px;
  margin: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
}

.user-info {
  margin-bottom: 20px;
}

.username {
  font-size: 18px;
  font-weight: bold;
}

.form {
  width: 100%;
}

.form-group {
  margin-bottom: 15px;
}

.label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  margin-top: 15px;
}

.success-message {
  color: green;
  margin-top: 15px;
}
</style>
