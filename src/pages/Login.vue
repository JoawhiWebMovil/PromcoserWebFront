<template>
  <div class="full-screen-container flex flex-center">
    <div class="q-pa-md form-container">
      <q-card>
        <!-- Logo -->
        <q-card-section class="q-pt-none text-center">
          <img
            src="../assets/logoLogin.png"
            alt="Logo de inicio de sesión"
            class="login-logo"
          />
        </q-card-section>

        <!-- Título -->
        <q-card-section class="q-pt-none">
          <div class="text-h6 text-center">Iniciar sesión</div>
        </q-card-section>

        <!-- Formulario -->
        <form @submit.prevent="logIn">
          <q-card-section>
            <!-- Campo de Usuario -->
            <q-input
              v-model="username"
              label="Nombre de usuario"
              type="text"
              placeholder="Ingresa tu usuario"
              autocomplete="username"
              filled
            />

            <!-- Campo de Contraseña con Ojito -->
            <q-input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              autocomplete="current-password"
              filled
              append
            >
              <template v-slot:append>
                <q-icon
                  :name="showPassword ? 'visibility' : 'visibility_off'"
                  class="cursor-pointer"
                  @click="togglePasswordVisibility"
                />
              </template>
            </q-input>
          </q-card-section>

          <!-- Botón de Inicio de Sesión -->
          <q-card-actions align="center">
            <q-btn
              type="submit"
              label="Iniciar sesión"
              color="primary"
              class="login-button"
            />
          </q-card-actions>
        </form>
      </q-card>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router"; // Importamos el enrutador
import { LogIn } from "../services/logInService";

export default {
  name: "LoginView",

  setup() {
    const username = ref("");
    const password = ref("");
    const showPassword = ref(false); // Estado para controlar la visibilidad de la contraseña
    const router = useRouter(); // Inicializamos el enrutador

    const logIn = async () => {
      if (!username.value.trim() || !password.value.trim()) {
        alert("Usuario y contraseña son requeridos.");
        return;
      }

      const datos = {
        usuario: username.value.trim().toLowerCase(),
        contrasena: password.value.trim().toLowerCase(),
      };

      try {
        const response = await LogIn(datos);
        localStorage.setItem("userData", JSON.stringify(response));
        if (response) {
          navigateToHome();
        } else {
          alert("Usuario o contraseña incorrectos.");
        }
      } catch (error) {
        alert("Hubo un problema con el login.");
      }
    };

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    const navigateToHome = () => {
      router.push("/homeAdmin");
    };

    return {
      username,
      password,
      showPassword,
      logIn,
      togglePasswordVisibility,
      navigateToHome,
    };
  },
};
</script>

<style scoped>
.full-screen-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("../assets/fondoLogin.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.form-container {
  max-width: 400px;
  width: 100%;
  margin: auto;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 10px;
}

.login-button {
  width: 70%;
}

.login-logo {
  width: 80%;
  margin-top: 20px;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
