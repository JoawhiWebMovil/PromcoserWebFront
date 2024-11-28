<template>
  <q-layout view="lHh Lpr lFf">
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

        <q-toolbar-title> Bienvenido Joaquin </q-toolbar-title>

        <div>Codigo: 21100165</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Registro de Datos </q-item-label>

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
import { ref } from "vue";
import EssentialLink from "src/components/MenuSidebar.vue";

defineOptions({
  name: "MainLayout",
});

const linksList = [
  {
    title: "Empleados",
    caption: "quasar.dev",
    icon: "school",
    link: "/empleados",
  },
  {
    title: "Maquinaria",
    caption: "quasar.dev",
    icon: "school",
    link: "/empleados",
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
