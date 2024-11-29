<template>
  <q-layout view="lHh lpR lFf" class="shadow-2 rounded-borders">
    <!-- Cabecera con color rojo -->
    <q-header elevated class="bg-red-6">
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
        <q-btn
          flat
          dense
          round
          icon="logout"
          aria-label="Logout"
          @click="logout"
          style="margin-left: 10px"
        />
        <q-btn
          flat
          dense
          round
          icon="settings"
          aria-label="settings"
          @click="goToSettings"
          style="margin-left: 10px"
        />
      </q-toolbar>
    </q-header>

    <!-- Drawer con efecto mini y responsive -->
    <q-drawer
      v-model="leftDrawerOpen"
      :mini="miniState"
      @mouseenter="miniState = false"
      @mouseleave="miniState = true"
      :width="200"
      :breakpoint="500"
      bordered
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
      show-if-above
      class="fixed-drawer"
    >
      <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
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

          <!-- Aquí se mantiene la funcionalidad de navegación -->
          <router-link
            v-for="link in linksList"
            :key="link.title"
            :to="link.link"
          >
            <q-item clickable v-ripple @click="toggleLeftDrawer">
              <q-item-section avatar>
                <!-- Icono con color rojo -->
                <q-icon :name="link.icon" class="text-red-6" />
              </q-item-section>
              <q-item-section>{{ link.title }}</q-item-section>
            </q-item>
          </router-link>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const userData = localStorage.getItem("userData");
const username = computed(() => {
  const parsedData = JSON.parse(userData);
  return `${parsedData.nombre} ${parsedData.apellido}`;
});
const leftDrawerOpen = ref(false);
const miniState = ref(true); // State to control mini-drawer effect
const router = useRouter();
const route = useRoute();

const linksList = [
  {
    title: "Personal",
    icon: "group",
    link: "/homeAdmin/personal",
  },
  {
    title: "Maquinaria",
    icon: "construction",
    link: "/homeAdmin/maquinaria",
  },
  {
    title: "Cliente",
    icon: "business",
    link: "/homeAdmin/cliente",
  },
  {
    title: "Rol",
    icon: "security",
    link: "/homeAdmin/rol",
  },
  {
    title: "Lugar de Trabajo",
    icon: "location_on",
    link: "/homeAdmin/lugarTrabajo",
  },
  {
    title: "Marca",
    icon: "directions_car",
    link: "/homeAdmin/marca",
  },
  {
    title: "Parte Diario",
    icon: "description",
    link: "/homeAdmin/parteDiario",
  },
];

const isOnHomePage = computed(() => route.path === "/homeAdmin");

function goToHome() {
  router.push({ path: "/homeAdmin" });
}

function goToSettings() {
  router.push({ path: "/homeAdmin/settings" });
}

function logout() {
  // Lógica adicional, como limpiar datos de sesión
  router.push("/"); // Redirige a la página de login
}
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style scoped>
/* Estilos adicionales */
.q-toolbar-title {
  font-size: 20px;
  font-weight: 700;
}

.q-item {
  transition: background-color 0.3s ease;
}

.q-item:hover {
  background-color: #e0e0e0;
}

.q-drawer {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.q-btn {
  transition: background-color 0.2s ease;
}

.q-btn:hover {
  background-color: #f1f1f1;
}

.fixed-drawer {
  position: fixed !important; /* Asegura que el drawer se quede fijo */
  top: 0; /* Alinea al top */
  left: 0; /* Alinea al lado izquierdo */
  height: 100vh; /* Asegura que el drawer ocupe toda la altura */
  z-index: 100; /* Asegura que el drawer esté encima del contenido */
}
</style>
