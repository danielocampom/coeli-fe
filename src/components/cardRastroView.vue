<template>
        
    <b-card :title="dataRastreo.nombreCliente" :sub-title="dataRastreo.nombrePrenda">
        <v-row justify="space-between">
            <v-col cols="10">
                <strong>Fecha Inicio:</strong> {{ fecha(dataRastreo.fechaInicio) }}
                <br>
                <strong>Fecha Fin:</strong> {{ fecha(dataRastreo.fechaFin) }}
            </v-col>
            <v-col class="text-right" cols="2">
                <div class='badge bg-primary text-wrap float-start' >
                    {{ dataRastreo.estado }}
                </div>
            </v-col>
        </v-row>
        <br>
        <v-row>
            <v-col cols="4">
                <div class="badge bg-primary text-wrap float-end" v-if="dataRastreo.autorizacion">
                    Si
                </div>
                <div class="badge bg-danger text-wrap float-end" v-else>
                    No
                </div>
                <h6>Utilizo autorizacion:</h6>
            </v-col>
        </v-row>
        <h6 class="mt-1">Responsable: <strong>{{ dataRastreo.usuario ? nombreUs1 : '' }}</strong></h6>
        <label for="cantidad">Lavadora: <strong>{{ dataRastreo.lavadora ? lavadora : 'No se utilizo lavadora' }}</strong></label> <br>
        <label for="cantidad">Cantidad: <strong>{{dataRastreo.cantidad }}</strong></label> <br>
        <v-timeline  dense >
            <v-timeline-item  color="deep-purple lighten-1">
                <span slot="opposite">{{dataRastreo.pasoProceso.nombre}}</span>
                <v-card class="elevation-2">
                    <v-card-title class="text-h5">
                        {{dataRastreo.pasoProceso.nombre}}
                    </v-card-title>
                    <v-card-text>
                        <div class="mt-1">
                            <label for="descripcion">Descripcion: </label>
                            <strong>{{dataRastreo.pasoProceso.descripcion}}</strong>
                        </div>
                        <h6 class="mt-1">Responsable: <strong>{{ dataRastreo.pasoProceso.usuario ? nombreUs2 : '' }}</strong></h6>
                        <div class="mt-1">
                            <label for="tipoLavado">Tipo de Lavado: </label>                                    
                            <strong>
                                {{ dataRastreo.pasoProceso.idTipoLavado ? tipoLavado : "No aplica tipo de lavado" }} 
                            </strong>
                        </div>
                        <div class="mt-1">
                            <label for="tipoLavado">Programa de lavado: </label>                                    
                            
                                <ul v-if="dataRastreo.pasoProceso.idProgramaLavado">
                                    
                                    <li>
                                        Nombre: <strong >{{ programaLavado.nombre }}</strong>
                                    </li>
                                    <li>
                                        Descripcion: <strong >{{  programaLavado.descripcion }}</strong>
                                    </li>
                                    <li>
                                        cantidad Minima: <strong >{{ programaLavado.cantidadMinima }}</strong>
                                    </li>
                                    <li>
                                        cantidad Maxima: <strong >{{ programaLavado.cantidadMaxima }}</strong>
                                    </li>
                                </ul>
                            <strong v-else>
                                No aplica programa de lavado
                            </strong>
                        </div>
                    </v-card-text>
                </v-card>
            </v-timeline-item>
        </v-timeline>
    </b-card>
                    

</template>

<script>
import { refreshSession, fetchApi } from "@/service/service.js"
import moment from 'moment'

export default {
    name:"rastreoOrdenesView",
    props: {
        dataRastreo: Object,
    },
    data: () => ({
        nombreUs1: '',
        nombreUs2: '',
        lavadora: '',
        tipoLavado: '',
        programaLavado: '',
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    
    components: {
    },
    created(){
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })
    },
    mounted(){
        this.buscarUsuario(this.dataRastreo.usuario, 1)
        // this.buscarUsuario(this.dataRastreo.pasoProceso.usuario, 2)
        this.dataRastreo.pasoProceso.idTipoLavado ? this.buscarTipoLavado(this.dataRastreo.pasoProceso.idTipoLavado) : ''
        this.dataRastreo.pasoProceso.idProgramaLavado ? this.buscarProgramaLavado(this.dataRastreo.pasoProceso.idProgramaLavado) : ''
        this.dataRastreo.lavadora ? this.buscarLavadora(this.dataRastreo.lavadora) : ''

    },
    methods: {
        
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        
        fecha(fecha){
            moment.locale('es')
            return moment(fecha).format("LLLL");  
        },
        
        buscarUsuario(id, tipo){
            fetchApi(this.url+`usuario/findById/${id}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    let dd = data.datos
                    if(tipo == 1){
                        this.nombreUs1 = `${dd.nombre} ${dd.paterno} ${dd.materno}`
                    }else{
                        this.nombreUs2 = `${dd.nombre} ${dd.paterno} ${dd.materno}`
                    }
                }
            })
        },
        buscarTipoLavado(id){
            fetchApi(this.url+`tipoLavado/findById/${id}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.tipoLavado = data.datos.nombre
                }
            })
        },

        buscarProgramaLavado(id){
            fetchApi(this.url+`lavadora/programa/findById/${id}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.programaLavado =  {nombre: data.datos.nombre, descripcion: data.datos.descripcion, cantidadMinima: data.datos.cantidadMinima, cantidadMaxima: data.datos.cantidadMaxima}
                }
            })
        },
        buscarLavadora(id){
            fetchApi(this.url+`lavadora/findById/${id}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.lavadora =  data.datos.lavadora
                }
            })
        },
        
    }
}
</script>
<style>
body {
    font-family: "Poppins", sans-serif;
    height: 100vh;
    background: #f1f1f1 !important;
}
input {
    width: 100%;
}
.ml-5 .vs-card{
    margin-left: auto!important
}
</style>

<style>

.centerAll{
    display: grid;
    place-items: center;
}

.card{
    border-radius: 1rem;
}
.vs-input{
    width: 100%;
}

</style>