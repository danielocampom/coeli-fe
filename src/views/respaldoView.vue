<template>
    <div>
        <HeaderComponent/>
        <br>
    
        <b-container fluid class="mt-5">
            <template>
                <b-row>
                    <b-col>
                        <b-card style="max-width: 600px;" class="mb-4 p-2" >
                            <b-row>
                                <b-col lg="4" md="6" sm="12"  class="mt-4 p-0">
                                    <vs-input
                                        type="date"
                                        v-model="fechInicio"
                                        label-placeholder="Fecha Inicio"
                                    />
                                </b-col>
                                <b-col lg="4" md="6" sm="12"  class="mt-4 p-0">
                                    <vs-input
                                        type="date"
                                        v-model="fechFinal"
                                        label-placeholder="Fecha Final"
                                    />
                                </b-col>
                                <b-col lg="4" md="6" sm="12"  class="mt-4 p-0">
                                    <vs-button
                                        class="p-0"
                                        block
                                        flat
                                        primary 
                                    >
                                        <box-icon name='search-alt-2' color="#195bff"></box-icon> Buscar
                                    </vs-button>
                                </b-col>
                            </b-row>
                            <b-row>
                                <b-col lg="8" md="6" sm="12"  class="mt-4 p-0">
                                    <vs-input state="dark" @keyup="buscar()" dark v-model="buscarNombre" label-placeholder="Buscar por nombre">
                                        <template #icon>
                                            <box-icon name='map-pin' dark></box-icon> 
                                        </template>
                                    </vs-input>
                                </b-col>
                                <b-col lg="4" md="6" sm="12"  class="mt-4 p-0">
                                    <vs-button
                                        class="p-0"
                                        block
                                        flat
                                        primary 
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
            <b-row class="mt-3">
                    <b-col lg="3" md="6" sm="12" class="mt-4" v-for="(orden, i) in dataOrden" :key="i" >
                        <CardOrdenComponent @updatePage="updatePage" :dataClient="{id: orden.idCliente, nombreEstado: orden.nombreEstado, prendas: orden.prendas, idOrden: orden.idOrden, estado: orden.estado, fecha: orden.fechaEntrega}"></CardOrdenComponent>
                    </b-col>
                </b-row>
        </b-container>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>
        
    </div>
</template>

<script>
import HeaderComponent from '@/components/Header.vue';
import CardOrdenComponent from '@/components/cardOrden.vue';
import { fetchApi, refreshSession } from "@/service/service.js"
import loginComponent from '@/components/cardLogin.vue';

export default {
    name:"LavadoSecoView",
    data: () => ({
        dataOrden: [],
        arrData: [],
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,

    }),
    components: {
        HeaderComponent,
        CardOrdenComponent,
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
    
        mostrarOrdenes(){
            fetchApi(this.url+'orden/findAll', 'GET', this.$session.get('token'))
            .then(data => { 
                this.dataOrden = []
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.dataOrden = data.datos   

                }else{
                    this.openNotification('Ocurrio un error al obtener los datos', `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },
        pushArr(elemento){
            this.arrData.push(elemento)
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
input {
    width: 100%;
}
.ml-5 .vs-card{
    margin-left: auto!important
}

.centerAll{
    display: grid;
    place-items: center;
}

.vs-card{
    padding: 0.5rem;
}

</style>