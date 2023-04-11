<template>
    <div>
        <HeaderComponent/>
        <br>
        <b-container fluid class="mt-3">
            <template>
                <b-row>
                    <b-col class="mt-4  centerAll" lg="4" md="12" sm="12">
                        <b-card  style="max-width: 540px;" class="mt-5">
                            <b-row>
                                <b-col class="mt-3">
                                    <vs-input
                                        type="date"
                                        v-model="fechInicio"
                                        label-placeholder="Fecha Inicio"
                                    />
                                </b-col>
                                <b-col class="mt-3">
                                    <vs-input
                                        type="date"
                                        v-model="fechFinal"
                                        label-placeholder="Fecha Final"
                                    />
                                </b-col>
                                <b-col class="mt-3">
                                    <vs-button
                                        transparent 
                                        @click="mostrarOrdenes()"
                                    >
                                        <box-icon name='search-alt-2' color="#195bff"></box-icon> Buscar
                                    </vs-button>
                                </b-col>
                            </b-row>
                        </b-card>
                    </b-col>
                </b-row>
            </template>
        </b-container>
    
        <b-container fluid class="mt-5">
            <template>
                <b-row cols="1"  v-if="dataOrden.length > 0" cols-sm="12" cols-md="8" cols-lg="4">
                        <b-col class="mt-4" v-for="(orden, i) in dataOrden" :key="i" >
                            <CardOrdenCanceladasComponent @updatePage="updatePage" :dataClient="{id: orden.id, nombrePrenda: orden.nombrePrenda, nombreCliente: orden.nombreCliente, idUsuario: orden.idUsuario, descripcion: orden.descripcion, cantidadAnterior: orden.cantidadAnterior, cantidadActual: orden.cantidadActual}"></CardOrdenCanceladasComponent>
                        </b-col>
                </b-row>
                <vs-alert v-else danger>
                    No se encontraron coincidencias
                </vs-alert>
            </template>
        </b-container>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>
        
    </div>
</template>

<script>
import HeaderComponent from '@/components/Header.vue';
import CardOrdenCanceladasComponent from '@/components/cardOrdenCanceladas.vue';
import { refreshSession } from "@/service/service.js"
import loginComponent from '@/components/cardLogin.vue';
import moment from 'moment'

export default {
    name:"LavadoSecoView",
    data: () => ({
        dataOrden: [],
        fechFinal: '',
        fechInicio: '',
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,

    }),
    components: {
        HeaderComponent,
        CardOrdenCanceladasComponent,
        loginComponent
    },
    created(){
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })
    },
    mounted(){ 

        this.mostrarOrdenes()
    },
    methods: {
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
    
        async mostrarOrdenes(){
            let token = this.$session.get('token')
            
            let fechaInicio = moment().format("DD/MM/YYYY")
            let fechaFinal = moment().add(1, 'month').format("DD/MM/YYYY")

            let fomartSt = this.fechInicio.split('-')
            let fomartEn = this.fechFinal.split('-')

            let positionDateStart = this.fechInicio == ''? fechaInicio : `${fomartSt[2]}/${fomartSt[1]}/${fomartSt[0]}`
            let positionDateEnd = this.fechFinal == ''? fechaFinal : `${fomartEn[2]}/${fomartEn[1]}/${fomartEn[0]}`

            this.dataOrden = []
            let json = {
                "tipoCancelacion": 1,
                "fechaInicio": positionDateStart,
                "fechaFin": positionDateEnd
            };
            console.log(json)
            let res = await fetch(this.url+"orden/cancelacion/consulta",{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*",
                    'Authorization': token
                },
                body: JSON.stringify(json)
            })
            .catch(err => {console.warn(err); this.dataOrden = []})
            let data = await res.json()

            if(data.status == 401){ this.activarReboot = true }
            if(data.status == 200){
                this.dataOrden = data.datos 
                console.log(data.datos)
            }else{
                this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
            }
        },
        
        async updatePage(status){
            if(status == 200){
                this.mostrarOrdenes()
            }
        },
        openNotification( title, text, color, position = null, icon) {
          this.$vs.notification({
            progress: 'auto',
            icon,
            color,
            position,
            title: title,
            text: text
          })
        }
    }
}
</script>
<style>
body {
    font-family: "Poppins", sans-serif;
    height: 100vh;
    background: #f1f1f1 !important;
}
</style>