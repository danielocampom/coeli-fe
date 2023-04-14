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
                                        @click="mostrarOrdenes()"
                                    >
                                        <box-icon name='search-alt-2' color="#195bff"></box-icon> Buscar
                                    </vs-button>
                                </b-col>
                            </b-row>
                            <!-- <b-row>
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
                            </b-row> -->
                        </b-card>
                    </b-col>
                </b-row>
            </template>
        </b-container>
        <b-container fluid class="mt-5">
            <b-row class="mt-3" v-if="render">
                <b-col lg="3" md="6" sm="12" class="mt-4" v-for="(orden, i) in dataOrden" :key="i"  >
                    <CardHistorialComponent @updatePage="updatePage" :dataClient="{nombreCliente: orden.nombreCliente, fechaEntrega: orden.fechaEntrega, ordenPrenda: orden.ordenPrenda, idOrden: orden.idOrdenLavado, fecha: `2023-05-01T00:00:00.000+00:00`, historial: orden.historial}"></CardHistorialComponent>
                </b-col>
            </b-row>
            <div class="center" v-else>
                <vs-alert color="danger">
                    <template #title>
                        la fecha {{fechaI}} al {{fechaF}} no tiene datos que mostrar
                    </template>
                </vs-alert>
            </div>
        </b-container>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>
        
    </div>
</template>

<script>
import HeaderComponent from '@/components/Header.vue';
import CardHistorialComponent from '@/components/cardHistorial.vue';
import { refreshSession } from "@/service/service.js"
import loginComponent from '@/components/cardLogin.vue';

export default {
    name:"LavadoSecoView",
    data: () => ({
        fechaI: '',
        fechaF: '',
        dataOrden: [],
        fechInicio: '',
        fechFinal: '',
        buscarNombre: '',
        render: true,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,

    }),
    components: {
        HeaderComponent,
        CardHistorialComponent,
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
            let newFechaI = ''
            let newFechaF = ''
            if(this.fechInicio != ''){
                newFechaI = this.fechInicio.split('-')
            }
            if(this.fechFinal != ''){
                newFechaF = this.fechFinal.split('-')
            }

            var fechaActual = new Date();
            var dia = fechaActual.getDate();
            var mes = fechaActual.getMonth();
            var anio = fechaActual.getFullYear();


            let newMesI = ''
            if(mes+1 < 10){
                newMesI = `0${mes+1}`
            }else{
                newMesI = mes+1
            }

            let newMesF = ''
            if(mes+1 < 10){
                if(mes+1 == 12){
                    anio = anio+1
                    newMesF = `01`
                }else{
                    newMesF = `0${mes+2}`
                }
            }else{
                newMesF = mes+2
            }

            let fechaIn = this.fechInicio == '' ? `${dia}/${newMesI}/${anio}` : `${newFechaI[2]}/${newFechaI[1]}/${newFechaI[0]}`
            let fechaFi = this.fechFinal == '' ? `${dia}/${newMesF}/${anio}` : `${newFechaF[2]}/${newFechaF[1]}/${newFechaF[0]}`

            let json = {
                "fechaInicio": fechaIn,
                "fechaFin": fechaFi,
                "idPrenda": "",
                "idCliente": ""
            };
            
            // let json = {
            //     "fechaInicio": "",
            //     "fechaFin": "",
            //     "idPrenda": "3",
            //     "idCliente": ""
            // };
            try {
                let res = await fetch(this.url+"orden/ordenPrenda/buscar",{
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': "*",
                        'Authorization': this.$session.get('token')
                    },
                    body: JSON.stringify(json)
                })
                let data = await res.json()

                this.dataOrden = []
                
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.dataOrden = data.datos 
                    this.render = true

                }else{
                    this.render = false
                    this.openNotification('Ooops! Error.', `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            } catch (error ) {
                this.fechaI = fechaIn
                this.fechaF = fechaFi
                this.dataOrden = []  
                this.render = false
                
                console.log(error)        
                // this.openNotification('Ooops! Error.', `la fecha ${fechaIn} al ${fechaFi} no tiene datos que mostrar`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
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
.card{
    border-radius: 1rem;
}
</style>