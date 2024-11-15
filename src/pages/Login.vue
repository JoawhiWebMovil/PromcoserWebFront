<template>
  <div class="full-screen-container flex flex-center">
    <div class="q-pa-md form-container">
      <q-card>
        <q-card-section class="q-pt-none text-center">
          <img
            src="../assets/logoLogin.png"
            alt="Logo de inicio de sesión"
            class="login-logo"
          />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-h6">Iniciar sesión</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="username"
            label="Nombre de usuario"
            placeholder="Ingresa tu usuario"
            filled
          />
          <q-input
            v-model="password"
            type="password"
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            filled
          />
        </q-card-section>

        <q-card-actions align="center">
          <q-btn
            @click="login"
            label="Iniciar sesión"
            color="primary"
            class="login-button"
          />
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginView",

  data() {
    return {
      username: "",
      password: "",
    };
  },

  methods: {
    login() {
      this.$router.push({
        path: "/homeAdmin",
        query: { username: this.username },
      });
      //   if (this.username === 'admin' && this.password === '1234') {
      //     this.$router.push('/homeAdmin')
      //   } else {
      //     this.$q.notify({
      //       color: 'negative',
      //       message: 'Usuario o contraseña incorrectos',
      //       icon: 'error'
      //     })
      //   }
    },
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
</style>
