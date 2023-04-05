<template>
    <div>
        <b-card v-if="render">
            <b-skeleton animation="throb" width="100%"></b-skeleton>
        </b-card>

        <b-card v-else @click="active=!active" >
            <div class="d-flex flex-row bd-highlight">
                <div class="p-1 bd-highlight">
                    <box-icon name='radio-circle-marked' :color="dataCli.estado == 1 ? '#32ff00' : '#ff0023'" ></box-icon>
                </div>
                <div class="p-1 bd-highlight">
                    {{dataCli.nombre}}
                </div>
            </div>
        </b-card>
        <vs-dialog blur v-model="active">
            <template #header>
                <h4 class="not-margin">
                    Editar <b>Cliente</b>
                </h4>
            </template>


            <div class="con-form">
                <template>
                    <div class="center content-inputs">
                        <vs-input success type="text" v-model="nombreUp" placeholder="Nombre del Cliente">
                            <template #icon>
                                <box-icon name='user'></box-icon>
                            </template>
                        </vs-input>
                    </div>
                    <div class="center content-inputs">
                        <vs-input success type="text" v-model="claveUp" placeholder="Clave del Cliente">
                            <template #icon>
                                <box-icon name='dialpad-alt' ></box-icon>
                            </template>
                        </vs-input>
                    </div>
                </template>
            </div>

            <template #footer>
                <div class="con-footer mt-4">
                    <vs-button success
                        flat
                        :btnActualizar="btnActualizar == 1"
                        @click="updateCliente(dataCli.id)">
                        Actualizar
                    </vs-button>
                    <div v-if="(dataCli.estado == 1)" class="">
                        <vs-button danger
                            flat
                            :btnActualizar="btnElimina == 1"
                            @click="active2=!active2">
                            Desactivar
                        </vs-button>
                    </div>
                    <div v-else>
                        <vs-button success
                            flat
                            :btnActualizar="btnElimina == 1"
                            @click="activarCliente()">
                            Activar
                        </vs-button>
                    </div>
                </div>
            </template>
        </vs-dialog>
        
        <vs-dialog v-model="active2">
            <template #header>
                <h4 class="not-margin">
                    Estas seguro que deseas <b>Desactivarlo?</b>
                </h4>
            </template>
            <ConfirmComponent @confirm="deleteCliente"/>
        </vs-dialog>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>

    </div>
    
</template>
<script>

import ConfirmComponent from '@/components/confirm.vue'
import loginComponent from './cardLogin.vue';
import { refreshSession } from "@/service/service.js"

export default {
    name: 'CardClienteComponent',
    props: {
        dataCli: Object,
    },
    data:() => ({
        estado: '',
        active: false,
        active2: false,
        claveUp: '',
        nombreUp: '',
        permisosUpCli: false,
        btnElimina: 0,
        btnActualizar: 0,
        render: true,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    components: {
        ConfirmComponent,
        loginComponent
    },
    mounted(){
        setTimeout(() => {
            this.render = false
            this.estado = this.dataCli.estado == 1 ? true : false
            this.claveUp = this.dataCli.clave
            this.nombreUp = this.dataCli.nombre
        }, 1500);
    },
    methods: {
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
    
        async deleteCliente(status){
            if(status == 200){
                let token = this.$session.get('token')
                const res = await fetch(this.url+`cliente/delete/${this.dataCli.id}`,{
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': "*",
                        'Authorization': token
                    },
                })
                const data = await res.json();
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.refresh()
                    this.active2 = false
                    this.active = false
                    this.$emit('updatePage', '200')
                    this.openNotification(`Exito: ${data.mensaje}`, `Se ha Desactivado Correctamente`, 'success', 'top-center',`<box-icon name='check' color="#fff"></box-icon>`)

                }else{
                    this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            }
        },
        async activarCliente(){
            let token = this.$session.get('token')
            const res = await fetch(this.url+`cliente/activate/${this.dataCli.id}`,{
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*",
                    'Authorization': token
                },
            })
            const data = await res.json();
            if(data.status == 401){ this.activarReboot = true }
            if(data.status == 200){
                this.refresh()
                this.active = false
                this.$emit('updatePage', '200')
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Registrado Correctamente`, 'success', 'top-center',`<box-icon name='check' color="#fff"></box-icon>`)

            }else{
                this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
            }
        },
        async updateCliente(){
            let token = this.$session.get('token')

            let json = {
                "nombre": this.nombreUp,
                "clave": this.claveUp,
                "idCliente": this.dataCli.id,
            };
            let res = await fetch(this.url+"cliente/update",{
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
                //se actualiza token
                this.active = false
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Registrado Correctamente`, 'success', 'top-center',`<box-icon name='check' color="#fff"></box-icon>`)
                this.$emit('updatePage', '200')
            }else{
                this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
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
.card{
    border-radius: 1rem;
}
</style>
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