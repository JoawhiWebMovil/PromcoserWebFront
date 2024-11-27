<template>
  <q-layout view="lHh lpR lFf">
    <!-- Header -->
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> Buen día, {{ username }} </q-toolbar-title>
        <div
          class="q-gutter-sm"
          style="display: flex; align-items: center; justify-content: flex-end"
        >
          <div class="code-text" style="font-size: 16px; font-weight: 500">
            Código: 21100165
          </div>
          <q-btn
            v-if="!isOnHomePage"
            flat
            dense
            round
            icon="home"
            aria-label="Home"
            @click="goToHome"
            style="margin-left: 10px"
          />
          <!-- Botón de Logout -->
          <q-btn
            flat
            dense
            round
            icon="logout"
            aria-label="Logout"
            @click="logout"
            style="margin-left: 10px"
          />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Sidebar -->
    <q-drawer v-model="leftDrawerOpen" bordered overlay>
      <q-list>
        <q-item-label header>
          Registro de Datos
          <q-btn
            flat
            dense
            round
            icon="arrow_back"
            class="float-right"
            @click="toggleLeftDrawer"
          />
        </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <!-- Main Page Container -->
    <q-page-container>
      <!-- Imagen grande al inicio, solo si estamos en la página de inicio -->
      <div v-if="isOnHomePage" class="hero-image">
        <img src="src/assets/logoPromcoser.png" alt="Imagen de empresa" />
      </div>
      <!-- Nueva imagen entre el título y las cards -->
      <div v-if="isOnHomePage" class="middle-image">
        <img src="src/assets/maquinaria.jpg" alt="Imagen adicional" />
      </div>

      <!-- Mostrar información estática en la página de inicio -->

      <div v-if="isOnHomePage" class="company-info">
        <h2 class="centered-title">Información de la Empresa</h2>

        <!-- Card de Clientes Activos -->
        <div style="display: flex; justify-content: center; gap: 20px">
          <q-card
            class="q-mb-md"
            :style="{
              maxWidth: '300px',
              margin: '20px auto',
              backgroundColor: '#e3f2fd',
              border: '2px solid #ff5252',
            }"
          >
            <q-card-section>
              <div
                class="text-h6"
                style="text-align: center; font-weight: bold"
              >
                Clientes Activos
              </div>
              <div
                class="q-mt-md"
                style="text-align: center; font-size: 24px; font-weight: 600"
              >
                {{ clientCount }}
              </div>
            </q-card-section>
          </q-card>

          <!-- Card de Clientes Inactivos -->
          <q-card
            class="q-mb-md"
            :style="{
              maxWidth: '300px',
              margin: '20px auto',
              backgroundColor: '#e3f2fd',
              border: '2px solid #ff5252',
            }"
          >
            <q-card-section>
              <div
                class="text-h6"
                style="text-align: center; font-weight: bold"
              >
                Clientes Inactivos
              </div>
              <div
                class="q-mt-md"
                style="text-align: center; font-size: 24px; font-weight: 600"
              >
                {{ inactiveClientCount }}
              </div>
            </q-card-section>
          </q-card>

          <!-- Card de Maquinaria Activa -->
          <q-card
            class="q-mb-md"
            :style="{
              maxWidth: '300px',
              margin: '20px auto',
              backgroundColor: '#e3f2fd',
              border: '2px solid #ff5252',
            }"
          >
            <q-card-section>
              <div
                class="text-h6"
                style="text-align: center; font-weight: bold"
              >
                Maquinaria Activa
              </div>
              <div
                class="q-mt-md"
                style="text-align: center; font-size: 24px; font-weight: 600"
              >
                {{ machineryActiveCount }}
              </div>
            </q-card-section>
          </q-card>

          <!-- Card de Maquinaria Inactiva -->
          <q-card
            class="q-mb-md"
            :style="{
              maxWidth: '300px',
              margin: '20px auto',
              backgroundColor: '#e3f2fd',
              border: '2px solid #ff5252',
            }"
          >
            <q-card-section>
              <div
                class="text-h6"
                style="text-align: center; font-weight: bold"
              >
                Maquinaria Inactiva
              </div>
              <div
                class="q-mt-md"
                style="text-align: center; font-size: 24px; font-weight: 600"
              >
                {{ machineryInactiveCount }}
              </div>
            </q-card-section>
          </q-card>

          <!-- Card de Personal Activo -->
          <q-card
            class="q-mb-md"
            :style="{
              maxWidth: '300px',
              margin: '20px auto',
              backgroundColor: '#e3f2fd',
              border: '2px solid #ff5252',
            }"
          >
            <q-card-section>
              <div
                class="text-h6"
                style="text-align: center; font-weight: bold"
              >
                Personal Activo
              </div>
              <div
                class="q-mt-md"
                style="text-align: center; font-size: 24px; font-weight: 600"
              >
                {{ personnelActiveCount }}
              </div>
            </q-card-section>
          </q-card>

          <!-- Card de Personal Inactivo -->
          <q-card
            class="q-mb-md"
            :style="{
              maxWidth: '300px',
              margin: '20px auto',
              backgroundColor: '#e3f2fd',
              border: '2px solid #ff5252',
            }"
          >
            <q-card-section>
              <div
                class="text-h6"
                style="text-align: center; font-weight: bold"
              >
                Personal Inactivo
              </div>
              <div
                class="q-mt-md"
                style="text-align: center; font-size: 24px; font-weight: 600"
              >
                {{ personnelInactiveCount }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="info-general">
        <div v-if="isOnHomePage" class="company-info1">
          <h2 class="centered-title">Valores de la Empresa</h2>

          <!-- Contenedor para dos columnas -->
          <q-row
            class="q-gutter-md"
            style="display: flex; justify-content: center"
          >
            <!-- Columna para los valores de la empresa -->
            <q-col cols="12" sm="6">
              <q-card
                class="q-mb-md"
                :style="{
                  maxWidth: '300px',
                  margin: '20px auto',
                  backgroundColor: '#e3f2fd',
                  border: '2px solid #ff5252',
                }"
              >
                <q-card-section>
                  <div
                    class="text-h6"
                    style="text-align: center; font-weight: bold"
                  >
                    Calidad
                  </div>
                  <div style="text-align: center; font-size: 16px">
                    Brindar siempre la mejor calidad a nuestros clientes es
                    nuestra prioridad.
                  </div>
                </q-card-section>
              </q-card>

              <q-card
                class="q-mb-md"
                :style="{
                  maxWidth: '300px',
                  margin: '20px auto',
                  backgroundColor: '#e3f2fd',
                  border: '2px solid #ff5252',
                }"
              >
                <q-card-section>
                  <div
                    class="text-h6"
                    style="text-align: center; font-weight: bold"
                  >
                    Compromiso
                  </div>
                  <div style="text-align: center; font-size: 16px">
                    Nos comprometemos a cumplir con los plazos y requisitos
                    acordados.
                  </div>
                </q-card-section>
              </q-card>

              <q-card
                class="q-mb-md"
                :style="{
                  maxWidth: '300px',
                  margin: '20px auto',
                  backgroundColor: '#e3f2fd',
                  border: '2px solid #ff5252',
                }"
              >
                <q-card-section>
                  <div
                    class="text-h6"
                    style="text-align: center; font-weight: bold"
                  >
                    Liderazgo
                  </div>
                  <div style="text-align: center; font-size: 16px">
                    Lideramos el mercado peruano en la ejecución de obras de
                    ingeniería
                  </div>
                </q-card-section>
              </q-card>
            </q-col>

            <!-- Columna para los correos de los contactos de la empresa -->
            <q-col cols="12" sm="6">
              <q-card
                class="q-mb-md"
                :style="{
                  maxWidth: '300px',
                  margin: '20px auto',
                  backgroundColor: '#e3f2fd',
                  border: '2px solid #ff5252',
                }"
              >
                <q-card-section>
                  <div
                    class="text-h6"
                    style="text-align: center; font-weight: bold"
                  >
                    Trabajo en equipo
                  </div>
                  <div style="text-align: center; font-size: 16px">
                    Fomentamos la colaboración y el apoyo mutuo, donde cada
                    miembro aporta su talento y habilidades para lograr
                    objetivos comunes.
                  </div>
                </q-card-section>
              </q-card>

              <q-card
                class="q-mb-md"
                :style="{
                  maxWidth: '300px',
                  margin: '20px auto',
                  backgroundColor: '#e3f2fd',
                  border: '2px solid #ff5252',
                }"
              >
                <q-card-section>
                  <div
                    class="text-h6"
                    style="text-align: center; font-weight: bold"
                  >
                    Innovación
                  </div>
                  <div style="text-align: center; font-size: 16px">
                    Promovemos un ambiente donde la creatividad y las nuevas
                    ideas son siempre bienvenidas.
                  </div>
                </q-card-section>
              </q-card>
            </q-col>
          </q-row>
        </div>

        <div v-if="isOnHomePage" class="company-info2">
          <h2 class="centered-title">Contactos</h2>

          <!-- Contenedor para dos columnas -->
          <!-- Contenedor para dos columnas -->
          <q-row
            class="q-gutter-md"
            style="display: flex; justify-content: center"
          >
            <!-- Columna para los valores de la empresa -->
            <q-col cols="12" sm="6">
              <q-card
                class="q-mb-md"
                :style="{
                  maxWidth: '300px',
                  margin: '20px auto',
                  backgroundColor: '#e3f2fd',
                  border: '2px solid #ff5252',
                }"
              >
                <q-card-section>
                  <div
                    class="text-h6"
                    style="text-align: center; font-weight: bold"
                  >
                    Mantenimiento
                  </div>
                  <div style="text-align: center; font-size: 16px">
                    manten@promcoser.com
                  </div>
                </q-card-section>
              </q-card>

              <q-card
                class="q-mb-md"
                :style="{
                  maxWidth: '300px',
                  margin: '20px auto',
                  backgroundColor: '#e3f2fd',
                  border: '2px solid #ff5252',
                }"
              >
                <q-card-section>
                  <div
                    class="text-h6"
                    style="text-align: center; font-weight: bold"
                  >
                    Comercial
                  </div>
                  <div style="text-align: center; font-size: 16px">
                    comercial@promcoser.com
                  </div>
                </q-card-section>
              </q-card>

              <q-card
                class="q-mb-md"
                :style="{
                  maxWidth: '300px',
                  margin: '20px auto',
                  backgroundColor: '#e3f2fd',
                  border: '2px solid #ff5252',
                }"
              >
                <q-card-section>
                  <div
                    class="text-h6"
                    style="text-align: center; font-weight: bold"
                  >
                    Inventario
                  </div>
                  <div style="text-align: center; font-size: 16px">
                    inventario@promcoser.com
                  </div>
                </q-card-section>
              </q-card>
            </q-col>
            <q-col cols="12" sm="6">
              <q-card
                class="q-mb-md"
                :style="{
                  maxWidth: '300px',
                  margin: '20px auto',
                  backgroundColor: '#e3f2fd',
                  border: '2px solid #ff5252',
                }"
              >
                <q-card-section>
                  <div
                    class="text-h6"
                    style="text-align: center; font-weight: bold"
                  >
                    Contacto RR.HH
                  </div>
                  <div style="text-align: center; font-size: 16px">
                    rrhh@promcoser.com
                  </div>
                </q-card-section>
              </q-card>

              <q-card
                class="q-mb-md"
                :style="{
                  maxWidth: '300px',
                  margin: '20px auto',
                  backgroundColor: '#e3f2fd',
                  border: '2px solid #ff5252',
                }"
              >
                <q-card-section>
                  <div
                    class="text-h6"
                    style="text-align: center; font-weight: bold"
                  >
                    Soporte Técnico
                  </div>
                  <div style="text-align: center; font-size: 16px">
                    soporte@promcoser.com
                  </div>
                </q-card-section>
              </q-card>
            </q-col>
          </q-row>
        </div>
      </div>
    </q-page-container>
    <router-view />
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getInfoGeneralResumen } from "src/services/RegistroDataRepository/infoGeneral.js"; // Importamos la función del servicio
import EssentialLink from "src/components/MenuSidebar.vue";

// Estado para almacenar la cantidad de clientes activos, inactivos, maquinaria y personal
const clientCount = ref(0);
const inactiveClientCount = ref(0);
const machineryActiveCount = ref(0);
const machineryInactiveCount = ref(0);
const personnelActiveCount = ref(0);
const personnelInactiveCount = ref(0);

// Función para obtener los datos generales
const fetchClientData = async () => {
  try {
    const data = await getInfoGeneralResumen(); // Llamada al servicio para obtener los datos generales
    clientCount.value = data.cliente.activo; // Asignar la cantidad de clientes activos
    inactiveClientCount.value = data.cliente.inactivo; // Asignar la cantidad de clientes inactivos

    // Asignar la cantidad de maquinaria activa e inactiva
    machineryActiveCount.value = data.maquinaria.activo;
    machineryInactiveCount.value = data.maquinaria.inactivo;

    // Asignar la cantidad de personal activo e inactivo
    personnelActiveCount.value = data.personal.activo;
    personnelInactiveCount.value = data.personal.inactivo;
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
};

// Llamar a la función cuando el componente se monta
onMounted(() => {
  fetchClientData();
});

// Datos de la sesión
const router = useRouter();
const route = useRoute();
const leftDrawerOpen = ref(false);

// Computed para verificar si estamos en la página de inicio
const isOnHomePage = computed(() => route.path === "/homeAdmin");

function goToHome() {
  router.push({ path: "/homeAdmin" });
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function logout() {
  // Lógica adicional, como limpiar datos de sesión
  router.push("/"); // Redirige a la página de login
}

// Lista de enlaces del menú
const linksList = [
  { title: "Personal", icon: "group", link: "/homeAdmin/personal" },
  { title: "Maquinaria", icon: "construction", link: "/homeAdmin/maquinaria" },
  { title: "Cliente", icon: "business", link: "/homeAdmin/cliente" },
  { title: "Rol", icon: "security", link: "/homeAdmin/rol" },
  {
    title: "Lugar de Trabajo",
    icon: "location_on",
    link: "/homeAdmin/lugarTrabajo",
  },
  { title: "Marca", icon: "directions_car", link: "/homeAdmin/marca" },
];
</script>

<style scoped>
.hero-image {
  text-align: center;
  margin-top: 20px;
}

.hero-image img {
  max-width: 70%;
  height: auto;
}

.middle-image {
  margin-top: 30px;
  text-align: center;
}

.middle-image img {
  max-width: 55%;
  height: auto;
  margin-bottom: 20px;
}

.centered-title {
  text-align: center;
  font-size: 50px;
  font-weight: bold;
  color: #d32f2f;
}

.info-general {
  display: flex;
  justify-content: space-between;
}
.company-info2 {
  width: 50%;
}

.company-info1 {
  width: 50%;
}
</style>
