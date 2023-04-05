<template>
    <div>
        <vs-card type="3" @click="active=!active" >
            <template #img>
                <p class="m-3">
                    {{dataUser.nombre}} {{dataUser.paterno}} {{dataUser.materno}} 
                </p>
            </template>
        </vs-card>
        <b-modal size="xl" centered v-model="active">
            <template #modal-header="{ close }">
                <h5>Editar <b>Usuario</b></h5>
                <vs-button circle icon floating danger @click="close()">
                    <box-icon name='x' color="#fff"></box-icon>
                </vs-button>
            </template>
            <template #header>
            <h4 Editar="not-margin">
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
                <vs-button primary @click="updateUsr()">
                    <box-icon name='save' color="#fff"></box-icon> Guardar
                </vs-button>
                <vs-button danger @click="ok()">
                    <box-icon name='exit' color="#fff"></box-icon> Salir
                </vs-button>
            </template>
        </b-modal>
        
        <vs-dialog v-model="active2">
            <template #header>
                <h4 class="not-margin">
                    Estas seguro que deseas <b>Desactivarlo?</b>
                </h4>
            </template>
            <ConfirmComponent @confirm="deleteUsuario"/>
        </vs-dialog>

    </div>
    
</template>
<script>

import ConfirmComponent from '@/components/confirm.vue'
import { fetchApi } from "@/service/service.js"


export default {
    name: 'CardUsrComponent',
    props: {
        dataUser: Object,
    },
    data:() => ({
        estado: '',
        active: false,
        active2: false,
        nombre: '',
        paterno: '',
        materno: '',
        clave: '',
        optionsRoles: [],
        allRoles: [],
        permisosUpCli: false,
        btnElimina: 0,
        btnActualizar: 0,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,

    }),
    components: {
        ConfirmComponent,
    },
    async mounted(){
        this.mostraRoles()
        this.nombre = this.dataUser.nombre
        this.paterno = this.dataUser.paterno
        this.materno = this.dataUser.materno
        this.dataUser.roles.forEach( rol => {
            this.optionsRoles.push(rol.id) 
        });
    },
    methods: {
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
        async updateUsr(){
            let token = this.$session.get('token')

            let json = {
                "idUsuario": this.dataUser.id,
                "nombre": this.nombre,
                "paterno": this.paterno,
                "materno": this.maternos,
                "roles": this.optionsRoles,
            };
            let res = await fetch(this.url+"usuario/update",{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*",
                    'Authorization': token
                },
                body: JSON.stringify(json)
            })
            let data = await res.json()

            if(data.status == 200){
                //se actualiza token
                this.active = false
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Registrado Correctamente`, 'success', 'top-center',`<box-icon name='check' color="#fff"></box-icon>`)
                this.$emit('updatePage', '200')
            }else{
                this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
            }
        },
        async deleteUsuario(status){
            if(status == 200){
                let token = this.$session.get('token')
                const res = await fetch(this.url+`cliente/delete/${this.dataUser.id}`,{
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': "*",
                        'Authorization': token
                    },
                })
                const data = await res.json();
                if(data.status == 200){
                    this.active2 = false
                    this.active = false
                    this.$emit('updatePage', '200')
                    this.openNotification(`Exito: ${data.mensaje}`, `Se ha Desactivado Correctamente`, 'success', 'top-center',`<box-icon name='check' color="#fff"></box-icon>`)

                }else{
                    this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
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
<style lang="stylus">
  getColor(vsColor, alpha = 1)
      unquote("rgba(var(--vs-"+vsColor+"), "+alpha+")")
  getVar(var)
      unquote("var(--vs-"+var+")")
  .con-footer
    display flex
    align-items center
    justify-content flex-end
    .vs-button
      margin 0px
      .vs-button__content
        padding 10px 30px
      ~ .vs-button
        margin-left 10px
  .not-margin
    margin 0px
    font-weight normal
    padding 10px
    padding-bottom 0px
  .con-content
    width 100%
    p
      font-size .8rem
      padding 0px 10px
    .vs-checkbox-label
      font-size .8rem
    .vs-input-parent
      width 100%
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
