<template>
    <div>
        <vs-tooltip bottom shadow not-hover v-model="opciones">
            <vs-alert>
                <vs-button size="large" transparent @click="opciones=!opciones">
                    <div class="d-flex flex-row bd-highlight mb-3">
                        <div class="p-2 bd-highlight">
                            <b-skeleton v-if="!nombre" type="button"></b-skeleton>
                            <b>{{ nombre }}</b>  
                        </div>
                        <div class="p-2 bd-highlight">
                            <b-skeleton v-if="!nombre" type="button"></b-skeleton>
                            <div v-else class="badge bg-success text-wrap float-end" >
                                {{ dataClient.nombreEstado }}
                            </div>
                        </div>
                    </div>
                </vs-button>
                <br>
                <hr>
                <b-skeleton v-if="render" animation="throb" width="40%"></b-skeleton>
                <p v-else class="mb-5">
                    {{ fecha(dataClient.fecha) }}
                </p>
            </vs-alert>
            <template #tooltip>
                <div class="content-tooltip">
                    <b-list-group>
                        <b-list-group-item> 
                            <vs-button success block  @click="modalShowEdit = !modalShowEdit">
                                Editar Fecha de Entrega
                            </vs-button>
                        </b-list-group-item>
                    </b-list-group>
                    <b-list-group>
                        <b-list-group-item> 
                            <vs-button success block @click="modalShowDetail = !modalShowDetail">
                                Ver Detalles
                            </vs-button>
                        </b-list-group-item>
                    </b-list-group>
    
                    <b-list-group>
                        <b-list-group-item> 
                            <vs-button success block @click="print = !print">
                                Imprimir
                            </vs-button>
                        </b-list-group-item>
                    </b-list-group>
                    <footer>
                    <vs-button @click="opciones=false" danger block>
                        Cancel
                    </vs-button>
                    </footer>
                </div>
            </template>
            <vs-dialog v-model="modalShowEdit">
                <template #header>
                    <h4 class="not-margin">
                        Actualizar <b>{{ nombre }}</b>
                    </h4>
                </template>
    
                <div class="con-form">
                    <vs-input
                        type="date"
                        v-model="fechaUp"
                        label="Fecha de Entrega"
                    />
                </div>
    
                <template #footer>
                    <div class="footer-dialog">
                        <vs-button block>
                            <box-icon name='send' color="#fff"></box-icon> Actualizar
                        </vs-button>
                    </div>
                </template>
            </vs-dialog>
            <b-modal size="xl" centered v-model="modalShowDetail">
                <template #modal-header="{ close }">
                    <h5>Detalles <b>{{ nombre }}</b></h5>
                    <vs-button circle icon floating danger @click="close()">
                        <box-icon name='x' color="#fff"></box-icon>
                    </vs-button>
                </template>
                <template >
                    <b-card v-if="prendas.length == 0">
                        <div class="d-flex flex-row bd-highlight mb-3">
                            <div class="p-2 bd-highlight">
                                <b-skeleton animation="wave" width="85%"></b-skeleton>
                            </div>
                            <div class="p-2 bd-highlight">
                                <b-skeleton type="avatar"></b-skeleton>
                            </div>
                        </div>
    
                        <b-skeleton type="input"></b-skeleton>
                        <br>
                        <b-skeleton type="input"></b-skeleton>
                        <br>
    
                        <b-row cols-sm="12" cols-md="6" cols-lg="4" class="mt-4">
                            <b-col>
                                <b-card>
                                    <b-skeleton animation width="85%"></b-skeleton>
                                    <b-skeleton animation width="55%"></b-skeleton>
                                    <b-skeleton animation width="70%"></b-skeleton>
                                </b-card>
                            </b-col>
                            <b-col>
                                <b-card>
                                    <b-skeleton animation width="85%"></b-skeleton>
                                    <b-skeleton animation width="55%"></b-skeleton>
                                    <b-skeleton animation width="70%"></b-skeleton>
                                </b-card>
                            </b-col>
                            <b-col>
                                <b-card>
                                    <b-skeleton animation width="85%"></b-skeleton>
                                    <b-skeleton animation width="55%"></b-skeleton>
                                    <b-skeleton animation width="70%"></b-skeleton>
                                </b-card>
                            </b-col>
                            
                            <b-col>
                                <b-card>
                                    <b-skeleton animation width="85%"></b-skeleton>
                                    <b-skeleton animation width="55%"></b-skeleton>
                                    <b-skeleton animation width="70%"></b-skeleton>
                                </b-card>
                            </b-col>
                        </b-row>
    
                    </b-card>
                    <div v-else v-for="(prenda, i) in prendas" :key="i">
                        <hr v-if="i>0">
                        <div class="d-flex flex-row bd-highlight mb-3">
                            <div class="p-2 bd-highlight">
                                <h4 class="mt-2">{{ prenda.prenda.nombre }}</h4>
                            </div>
                            <div class="p-2 bd-highlight">
                                <upPrendaAsignacion @updatePage="updatePage" :dataUp="{idOrden: dataClient.idOrden, cantidad: prenda.cantidad, idPrenda: prenda.id, nombre: prenda.prenda.nombre}"></upPrendaAsignacion>
                            </div>
                        </div>
                        cantidad: <b>{{ prenda.cantidad }}</b> <br>
                        tipo de lavado:<b> {{prenda.detalle.nombre}} ({{ prenda.detalle.codigo }})</b> 
                        
                        <br>
                        <b-row cols="1" cols-sm="12" cols-md="6" cols-lg="4" class="mt-4">
                            <b-col v-for="(paso, i) in prenda.detalle.pasos" :key="i">
                                <b-card :title="paso.nombre">
                                    {{ paso.descripcion }}
                                </b-card>
                            </b-col>
                        </b-row>
                    </div>
                </template>
    
                <template #modal-footer="{ ok }">
                    <vs-button danger @click="ok()">
                            Salir
                    </vs-button>
                </template>
                
            </b-modal>
            
        </vs-tooltip>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>
    </div>
</template>
  
<script>
import moment from 'moment'
import upPrendaAsignacion from '@/components/upPrendaAsignacion.vue';
import { fetchApi, refreshSession } from "@/service/service.js"
import loginComponent from './cardLogin.vue';

export default {
    name:"CardOrdenComponent",
    props: {
        dataClient: Object,
    },
    components: {
        upPrendaAsignacion,
        loginComponent
    },
    data: () => ({
        cliente: '',
        prenda: '',
        fechaUp: '',

        opciones: false,
        modalShowEdit: false,
        modalShowDetail: false,
        print: false,
        nombre: '',
        prendas: [],
        render: true,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,

    }),
    mounted(){

        setTimeout(() => {
            this.render = false
            this.mostrarDataClient(this.dataClient.id)
            this.dataClient.prendas.forEach( value => {
                this.mostrarDataPrenda(value.idPrenda, value.cantidad)
            })
        }, 1500)

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
        
        mostrarDataClient(id){
            this.nombre = ''
            fetchApi(this.url+`cliente/findById/${id}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.nombre = data.datos.nombre
                }
            })
        },
        mostrarDataPrenda(id, cantidad){
            this.prendas = []
            fetchApi(this.url+`prenda/findById/${id}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    let t = this
                    fetchApi(this.url+`proceso/findById/${data.datos.proceso}`, 'GET', this.$session.get('token'))
                    .then(dt => {
                        if(dt.status == 200){
                            t.prendas.push({"prenda": data.datos, "detalle": dt.datos, "cantidad": cantidad, "id": id})
                            
                        }
                    })
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