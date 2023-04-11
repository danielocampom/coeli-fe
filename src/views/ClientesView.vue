<template>
    <div>
        <HeaderComponent/>
        <br>
    
        <b-container fluid class="mt-3">
            <template>
                <b-row  class="center">
                    <b-col class="mt-4  centerAll" lg="6" md="6" sm="6">
                        <vs-card>
                            <template #img>
                                <!-- <input v-on:keyup="buscarCli()" v-model="buscarTxt"> -->
                                <vs-input state="dark" @keyup="buscarCli()" dark v-model="buscarTxt" placeholder="Buscar Cliente">
                                    <template #icon>
                                        <box-icon name='user' dark></box-icon> 
                                    </template>
                                </vs-input>
                                <vs-button
                                    transparent 
                                    :active="btnBuscar == 1"
                                    @click="buscarCli()"
                                >
                                    <box-icon name='search-alt-2' color="#195bff"></box-icon> Buscar
                                </vs-button>
                            </template>
                        </vs-card>
                    </b-col>
                    <b-col class="mt-4  centerAll" lg="6" md="6" sm="12">
                        <vs-card>
                            <template #img>
                                <vs-switch v-model="buscarAct" @click="mostrarActInact()">
                                    <template #off>
                                        <box-icon name='check'></box-icon> Activos
                                    </template>
                                    <template #on>
                                        <box-icon name='x' color="#fff"></box-icon> Inactivos
                                    </template>
                                </vs-switch>
                                <vs-button flat icon @click="activeModal=!activeModal">
                                    <box-icon name='user-plus' color="#195bff"></box-icon> Agregar Cliente
                                </vs-button>
                                <vs-dialog v-model="activeModal">
                                    <template #header>
                                    <h4 class="not-margin">
                                        Registrar <b>Clientes</b>
                                    </h4>
                                    </template>
                        
                                    <div class="con-form">
                                        <vs-input success type="text" v-model="nombreCli" placeholder="Nombre del Cliente">
                                            <template #icon>
                                                <box-icon name='user' type='solid' ></box-icon>
                                            </template>
                                        </vs-input>
                                        <vs-input success type="text" v-model="claveCli" placeholder="Clave del Cliente">
                                            <template #icon>
                                                <box-icon name='dialpad-alt' ></box-icon>
                                            </template>
                                        </vs-input>
                                    </div>
                                    <br>
                                    <template #footer>
                                        <div class="footer-dialog">
                                            <vs-button block success
                                                flat
                                                :btnGuardar="btnGuardar == 1"
                                                @click="addCliente()">
                                                Guardar
                                            </vs-button>
                                        </div>
                                    </template>
                                </vs-dialog>
                            </template>
                        </vs-card>
                    </b-col>
                </b-row>
            </template>
        </b-container>
        <br>
        <b-container class="bv-example-row">
            <b-row >
                <b-col class="mt-4" lg="3" md="4" sm="6" v-for="(cliente, i) in clientes" :key="i">
                    <cardClienteComponent @updatePage="updatePage" :dataCli="{nombre: cliente.nombre, estado: cliente.estado, clave: cliente.clave, id: cliente.id}" />
                </b-col>
            </b-row>
            <vs-alert v-if="sinData.length == 0" shadow danger>
                <template #title>
                    No se han encontrado datos
                </template>
            </vs-alert>
        </b-container>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>

    </div>
</template>

<script>
import HeaderComponent from '@/components/Header.vue';
import CardClienteComponent from '@/components/cardCliente.vue'
import { fetchApi, refreshSession } from "@/service/service.js"
import loginComponent from '@/components/cardLogin.vue';

export default {
    name:"ClientesView",
    data: () => ({
        clientes: [],
        sinData: false,
        activeModal: false,
        nombreCli: '',
        claveCli: '',
        btnGuardar: 0,
        buscarAct: false,
        buscarTxt: '',
        btnBuscar: 0,
        hidden: true,
        notData: true,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    components: {
        HeaderComponent,
        CardClienteComponent,
        loginComponent
    },
    created(){
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })
    },
    mounted(){
        this.mostraActivos()
    },
    methods: {
        
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        
        async mostraActivos(){
            
            fetchApi(this.url+'cliente/findByEstado/1', 'GET', this.$session.get('token'))
            .then(data => {
                this.clientes = []
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.clientes = data.datos
                    if(this.clientes.length == 0){
                        this.sinData == true
                    }
                }else{
                    this.openNotification('Ocurrio un error al obtener los datos', `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },
        async mostraInactivos(){

            fetchApi(this.url+'cliente/findByEstado/5', 'GET', this.$session.get('token'))
            .then(data => {
                this.clientes = []
                if(data.status == 401){  this.activarReboot = true }
                if(data.status == 200){
                    this.clientes = data.datos
                }else{
                    this.openNotification('Ocurrio un error al obtener los datos', `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },
        mostrarActInact(){
            this.buscarAct ? this.mostraActivos() : this.mostraInactivos()
        },
        async addCliente(){
            let token = this.$session.get('token')

            let json = {
                "nombre": this.nombreCli,
                "clave": this.claveCli,
            };
            let res = await fetch(this.url+"cliente/register",{
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
                this.activeModal = false
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Registrado Correctamente`, 'success', 'top-center',`<box-icon name='check' color="#fff"></box-icon>`)
                this.mostraActivos()
                
            }else{
                this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
            }
        },
        async buscarCli(){
            this.clientes = []

            if(this.buscarTxt != ''){
                let token = this.$session.get('token')

                let json = {
                    "criterio": this.buscarTxt,
                };
                let res = await fetch(this.url+"cliente/find",{
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
                    this.clientes = data.datos

                }else{
                    this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            }else{
                this.mostraActivos()
            }
        },
        async updatePage(status){
            if(status == 200){
                this.mostraActivos()
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

<style>

.centerAll{
    display: grid;
    place-items: center;
}

.vs-card{
    padding: 0.5rem;
}

</style>