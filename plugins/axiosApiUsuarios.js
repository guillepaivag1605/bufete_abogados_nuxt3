import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
    const defaultUrl = process.env.NODE_ENV === 'production' ? 
    'https://southamerica-east1-consultoria-legal-dev.cloudfunctions.net/service_usuario' : 
    'http://127.0.0.1:5001/consultoria-legal-dev/southamerica-east1/service_usuario'

    const apiUsuario = axios.create({ baseURL: defaultUrl })
    // nuxtApp.vueApp.provide('apiUsuario', apiUsuario)
    nuxtApp.provide('apiUsuario', apiUsuario)
})