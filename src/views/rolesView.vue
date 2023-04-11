<template>
    <div>
        <HeaderComponent/>
        <br>
    
        <b-container fluid class="mt-3">
            <template>
                <b-row  class="center">
                    <b-col class="mt-4  centerAll" lg="6" md="6" sm="12">
                        <vs-card>
                            <template #img>
                                <vs-input state="dark" dark v-model="buscarTxt" @keyup="searchRol()" placeholder="Buscar Rol">
                                    <template #icon>
                                        <box-icon name='user' dark></box-icon> 
                                    </template>
                                </vs-input>
                                <vs-button
                                    transparent 
                                    :active="btnBuscar == 1"
                                    @click="buscarUsr()"
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
                                    <box-icon name='plus' color="#195bff"></box-icon> Agregar Roles
                                </vs-button>
                                <vs-dialog size="xl" centered v-model="activeModal">
                                    <template #modal-header="{ close }">
                                        <h5>Agregar <b>Roles</b></h5>
                                        <vs-button circle icon floating danger @click="close()">
                                            <box-icon name='x' color="#fff"></box-icon>
                                        </vs-button>
                                    </template>
                                    <template #header>
                                    <h4 class="not-margin">
                                        Registrar <b>Roles</b>
                                    </h4>
                                    </template>
                        
                                    <div class="con-form">
                                        
                                        <vs-input success class="mt-2" type="text" v-model="nombre" label-placeholder="Nombre del rol">
                                            <template #icon>
                                                <box-icon name='rename' ></box-icon>
                                            </template>
                                        </vs-input>
                                        <vs-input success class="mt-3" type="text" v-model="descripcion" label-placeholder="Descripción">
                                            <template #icon>
                                                <box-icon name='rename' ></box-icon>
                                            </template>
                                        </vs-input>

                                    </div>
                                    <br>
                                    <template #footer>
                                        <vs-button block :btnGuardar="btnGuardar == 1" success @click="addRoll()">
                                            <box-icon name='save' color="#fff"></box-icon> Guardar
                                        </vs-button>
                                    </template>
                                </vs-dialog>
                            </template>
                        </vs-card>
                    </b-col>
                </b-row>
            </template>
        </b-container>
        <br>
        <!-- <div class="center">
          <vs-pagination v-model="page" :length="20" />
        </div> -->
        <br>
        <b-container class="bv-example-row">
            <b-row>
                <b-col class="mt-4" lg="3" md="6" sm="12" v-for="(rol, i) in allRoles" :key="i">
                    <CardRolComponent @updatePage="updatePage" :dataRol="{nombre: rol.nombre, descripcion: rol.descripcion, id: rol.id, personaliza: rol.personaliza}" />
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
    import CardRolComponent from '@/components/cardRol.vue'
    import { fetchApi, refreshSession } from "@/service/service.js"
    import loginComponent from '@/components/cardLogin.vue';

  
  
  export default {
    name:"UsuariosView",
    data: () => ({
        allRoles: [],
  
        activeModal: false,
        nombre: '',
        descripcion: '',
  
        btnGuardar: 0,
        buscarAct: false,
        buscarTxt: '',
        btnBuscar: 0,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    components: {
        HeaderComponent,
        CardRolComponent,
        loginComponent

    },
    created(){
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })
    },
    async mounted(){    
        this.mostraRoles()
    },
    methods: {
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
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
        async addRoll(){
            let token = this.$session.get('token')
  
            let json = {
                "nombre": this.nombre,
                "descripcion": this.descripcion,
            };
            let res = await fetch(this.url+"rol/add",{
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
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Registrado Correctamente`, 'success', 'top-center',`<box-icon name='check' color="#fff"></box-icon>`)
                this.mostraRoles()
                this.refresh()
            }else{
                this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
            }
        },
        async searchRol(){


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
                    this.allRoles = data.datos

                }else{
                    this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            }else{
                this.mostraRoles()
            }
        },
        async updatePage(status){
            if(status == 200){
                this.mostraRoles()
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
  