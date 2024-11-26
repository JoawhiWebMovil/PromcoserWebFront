<template>
  <q-layout view="lHh lpR lFf">
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

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, defineOptions, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import EssentialLink from "src/components/MenuSidebar.vue";

defineOptions({
  name: "HomeAdmin",
  computed: {
    username() {
      return this.$route.query.username || "Admin";
    },
  },
});

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
];

const leftDrawerOpen = ref(false);
const router = useRouter();
const route = useRoute();

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
</script>

<style scoped>
.code-text {
  font-size: 16px;
  font-weight: 500;
}

.q-toolbar-title {
  font-size: 20px;
  font-weight: 700;
}
</style>
