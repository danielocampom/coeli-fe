<template>
    <div>
        <b-card style="max-width: 500px;" class="mb-4 p-2" v-if="render">
            <b-row>
                <b-col cols="9">
                    <div class='badge bg-primary text-wrap float-end' >
                        {{ fecha(dataClient.fechaEntrega) }}
                    </div>
                    <h4 class="mb-5 ">
                        {{ dataClient.nombreCliente }}
                    </h4>
                    
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12">
                    <div class='badge bg-danger text-wrap float-end mb-2' >
                        {{ dataClient.ordenPrenda.nombreEstado }}
                    </div>
                    <h5 class="mb-5 ">
                        {{ nombrePrenda }} <br>
                        Cantidad: {{ dataClient.ordenPrenda.cantidad }} unidades
                    </h5>
                </b-col>
            </b-row>
            <vs-button success flat block @click="modalShowDetail = !modalShowDetail">
                Ver Historial
            </vs-button>
            <b-modal size="xl" centered v-model="modalShowDetail">
                <template #modal-header="{ close }">
                    <h5>Historial <b>{{ nombrePrenda }}</b></h5>
                    <vs-button circle icon floating danger @click="close()">
                        <box-icon name='x' color="#fff"></box-icon>
                    </vs-button>
                </template>
                <template >
                    <b-row class="mt-3" v-if="dataClient.historial.length > 0">
                        <b-col lg="6" md="6" sm="12" class="mt-4" v-for="(historial, i) in dataClient.historial" :key="i" >
                            <detailHistorial :dataHitorial="{estado: historial.estado, pasoProceso: historial.pasoProceso, lavadora: historial.lavadora  }"></detailHistorial>
                        </b-col>
                    </b-row>
                    <div class="center" v-else>
                        <vs-alert color="danger">
                            <template #title>
                                Aun no inicia los procesos correspondientes
                            </template>
                        </vs-alert>
                    </div>
                </template>
    
                <template #modal-footer="{ ok }">
                    <vs-button danger @click="ok()">
                            Salir
                    </vs-button>
                </template>
                
            </b-modal>
        </b-card>
        <b-skeleton-img v-else style="border-radius: 1rem;"></b-skeleton-img>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>
    </div>
</template>
  
<script>
import moment from 'moment'
import { fetchApi, refreshSession } from "@/service/service.js"
import loginComponent from './cardLogin.vue';
import detailHistorial from './detailHistorial.vue';


export default {
    name:"CardHistorialComponent",
    props: {
        dataClient: Object,
    },
    components: {
        loginComponent,
        detailHistorial
    },
    data: () => ({
        prendas: [],
        modalShowDetail: false,
        nombrePrenda: '',
        tipoLavado: '',
        programaLavado: '',
        lavadora: '',
        render: false,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    mounted(){
        this.mostrarDataPrenda(this.dataClient.ordenPrenda.idPrenda)
        setInterval(() => {
            this.render = true
        }, 1000);
    },
    methods:{
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
        
        mostrarDataPrenda(id){
            fetchApi(this.url+`prenda/findById/${id}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.nombrePrenda = data.datos.nombre
                }
            })
        },

        actualizar(){
            console.log("updating....")
            this.$emit('updatePage', '200')
        },
        async updatePage(status){
            if(status == 200){
                this.mostrarDataClient(this.dataClient.id)
                this.dataClient.prendas.forEach( value => {
                    this.mostrarDataPrenda(value.idPrenda, value.cantidad)
                })
            }
        },
    }
}
</script>
<style>
.card{
    border-radius: 1rem;
}
.modal-xl{
    margin-top: 5rem;
}

.vs-input{
    width: 95%;
}
.vs-select--state-null{
    width: 186%;
    margin-bottom: 1rem;
}
</style>
<style lang="stylus">
getColor(vsColor, alpha = 1)
    unquote("rgba(var(--vs-"+vsColor+"), "+alpha+")")
getVar(var)
    unquote("var(--vs-"+var+")")
.not-margin
  margin 0px
  font-weight normal
  padding 10px
.con-form
  width 100%
  .flex
    display flex
    align-items center
    justify-content space-between
    a
      font-size .8rem
      opacity .7
      &:hover
        opacity 1
  .vs-checkbox-label
    font-size .8rem
  .vs-input-content
    margin 10px 0px
    width calc(100%)
    .vs-input
      width 100%
.footer-dialog
  display flex
  align-items center
  justify-content center
  flex-direction column
  width calc(100%)
  .new
    margin 0px
    margin-top 20px
    padding: 0px
    font-size .7rem
    a
      color getColor('primary') !important
      margin-left 6px
      &:hover
        text-decoration underline
  .vs-button
    margin 0px
</style>