<template>
    <div>
        <HeaderComponent/>
        <br>
    
        <b-container fluid class="mt-3">
            <template>
                
                <b-row  class="mt-5">
                    <b-col lg="6" md="6" sm="12">
                        <b-card  style="max-width: 400px;" class="mb-4 mx-auto" >
                            <b-row class="mt-1">
                                <b-col lg="8" md="8" sm="12"  class="p-1">
                                    <vs-input state="dark" dark v-model="buscarTxt" @keyup="searchUser()" label-placeholder="Buscar Usuario">
                                        <template #icon>
                                            <box-icon name='user' dark></box-icon> 
                                        </template>
                                    </vs-input>
                                </b-col>
                                <b-col lg="4" md="4" sm="12"  class="p-1">
                                    <vs-button
                                        transparent 
                                        block
                                        :active="btnBuscar == 1"
                                        @click="searchUser()"
                                    >
                                        <box-icon name='search-alt-2' color="#195bff"></box-icon> Buscar
                                    </vs-button>
                                </b-col>
                            </b-row>
                        </b-card>
                    </b-col>
                    <b-col lg="6" md="6" sm="12">
                        <b-card style="max-width: 400px;" class="mx-auto">
                            <b-row class="mt-1">
                                <b-col class="p-1">
                                    <vs-switch class="mt-3" v-model="buscarAct" @click="mostrarActInact()">
                                        <template #off>
                                            <box-icon name='check'></box-icon> Activos
                                        </template>
                                        <template #on>
                                            <box-icon name='x' color="#fff"></box-icon> Inactivos
                                        </template>
                                    </vs-switch>
                                </b-col>
                                <b-col class="p-1">
                                    <vs-button flat icon @click="activeModal=!activeModal">
                                        <box-icon name='user-plus' color="#195bff"></box-icon> Agregar Usuairo
                                    </vs-button>
                                    <b-modal size="xl" centered v-model="activeModal">
                                        <template #modal-header="{ close }">
                                            <h5>Agregar <b>Usuario</b></h5>
                                            <vs-button circle icon floating danger @click="close()">
                                                <box-icon name='x' color="#fff"></box-icon>
                                            </vs-button>
                                        </template>
                                        <template #header>
                                        <h4 class="not-margin">
                                            Registrar <b>Usuario</b>
                                        </h4>
                                        </template>
                            
                                        <div class="con-form">
                                            <b-row>
                                                <b-col class="mt-2" lg="12" md="12" sm="12">
                                                    <vs-input success class="mt-2" type="text" v-model="nombre" label-placeholder="Nombre Completo">
                                                        <template #icon>
                                                            <box-icon name='user' type='solid' ></box-icon>
                                                        </template>
                                                    </vs-input>
                                                </b-col>
                                                <b-col class="mt-2" lg="6" md="12" sm="12">
                                                    <vs-input success class="mt-3" type="text" v-model="paterno" label-placeholder="Apellido Paterno">
                                                        <template #icon>
                                                            <box-icon name='user' type='solid' ></box-icon>
                                                        </template>
                                                    </vs-input>
                                                </b-col>
                                                <b-col class="mt-2" lg="6" md="12" sm="12">
                                                    <vs-input success class="mt-3" type="text" v-model="materno" label-placeholder="Apellido Materno">
                                                        <template #icon>
                                                            <box-icon name='user' type='solid' ></box-icon>
                                                        </template>
                                                    </vs-input>
                                                </b-col>
                                            </b-row>
                                            
                                            
                                            
                                            <div class="con-switch">
                                              <b-row>
                                                <b-col class="mt-3" cols="2" v-for="(rol, i) in allRoles" :key="i">
                                                  <vs-switch  :val="rol.id" v-model="optionsRoles">
                                                    {{ rol.nombre }}
                                                  </vs-switch>
                                                </b-col>
                                              </b-row>
                                            </div>
                                        </div>
                                        <br>
                                        <template #modal-footer="{ ok }">
                                            <vs-button :btnGuardar="btnGuardar == 1" primary @click="addUser()">
                                                <box-icon name='save' color="#fff"></box-icon> Guardar
                                            </vs-button>
                                            <vs-button danger @click="ok()">
                                                <box-icon name='exit' color="#fff"></box-icon> Salir
                                            </vs-button>
                                        </template>
                                    </b-modal>
                                </b-col>
                            </b-row>
                        </b-card>
                    </b-col>
                </b-row>
            </template>
        </b-container>
        <br>
        <!-- <div class="center">
          <vs-pagination v-model="page" :length="20" />
        </div> -->
        <b-container v-if="mostrarUsuario">
            <vs-alert style="width: 20rem;">
                <template #title>
                    Credenciales del nuevo usuario
                </template>
                <p>
                    Nombre completo: <b>{{nombreUsr}}</b>
                    <br>
                     Usuario: <b>{{usr}}</b>
                    <br>
                    Nip: <b>{{passUsr}} </b>
                </p>
                <template #footer>
                    <vs-button @click="mostrarUsuario=!mostrarUsuario">
                        Accept
                    </vs-button>
                </template>
            </vs-alert>
        </b-container>

        <br>
        <b-container class="bv-example-row">
            <b-row>
                <b-col class="mt-4" lg="3" md="6" sm="12" v-for="(usuario, i) in usuarios.datos" :key="i">
                    <CardUsrComponent @updatePage="updatePage" :dataUser="{nombre: usuario.nombre, paterno: usuario.paterno, materno: usuario.matenro, username: usuario.username, roles: usuario.roles, id: usuario.id}" />
                </b-col>
            </b-row>
        </b-container>
         <br>
         <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>
    </div>
  </template>
  
  <script>
    import HeaderComponent from '@/components/Header.vue';
    import CardUsrComponent from '@/components/cardUsr.vue'
    import { fetchApi, refreshSession } from "@/service/service.js"
    import loginComponent from '@/components/cardLogin.vue';

  
  
  export default {
    name:"UsuariosView",
    data: () => ({
        usuarios: [],
        allRoles: [],
        page: 1,
        cantidad: 100,
  
        activeModal: false,
        nombre: '',
        paterno: '',
        materno: '',
        clave: '',
        optionsRoles: [],
  
        btnGuardar: 0,
        buscarAct: false,
        buscarTxt: '',
        btnBuscar: 0,
        hidden: true,

        mostrarUsuario: false,
        nombreUsr: '',
        passUsr: '',
        usr: '',

        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    components: {
        HeaderComponent,
        CardUsrComponent,
        loginComponent

    },
    created(){
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })
    },
    async mounted(){    
        this.mostrarUsuarios()
        this.mostraRoles()
    },
    methods: {
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        async mostraActivos(){
            
            fetchApi(this.url+`usuario/findByEstado/1/${this.page}/${this.cantidad}`, 'GET', this.$session.get('token'))
            .then(data => {
                this.usuarios = []
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.usuarios = data.datos
                    
                }else{
                    this.openNotification('Ocurrio un error al obtener los datos', `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },
        async mostraInactivos(){

            fetchApi(this.url+`usuario/findByEstado/5/${this.page}/${this.cantidad}`, 'GET', this.$session.get('token'))
            .then(data => {
                this.usuarios = []
                if(data.status == 401){  this.activarReboot = true }
                if(data.status == 200){
                    this.usuarios = data.datos
                }else{
                    this.openNotification('Ocurrio un error al obtener los datos', `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },
        mostrarActInact(){
            this.buscarAct ? this.mostraActivos() : this.mostraInactivos()
        },
        async mostrarUsuarios(){
          fetchApi(this.url+`usuario/findAll/${this.page}/100`, 'GET', this.$session.get('token'))
          .then(data => {
              this.usuarios = []
              if(data.status == 401){  this.activarReboot = true }
              if(data.status == 200){
                  this.usuarios = data.datos
              }else{
                  this.openNotification('Ocurrio un error al obtener los datos', `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
              }
          })
        },
        async mostraRoles(){
              fetchApi(this.url+'rol/findAll', 'GET', this.$session.get('token'))
              .then(data => {
                  if(data.status == 200){
                      this.allRoles = data.datos
                  }else{
                      this.openNotification('Ocurrio un error al obtener los datos', `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                  }
              })
          },
        async addUser(){
            let token = this.$session.get('token')
  
            let json = {
                "nombre": this.nombre,
                "paterno": this.paterno,
                "materno": this.materno,
                "roles": this.optionsRoles,
            };
            let res = await fetch(this.url+"usuario/registro",{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*",
                    'Authorization': token
                },
                body: JSON.stringify(json)
            })
            let data = await res.json()
            if(data.status == 401){  this.activarReboot = true }
            if(data.status == 200){
                //se actualiza token
                this.activeModal = false
                this.mostrarUsuario = true
                this.nombreUsr = `${data.datos.nombre} ${data.datos.materno} ${data.datos.materno}`
                this.passUsr = data.datos.password
                this.usr = data.datos.username
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Registrado Correctamente`, 'success', 'top-center',`<box-icon name='check' color="#fff"></box-icon>`)
                this.mostrarUsuarios()
                this.refresh()
            }else{
                this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
            }
        },
        async searchUser(){


            this.usuarios = []

            if(this.buscarTxt != ''){
                let token = this.$session.get('token')

                let json = {
                    "criterio": this.buscarTxt,
                };
                let res = await fetch(this.url+"usuario/buscar",{
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
                    this.usuarios = data.datos
                }else{
                    this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            }else{
                this.mostrarUsuarios()
            }
        },
        async updatePage(status){
            if(status == 200){
                this.mostrarUsuarios()
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
  .ml-5 .b-card{
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
  
  .card{
    border-radius: 1rem;
}
.vs-input{
    width: 100%;
}

  
  </style>
  