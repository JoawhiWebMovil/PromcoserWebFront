<template>
  <q-page class="bg-light-gray">

    <div v-if="data" class="content-wrapper">
      <h2 class="title">Información General de la Empresa</h2>
   
      <div class="section">
        <h3 class="section-title">Resumen de Proyectos</h3>
        <q-card class="info-card">
          <q-card-section>
            <p>Total Proyectos: <span class="value">{{ data.resumenProyectos.totalProyectos }}</span></p>
            <p>Proyectos Activos: <span class="value">{{ data.resumenProyectos.proyectosActivos }}</span></p>
            <p>Proyectos Completados: <span class="value">{{ data.resumenProyectos.proyectosCompletados }}</span></p>
            <p>Progreso General: <span class="value">{{ data.resumenProyectos.progresoGeneral }}</span></p>
          </q-card-section>
        </q-card>
      </div>

      <div class="section">
        <h3 class="section-title">Resumen Financiero</h3>
        <q-card class="info-card">
          <q-card-section>
            <p>Presupuesto Total: <span class="value">{{ formatCurrency(data.resumenFinanciero.presupuestoTotal) }}</span></p>
            <p>Gastos Actuales: <span class="value">{{ formatCurrency(data.resumenFinanciero.gastosActuales) }}</span></p>
            <p>Diferencia Presupuestal: <span class="value">{{ formatCurrency(data.resumenFinanciero.diferenciaPresupuestal) }}</span></p>
          </q-card-section>
        </q-card>
      </div>

      <div class="section">
        <h3 class="section-title">Estado de la Maquinaria</h3>
        <q-card class="info-card">
          <q-card-section>
            <p>Maquinarias Operativas: <span class="value">{{ data.estadoMaquinaria.maquinariasOperativas }}</span></p>
            <p>Maquinarias en Mantenimiento: <span class="value">{{ data.estadoMaquinaria.maquinariasEnMantenimiento }}</span></p>
            <p>Maquinarias Pendientes de Revisión: <span class="value">{{ data.estadoMaquinaria.maquinariasPendientesDeRevision }}</span></p>
          </q-card-section>
        </q-card>
      </div>

      <div class="section">
        <h3 class="section-title">Gestión de Personal</h3>
        <q-card class="info-card">
          <q-card-section>
            <p>Empleados Activos: <span class="value">{{ data.gestionPersonal.empleadosActivos }}</span></p>
            <div v-if="data.gestionPersonal.rolesCriticos.length">
              <h4 class="subsection-title">Roles Críticos:</h4>
              <ul>
                <li v-for="(rol, index) in data.gestionPersonal.rolesCriticos" :key="index">
                  {{ rol.rol }} - Vacantes: <span class="value">{{ rol.vacantes }}</span>
                </li>
              </ul>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="section">
        <h3 class="section-title">Alertas y Notificaciones</h3>
        <q-card class="info-card">
          <q-card-section>
            <ul>
              <li v-for="(alerta, index) in data.alertasYNotificaciones" :key="index">
                <strong class="alert-type">{{ alerta.tipo }}</strong>: {{ alerta.mensaje }}
              </li>
            </ul>
          </q-card-section>
        </q-card>
      </div>

      <div class="section">
        <h3 class="section-title">Documentos Recientes</h3>
        <q-card class="info-card">
          <q-card-section>
            <ul>
              <li v-for="(documento, index) in data.documentosRecientes" :key="index">
                {{ documento.nombre }} - Fecha: <span class="value">{{ documento.fecha }}</span>
              </li>
            </ul>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div v-else class="loading-message">
      <q-spinner color="primary" size="50px" />
      <p>Cargando datos...</p>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { loadData } from '../../../services/loadData'

const data = ref(null)

onMounted(async () => {
  try {
    data.value = await loadData()
    console.log('Datos cargados:', data.value)
  } catch (error) {
    console.error('Error al cargar los datos:', error)
  }
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value)
}
</script>

<style scoped>
.bg-light-gray {
  background-color: #f4f7fa;
}

.content-wrapper {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  text-align: center;
  color: #1e3a8a;
  margin-bottom: 30px;
}

.section {
  margin-bottom: 40px;
}

.section-title {
  color: #e53e3e; 
  font-size: 1.25rem;
  margin-bottom: 10px;
}

.info-card {
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
}

.q-card-section {
  padding: 20px;
}

.value {
  font-weight: bold;
  color: #2d3748;
}

.subsection-title {
  color: #2b6cb0; 
  font-size: 1.1rem;
}

.alert-type {
  color: #e53e3e;
}

.loading-message {
  text-align: center;
  padding-top: 50px;
}
</style>
