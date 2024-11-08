const routes = [
  
  {
    path: '',
    component: () => import('src/pages/Login.vue'),
  },
  {
    path: '/homeAdmin',
    component: () => import('src/pages/adminFlow/HomeAdmin.vue'),
    children: [
      { path: '', component: () => import('src/pages/adminFlow/adminMenuSideBar/HomeView.vue') },  // HomeView como vista predeterminada
      { path: 'empleado', component: () => import('src/pages/adminFlow/adminMenuSideBar/EmpleadoView.vue') },
      { path: 'maquinaria', component: () => import('src/pages/adminFlow/adminMenuSideBar/MaquinariaView.vue') },
      { path: 'cliente', component: () => import('src/pages/adminFlow/adminMenuSideBar/ClienteView.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/errorManager/ErrorNotFound.vue')
  },
]

export default routes
