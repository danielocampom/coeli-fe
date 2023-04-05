<template>
    <div>
        <b-card v-if="render">
            <b-skeleton animation="throb" width="100%"></b-skeleton>
        </b-card>

        <b-card v-else @click="active=!active" >
            <div class="d-flex flex-row bd-highlight">
                <div class="p-1 bd-highlight">
                    <box-icon name='radio-circle-marked' :color="dataWasher.estado == 1 ? '#32ff00' : '#ff0023'" ></box-icon>
                </div>
                <div class="p-1 bd-highlight">
                    {{dataWasher.nombre}}
                </div>
                <br>
            </div>
        </b-card>
        <b-modal size="xl" centered v-model="active">
            <template #modal-header="{ close }">
                <h5>Editar Lavadora</h5>
                <vs-button circle icon floating danger @click="close()">
                    <box-icon name='x' color="#fff"></box-icon>
                </vs-button>
            </template>
            <template>
                <div class="con-form">
                    <b-card>
                        <b-row>
                            <b-col class="mt-4" lg="6" md="6" sm="12">
                                <vs-input success type="text" v-model="nombreUp" placeholder="Lavadora">
                                    <template #icon>
                                        <box-icon name='wind'></box-icon>
                                    </template>
                                </vs-input>
                            </b-col>
                            <b-col class="mt-5" lg="6" md="6" sm="12">
                                <div class="con-selects">
                                    <label for="floatingSelect">Selecciona tipo de lavado</label>
                                    <b-skeleton type="input" v-if="tiposLavado.length == 0"></b-skeleton>
                                    <vs-select v-else placeholder="Tipo de Lavado" color="success"  v-model="tipoLavado" >
                                        <vs-option  v-for="(lavado, i) in tiposLavado" :key="i" :label="lavado.nombre" :value="lavado.id">
                                            {{lavado.nombre}}
                                        </vs-option>
                                    </vs-select>
                                </div>
                            </b-col>
                        </b-row>
                    </b-card>
                    <b-row>
                        <b-col class="mt-4" lg="8" md="6" sm="12">
                            <b-card title="Programas de Lavado" sub-title="Capacidad y programas de lavado">
                                <b-row>
                                    <b-col class="mt-2" lg="8" md="8" sm="10">
                                        <label for="floatingSelect">Selecciona tipo de programa</label>
                                        <b-skeleton type="input" v-if="programasItems.length == 0"></b-skeleton>
                                        <vs-select v-else  placeholder="Tipo de programa" color="success"  v-model="progLavado" >
                                            <vs-option  v-for="(it, i) in programasItems" :key="i" :label="it.nombre" :value="it.id">
                                                {{it.nombre}}
                                            </vs-option>
                                        </vs-select>
                                    </b-col>
                                    <b-col class="mt-2" lg="4" md="4" sm="2">
                                        <vs-button class="float-right" circle icon floating @click="add(progLavado)">
                                            <box-icon name='plus' color='#fbfbfb' ></box-icon>
                                        </vs-button>
                                    </b-col>
                                </b-row>
                            </b-card>
                        </b-col>
                        <b-col class="mt-2" lg="4" md="6" sm="12" v-for="(pl, i) in programas" :key="i">
                            <b-card :title="pl.nombre">
                                <b-list-group>
                                    <b-list-group-item>Descipción: {{ pl.descripcion }}</b-list-group-item>
                                    <b-list-group-item>Capacidad Minima: {{ pl.cantidadMinima }}</b-list-group-item>
                                    <b-list-group-item>Capacidad Maxima: {{ pl.cantidadMaxima }}</b-list-group-item>
                                    <vs-button
                                            danger
                                            size="small"
                                            @click="elim(pl.id)"
                                        >
                                            <box-icon name='trash' color="#FFF"></box-icon> Eliminar
                                    </vs-button>
                                </b-list-group>
                            </b-card>
                        </b-col>
                    </b-row>
                </div>
            </template>

            <template #modal-footer="{ ok }">
                <vs-button success
                    flat
                    :btnActualizar="btnActualizar == 1"
                    @click="update(dataWasher.id)">
                    Actualizar
                </vs-button>
                <div v-if="(dataWasher.estado == 1)" class="">
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
                        @click="activar()">
                        Activar
                    </vs-button>
                </div>
                <vs-button danger @click="ok()">
                    <box-icon name='exit' color="#fff"></box-icon> Salir
                </vs-button>
            </template>
            
        </b-modal>
        <!-- <vs-dialog blur v-model="active">
            <template #header>
                <h4 class="not-margin">
                    Editar <b>Lavadora</b>
                </h4>
            </template>


            <div class="con-form">
                <template>
                    <div class="center content-inputs">
                        <vs-input success type="text" v-model="nombreUp" placeholder="Lavadora">
                            <template #icon>
                                <box-icon name='wind' dark></box-icon>
                            </template>
                        </vs-input>
                    </div>
                        <div class="con-selects">
                            <b-skeleton type="input" v-if="tiposLavado.length == 0"></b-skeleton>
                            <vs-select v-else placeholder="Tipo de Lavado" color="success" v-model="tipoLavado">
                                <vs-option  v-for="(lavado, i) in tiposLavado" :key="i" :label="lavado.nombre" :value="lavado.id">
                                    {{lavado.nombre}}
                                </vs-option>
                                   
                            </vs-select>
                        </div>
                </template>
            </div>

            <template #footer>
                <div class="con-footer mt-4">
                    <vs-button success
                        flat
                        :btnActualizar="btnActualizar == 1"
                        @click="update(dataWasher.id)">
                        Actualizar
                    </vs-button>
                    <div v-if="(dataWasher.estado == 1)" class="">
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
                            @click="activar()">
                            Activar
                        </vs-button>
                    </div>
                </div>
            </template>
        </vs-dialog> -->
        
        <vs-dialog v-model="active2">
            <template #header>
                <h4 class="not-margin">
                    Estas seguro que deseas <b>Desactivarlo?</b>
                </h4>
            </template>
            <ConfirmComponent @confirm="deleteWasher"/>
        </vs-dialog>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>

    </div>
    
</template>
<script>

import ConfirmComponent from '@/components/confirm.vue'
import loginComponent from './cardLogin.vue';
import { refreshSession, fetchApi } from "@/service/service.js"


export default {
    name: 'CardLavadoraComponent',
    props: {
        dataWasher: Object,
    },
    data:() => ({
        estado: '',
        contador: 0,
        programasItems: [],
        tiposLavado: [],
        programas: [],
        active: false,
        active2: false,
        tipoLavado: '',
        progLavado: '',
        nombreUp: '',
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
        this.mostraProgramas()
        this.mostrarTodosLavados()
        setTimeout(() => {
            this.render = false
            this.estado = this.dataWasher.estado == 1 ? true : false
            this.tipoLavado = this.dataWasher.clave
            this.nombreUp = this.dataWasher.nombre
            this.mostraTipoLavado()
        }, 1500)
    },
    methods: {
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        add(id){
            if(id){
                this.contador++
                fetchApi(this.url+`lavadora/programa/findById/${id}`, 'GET', this.$session.get('token'))
                .then(data => {
                    if(data.status == 401){ this.activarReboot = true }
                    if(data.status == 200){
                        let pl = data.datos
                        this.programas.push({"id": this.contador, "nombre": pl.nombre, "descripcion": pl.descripcion, "cantidadMinima": pl.cantidadMinima, "cantidadMaxima": pl.cantidadMaxima, "idPrograma": pl.id })
                    }else{
                        this.openNotification('Ocurrio un error al obtener los datos', `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                    }
                })
            }else{
                this.openNotification('Ocurrio un error', `Es requerido seleccionar algun programa de lavado`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)

            }
        },
        elim(id){
            this.programas = this.programas.filter(dt => dt.id != id)
        },
        async mostraProgramas(){
            this.contador++

            this.dataWasher.programas.forEach(programa => {
                fetchApi(this.url+`lavadora/programa/findById/${programa}`, 'GET', this.$session.get('token'))
                .then(data => {
                    this.tiposLavado = []
                    if(data.status == 401){ this.activarReboot = true }
                    if(data.status == 200){
                        this.programas.push({"id": this.contador, "nombre": data.datos.nombre, "descripcion": data.datos.descripcion, "cantidadMinima": data.datos.cantidadMinima, "cantidadMaxima": data.datos.cantidadMaxima, "idPrograma": data.datos.id })

                    }else{
                        this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                    }
                })
            });
        },
        async mostraTipoLavado(){
            fetchApi(this.url+'tipoLavado/findAll', 'GET', this.$session.get('token'))
            .then(data => {
                this.tiposLavado = []
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.tiposLavado = data.datos
                }else{
                    this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },
        async mostrarTodosLavados(){
            fetchApi(this.url+'lavadora/programa/findByAll', 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    data.datos.forEach( val => {
                        this.programasItems.push({ maxCant: val.cantidadMaxima, minCant: val.cantidadMinima, descripcion: val.descripcion, nombre: val.nombre, id: val.id },)
                    })

                }else{
                    this.openNotification('Ocurrio un error al obtener los datos', `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },
        async deleteWasher(status){
            if(status == 200){
                let token = this.$session.get('token')
                const res = await fetch(this.url+`lavadora/delete/${this.dataWasher.id}`,{
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
            const res = await fetch(this.url+`lavadora/activate/${this.dataWasher.id}`,{
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
            let pogramLav = []
            this.programas.forEach( pl => {
                pogramLav.push(pl.idPrograma)
            })
            let json = {
                "lavadora": this.nombreUp,
                "idTipoLavado": this.tipoLavado,
                "idLavadora": this.dataWasher.id,
                "programasLavado": pogramLav
            };
            let res = await fetch(this.url+"lavadora/update",{
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