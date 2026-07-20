import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'


import Homeview from './views/Homeview.vue'
import Usuariosview from './views/Usuariosview.vue'
import Inquilinoview from './views/Inquilinoview.vue'
import Serviciosview from './views/Serviciosview.vue'
import Sucursalview from './views/Sucursalview.vue'
import NotFoundview from './views/NotFoundview.vue'
import Ubicacionview from './views/Ubicacionview.vue'

import './assets/main.css'
import App from './App.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Homeview, meta: { title: 'Inicio' } },
        { path: '/Usuarios', component: Usuariosview, meta: { title: 'Usuarios' } },
        { path: '/Inquilinos', component: Inquilinoview, meta: { title: 'Inquilinos' } },
        { path: '/Servicios', component: Serviciosview, meta: { title: 'Servicios' } },
        { path: '/Sucursal', component: Sucursalview, meta: { title: 'Sucursales' } },
        { path: '/Ubicacion', component: Ubicacionview, meta: { title: 'Ubicaciones' } },
        { path: '/:pathMatch(.*)*', component: NotFoundview } // No tiene meta.title, se ignorará automáticamente
    ]
})

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.mount('#app');