<template>
    <div>

        <b-container class="bv-example-row">
            <b-card v-if="!proceso.nombre" style="height: 9rem;">
                <b-skeleton animation="throb" class="mt-3" width="85%"></b-skeleton>
                <b-skeleton animation="throb" class="mt-3" width="100%"></b-skeleton>
                <b-skeleton animation="throb" class="mt-3" width="55%"></b-skeleton>
            </b-card>

            <b-card v-else @click="active=!active">
                <b-skeleton animation="throb" width="85%" v-if="!data.nombre"></b-skeleton>
                <div class="d-flex flex-row bd-highlight mb-3" v-else>
                    <div class="bd-highlight">
                        <box-icon name='radio-circle-marked' :color="data.estado == 1 ? '#32ff00' : '#ff0023'" ></box-icon>
                    </div>
                    <div class="bd-highlight">
                        {{data.nombre}}
                    </div>
                </div>
                <b-skeleton animation="throb" width="100%" v-if="!cliente.nombre"></b-skeleton>
                <div v-else>
                    <p class="fw-bold">
                        {{cliente.nombre}} 
                    </p>
                </div>
                <b-skeleton animation="throb" width="55%" v-if="!proceso.nombre"></b-skeleton>
                <div v-else>
                    <p class="fw-lighter">
                        {{proceso.nombre}}
                    </p>
                </div>
            </b-card>
        </b-container>

        <vs-dialog blur v-model="active">
            <template #header>
                <h4 class="not-margin">
                    Editar <b>Prenda</b>
                </h4>
            </template>


            <div class="con-form">
                <template>

                    <vs-input class="mt-3" success type="text" v-model="nombre" label-placeholder="Nombre">
                        <template #icon>
                            <box-icon name='wind'></box-icon>
                        </template>
                    </vs-input>
                    <vs-input class="mt-3" success type="text" v-model="cantidadBolsa" label-placeholder="Cantidad de prendas por bolsa">
                        <template #icon>
                            <box-icon name='wind'></box-icon>
                        </template>
                    </vs-input>
                    <b-skeleton class="mt-4" type="input" v-if="clienteSelect.length == 0"></b-skeleton>
                    <div class="con-selects mt-4" v-else>
                        <vs-select label-placeholder="Cliente" color="success"  v-model="selectCliente" >
                            <vs-option  v-for="(cli, i) in clienteSelect" :key="i" :label="cli.nombre" :value="cli.id">
                                {{cli.nombre}}
                            </vs-option>
                        </vs-select>
                    </div>
                    <b-skeleton class="mt-5" type="input" v-if="procesoSelect.length == 0"></b-skeleton>

                    <div class="con-selects mt-5" v-else>
                        <vs-select label-placeholder="Tipo de proceso" color="success"  v-model="selectProceso" >
                            <vs-option  v-for="(proceso, i) in procesoSelect" :key="i" :label="proceso.nombre" :value="proceso.id">
                                {{proceso.nombre}}
                            </vs-option>
                        </vs-select>
                    </div>
                    
                </template>
            </div>

            <template #footer>
                <div class="con-footer mt-4">
                    <vs-button class="m-1" success
                        flat
                        :btnActualizar="btnActualizar == 1"
                        @click="update(data.id)">
                        Actualizar
                    </vs-button>
                    <div v-if="(data.estado == 1)" class="">
                        <vs-button class="m-1" danger
                            flat
                            :btnActualizar="btnElimina == 1"
                            @click="active2=!active2">
                            Desactivar
                        </vs-button>
                    </div>
                    <div v-else>
                        <vs-button class="m-1" success
                            flat
                            :btnActualizar="btnElimina == 1"
                            @click="activar()">
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
            <ConfirmComponent @confirm="deletePrenda"/>
        </vs-dialog>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>

    </div>
    
</template>
<script>

import ConfirmComponent from '@/components/confirm.vue'
import { fetchApi, refreshSession } from "@/service/service.js"
import loginComponent from './cardLogin.vue';

export default {
    name: 'CardLavadoraComponent',
    props: {
        data: Object,
    },
    data:() => ({
        selectProceso: '',
        selectCliente: '',
        estado: '',
        tiposLavado: [],
        cliente: '',
        proceso: '',
        procesoSelect: [],
        clienteSelect: [],
        active: false,
        active2: false,
        tipoLavado: '',
        nombre: '',
        cantidadBolsa: '',
        btnElimina: 0,
        btnActualizar: 0,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    components: {
        ConfirmComponent,
        loginComponent
    },
    mounted(){
        setTimeout(() => {
            this.estado = this.data.estado == 1 ? true : false
            this.mostraCliente()
            this.mostraProceso()
            this.mostraTipoProceso()
            this.mostraTipoClientes()
            this.selectProceso = this.data.proceso
            this.selectCliente = this.data.cliente
            this.nombre = this.data.nombre
            this.cantidadBolsa = this.data.cantidadBolsa
        }, 1500)
    },
    methods: {
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
    
        async mostraCliente(){

            fetchApi(this.url+`cliente/findById/${this.data.cliente}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.cliente = data.datos
                }else{
                    this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })

        },
        async mostraProceso(){

            fetchApi(this.url+`proceso/findById/${this.data.proceso}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.proceso = data.datos
                }else{
                    this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })

        },
        async mostraTipoProceso(){
            fetchApi(this.url+'proceso/findAll', 'GET', this.$session.get('token'))
            .then(data => {
                this.procesoSelect = []
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.procesoSelect = data.datos

                }else{
                    this.openNotification('Ocurrio un error al obtener los datos', `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },
        async mostraTipoClientes(){
            fetchApi(this.url+'cliente/findByEstado/1', 'GET', this.$session.get('token'))
            .then(data => {
                this.clienteSelect = []
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.clienteSelect = data.datos
                }else{
                    this.openNotification('Ocurrio un error al obtener los datos', `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },
        async deletePrenda(status){
            if(status == 200){
                let token = this.$session.get('token')
                const res = await fetch(this.url+`prenda/delete/${this.data.id}`,{
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
        async activar(){
            let token = this.$session.get('token')
            const res = await fetch(this.url+`lavadora/activate/${this.data.id}`,{
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
        async update(){
            let token = this.$session.get('token')

            let json = {
                "idCliente": this.selectCliente,
                "nombre": this.nombre,
                "idPrenda": this.data.id,
                "idProceso": this.selectProceso,
                "cantidadBolsa": this.cantidadBolsa,
            };
            let res = await fetch(this.url+"prenda/update",{
                method: "PUT",
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
        },
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
.card{
    border-radius: 1rem;
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