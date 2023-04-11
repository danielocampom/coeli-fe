import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/LoginView.vue'

Vue.use(VueRouter)

const ROLES = {
  SISTEMAS: 'SISTEMAS',
  ADMIN: 'ADMIN',
  USUARIOS: 'USUARIOS',
  CLIENTES: 'CLIENTES',
  DASHPROD: 'DASHPROD',
  LAVADORA: 'LAVADORA',
  // LAVADORA: 'LAVADORA',
  PRENDA: 'PRENDA',
  PROCESOLAVADO: 'PROCESO LAVADO',
  HISTORIALLAVADO: 'HISTORIAL LAVADO',
  ALMACENENTRADA: 'ALMACEN ENTRADA',
  CONFIRMAORDEN: 'CONFIRMA ORDEN',
  PROCESOORDEN: 'PROCESO ORDEN',
  ALMACENENTREGA: 'CLIENTES',
  CANCELACION: 'CANCELACION',
  ROLES: 'ROLES',
}

const routes = [
  
  {
    path: '/',
    name: '',
    component: login,
    meta: {requireAuth: false}

  },
  {
    path: '/login',
    name: 'login',
    component: login,
    meta: {requireAuth: false}

  },
  {
    path: '/comentLog',
    name: 'comentLog',
    component: () => import('../views/comentLogView.vue'),

    meta: {requireAuth: false}

  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: {requireAuth: true }
  },
  
  {
    path: '/dashboardAdmin',
    name: 'dashboardAdmin',
    component: () => import('../views/DashboardAdmin.vue'),
    meta: {requireAuth: true, roles: ROLES.SISTEMAS}
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: () => import('../views/UsuariosView.vue'),
    meta: {requireAuth: true, roles: ROLES.SISTEMAS}
  },
  {
    path: '/clientes',
    name: 'clientes',
    component: () => import('../views/ClientesView.vue'),
    meta: {requireAuth: true, roles: ROLES.SISTEMAS}
  },
  {
    path: '/lavadoras',
    name: 'lavadoras',
    component: () => import('../views/LavadorasView.vue'),
    meta: {requireAuth: true, roles: ROLES.SISTEMAS}
  },
  {
    path: '/tipoLavados',
    name: 'tipoLavados',
    component: () => import('../views/TipoLavadosView.vue'),
  LAVADORA: 'LAVADORA',
    meta: {requireAuth: true, roles: ROLES.SISTEMAS}
  },
  {
    path: '/prendas',
    name: 'prendas',
    component: () => import('../views/PrendasView.vue'),
    meta: {requireAuth: true, roles: ROLES.SISTEMAS}
  },
  {
    path: '/registroLavado',
    name: 'registroLavado',
    component: () => import('../views/registroLavadoView.vue'),
    meta: {requireAuth: true, roles: ROLES.SISTEMAS}
  },

  {
    path: '/entregas',
    name: 'entregas',
    component: () => import('../views/EntregaView.vue'),
    meta: {requireAuth: true, roles: ROLES.SISTEMAS}
  },
  {
    path: '/procesoPrendas',
    name: 'procesoPrendas',
    component: () => import('../views/procesoPrendas.vue'),
    meta: {requireAuth: true, roles: ROLES.SISTEMAS}
  },
  {
    path: '/llegada',
    name: 'llegada',
    component: () => import('../views/LlegadaView.vue'),
    meta: {requireAuth: true, roles: ROLES.SISTEMAS}
  },
  {
    path: '/ordenes',
    name: 'ordenes',
    component: () => import('../views/OrdenesView.vue'),
    meta: {requireAuth: true, roles: ROLES.SISTEMAS}
  },
  
  {
    path: '/canceladas',
    name: 'canceladas',
    component: () => import('../views/CanceladasView.vue'),
    meta: {requireAuth: true, roles: ROLES.SISTEMAS}
  },
  
  {
    path: '/roles',
    name: 'roles',
    component: () => import('../views/rolesView.vue'),
    meta: {requireAuth: true, roles: ROLES.SISTEMAS}
  },
  
  {
    path: '/access-denied',
    name: 'access-denied',
    component: () => import('../views/accessDeniedView.vue'),
    meta: {requireAuth: true}
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {
  
  if(to.name != 'login' && to.meta.requireAuth){
    if(router.app.$session.get('token')){
      next()
    }else{
      next({
        path: 'login',
        replace: true
      })
    }
  } else {
    next();
  }
   
  
  const rolesUsr = router.app.$session.get('roles')
  if(rolesUsr.some(role =>  to.meta.roles.includes(role))){
    next()
  }else{
    next({
      path: 'access-denied',
      replace: true
    })
  }


})

export default router
