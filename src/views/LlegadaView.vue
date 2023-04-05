<template>
    <div>
        <HeaderComponent/>
        <br>
    
        <b-container fluid class="mt-5">
            <b-card no-body>
                <b-tabs card>
                    <b-tab title="Nueva Orden" active>
                        <template>
                            <div>
                                <b-row>
                                    <b-col lg="6" md="8" sm="12">
                                        <b-card title="Registra la Hoja Ruta">
                                            <b-list-group flush>
                                                <b-list-group-item>
                                                    <b-row  class="center mt-2">
                                                        <b-col lg="12" class="mt-4">
                                                            <div class="con-selects">
                                                                <div class="form-floating">
                                                                    <b-form-select class="form-select"  v-model="SelectCliente" @change="mostarPrendas()" :options="getClientes"></b-form-select>
                                                                    <label for="floatingSelect">Selecciona una Opción</label>
                                                                </div>
                                                            </div>
                                                        </b-col>
                                                        <b-col lg="12" class="mt-5">
                                                            <vs-input type="date" size="large" v-model="fechaEntrega" primary label-placeholder="Fecha de entrega">
                                                                <template #icon>
                                                                    <box-icon name='calendar' ></box-icon>
                                                                </template>
                                                            </vs-input>
                                                        </b-col>
                                                    </b-row>
                                                </b-list-group-item>
                                                <b-list-group-item>
                                                    <b-row>
                                                        <b-col lg="12" class="mt-4">
                                                            <div class="con-selects">
                                                                <div class="form-floating">
                                                                    <b-form-select class="form-select"   v-model="SelectPrenda" :options="getPrendas"></b-form-select>
                                                                    <label for="floatingSelect">Selecciona una Opción</label>
                                                                </div>
                                                            </div>
                                                        </b-col>
                                                        <b-col lg="6" sm="8" class="mt-4">
                                                            <vs-input v-model="cantidad" primary label-placeholder="Cantidad">
                                                                <template #icon>
                                                                    <box-icon name='dialpad-alt'></box-icon>
                                                                </template>
                                                            </vs-input>
                                                        </b-col>
                                                        <b-col lg="6" sm="4" class="mt-4">
                                                            <vs-button circle icon floating  @click="addPrenda()">
                                                                <box-icon name='plus' color='#fbfbfb' ></box-icon>
                                                            </vs-button>
                                                        </b-col>
                                                    </b-row>
                                                </b-list-group-item>
                                                <b-list-group-item>
                                                    <div class="center" v-if="prendas.length > 0">
                                                        <vs-button block @click="add()">
                                                            <box-icon name='save' color='#fbfbfb' ></box-icon> Guardar
                                                        </vs-button>
                                                    </div>
                                                </b-list-group-item>
            
                                            </b-list-group>
                                        </b-card>
                                    </b-col>
                                    <b-col lg="6" md="4" sm="12">
                                       <b-card title="Prendas Asignadas">
                                            <div v-if="prendas.length > 0">
                                                <b-list-group flush>
                                                    <b-list-group-item  v-for="(prenda, i) in prendas" :key="i">
                                                        <b-row>
                                                            <b-col cols="8">
                                                                Tipo de Prenda: <b>{{ prenda.nombre }}</b> 
                                                                <br> 
                                                                Cantidad: <b>{{ prenda.cantidad }}</b>
                                                            </b-col>
                                                            <b-col cols="4">
                                                                <vs-button
                                                                    danger
                                                                    size="small"
                                                                    :active="active == prenda.id"
                                                                    @click="eliminarPrenda(prenda.id)"
                                                                >
                                                                    <box-icon name='trash' color="#FFF"></box-icon> Eliminar
                                                                </vs-button>
                
                                                            </b-col>
                                                            
                                                        </b-row>
                                                    </b-list-group-item>
                                                </b-list-group>
                                            </div>
                                            <div v-else>
                                                <vs-alert>
                                                    <template #title>
                                                        No hay Prendas Asignadas
                                                    </template>
                                                </vs-alert>
                                            </div>
                                        </b-card>
                                    </b-col>
                                </b-row>
                            </div>
                        </template>
                    </b-tab>
                    <b-tab title="Ordenes">
                        <b-container class="bv-example-row">
                            <b-row>
                                <b-col class="mt-4" lg="3" md="4" sm="6" v-for="(ordenes, i) in ordenesEspera" :key="i">
                                    <cardLlegada @updatePage="updatePage" :data="{idCiente:ordenes.idCliente, prendas: ordenes.prendas, fechaEntrega: ordenes.fechaEntrega, idOrden: ordenes.idOrden}"></cardLlegada>
                                </b-col>
                            </b-row>            
                            <vs-alert v-if="sinData" shadow danger>
                                <template #title>
                                    No se han encontrado datos
                                </template>
                            </vs-alert>
                        </b-container>
                    </b-tab>
                </b-tabs>
            </b-card>
        
        </b-container>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>
        
    </div>
</template>

<script>
import HeaderComponent from '@/components/Header.vue'
import { fetchApi, refreshSession } from "@/service/service.js"
import loginComponent from '@/components/cardLogin.vue';
import cardLlegada from '@/components/cardLlegada.vue';


export default {
    name:"LlegadaView",
    
    data: () => ({
        modal: false,
        active: 0,
        getPrendas: [],
        getClientes: [],
        sinData: false,
        ordenesEspera: [],
        SelectCliente: '',
        fechaEntrega: '',
        SelectPrenda: '',
        cantidad: '',
        contador: 0,
        error: [],
        prendas: [],
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,

    }),
    components: {
        HeaderComponent,
        loginComponent,
        cardLlegada

    },
    created(){
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })
    },
    mounted(){    
        this.mostraClientesActivos()
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
            this.ordenesEspera = []
            fetchApi(this.url+'orden/findByEstado/1', 'GET', this.$session.get('token'))
            .then(data => {

                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.ordenesEspera = data.datos
                    if(this.ordenesEspera.length == 0){
                        this.sinData == true
                    }
                }else{
                    console.log(data)

                    this.sinData == true
                    // this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },
        async mostraClientesActivos(){
            fetchApi(this.url+'cliente/findByEstado/1', 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    data.datos.forEach( value => {
                        this.getClientes.push({"value": value.id, "text": value.nombre})
                    })
                }else{
                    this.getClientes.push({"value": 0, "text": "Sin clientes"})

                    // this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },
        mostarPrendas(){
            this.mostraPrendasActivas()
        },
        async mostraPrendasActivas(){
            this.getPrendas = []
            fetchApi(this.url+`prenda/findByCliente/${this.SelectCliente}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    if(data.datos.length != 0){
                        data.datos.forEach( value => {
                            this.getPrendas.push({"value": {id: value.id, nombre: value.nombre}, "text": value.nombre})
                        })
                    }else{
                        this.getPrendas.push({"value": '', "text": "Prendas sin asignar"})
                    }
                }else{
                    this.getPrendas.push({"value": '', "text": "Prendas sin asignar"})

                    // this.openNotification('Ocurrio un error al obtener los datos', `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
            .catch(err => console.log(err))
        },
        async addPrenda(){
            let prenda = {
                "id": this.contador,
                "idPrenda": this.SelectPrenda.id,
                "nombre": this.SelectPrenda.nombre,
                "cantidad": this.cantidad
            }
            this.error = []
            this.SelectCliente == '' ? this.error.push("<br>el campo es Cliente Requerido") : ''
            this.fechaEntrega == '' ? this.error.push("<br>el campo es Fecha Entrega Requerido") : ''
            this.SelectPrenda == '' ? this.error.push("<br>el campo es Prenda Requerido") : ''
            this.cantidad == '' ? this.error.push("<br>el campo es Cantidad Requerido") : ''

            if(this.error.length == 0){
                this.prendas.push(prenda)
                this.contador++
            }else{
                this.openNotification(`Error: En los capos`, `${this.error}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
            }
        },
        eliminarPrenda(id){
            this.prendas = this.prendas.filter(pren => pren.id != id)
        },
        async add(){
                this.contador = 0
                let token = this.$session.get('token')
    
                let json = {
                    "idCliente": this.SelectCliente,
                    "fechaEntrega": this.fechaEntrega,
                    "ordenPrendas": this.prendas
                };
                let res = await fetch(this.url+"orden/register",{
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': "*",
                        'Authorization': token
                    },
                    body: JSON.stringify(json)
                })
                let data = await res.json()
    
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.refresh()
                    this.openNotification(`Exito: ${data.mensaje}`, `Se ha Registrado Correctamente`, 'success', 'top-center',`<box-icon name='check' color="#fff"></box-icon>`)
                    this.updatePage(200)
                }else{
                    this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            
        },
        async updatePage(status){
            if(status == 200){
                this.prendas = []
                this.mostrarOrdenes()
                this.cantidad = ''
                this.SelectPrenda = ''
                this.fechaEntrega = ''
                this.SelectCliente = ''
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
#modal-xl{
    margin-top: 5rem;
}
.card{
    border-radius: 1rem;
}
.vs-input{
    width: 90vh;
}
.vs-select{
    width: 90vh;
}
select{
    width: 100%;
}
input {
    width: 100%;
}
.form-select{
    width: 95%;
    border-radius: 1rem;
    height: 1rem;
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