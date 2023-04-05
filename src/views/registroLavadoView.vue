<template>
    <div>
        <HeaderComponent/>
        <br>
    
        <b-container fluid class="mt-5">
            <template>
                <div>
                    <b-container class="bv-example-row">
                        <b-card>
                            <b-row>
                                <b-col class="mt-4" lg="6" md="6" sm="12">
                                    <vs-input state="primary" primary v-model="nombreProceso" label-placeholder="Nombre del Proceso">
                                        <template #icon>
                                            <box-icon name='rename'></box-icon>
                                        </template>
                                    </vs-input>
                                </b-col>
                                <b-col class="mt-4" lg="6" md="6" sm="12">
                                    <vs-input state="primary" primary v-model="codigoProceso" label-placeholder="Clave del Proceso">
                                        <template #icon>
                                            <box-icon name='dialpad-alt'></box-icon>
                                        </template>
                                    </vs-input>
                                </b-col>
                            </b-row>
                        </b-card>
                        <b-card class="mt-4" title="Asignación de Pasos">
                            <b-row class="mt-4">
                                
                                <b-col class="mt-2" lg="6" md="6" sm="12">
                                    <vs-input state="primary" primary v-model="nombre" label-placeholder="Nombre del Proceso">
                                        <template #icon>
                                            <box-icon name='rename'></box-icon>
                                        </template>
                                    </vs-input>
                                </b-col>
                                <b-col class="mt-2" lg="6" md="6" sm="12">
                                    <vs-input state="primary" primary v-model="descripcion" label-placeholder="Descripción del Proceso">
                                        <template #icon>
                                            <box-icon name='rename'></box-icon>
                                        </template>
                                    </vs-input>
                                </b-col>
                                
                                <b-col class="mt-4" lg="6" md="6" sm="12">
                                    <div class="con-selects">
                                        <label for="floatingSelect">Selecciona el tipo de Lavado</label>
                                        <div class="form-floating">
                                            <b-form-select style="height: 1rem;" class="form-select"  v-model="tipoLavado" :options="tipoLavados"  size="sm"></b-form-select>
                                            <label for="floatingSelect">Selecciona una Opción</label>
                                        </div>
                                    </div>
                                    <b-card v-if="tipoLavado != ''" :title="tipoLavado.nombre" tag="article" class="mb-2 mt-3">
                                    </b-card> 
                                </b-col>
                                <b-col class="mt-4" lg="6" md="6" sm="12">
                                    <div class="con-selects">
                                        <label for="floatingSelect">Selecciona el tipo de Programa</label>
                                        <div class="form-floating">
                                            <b-form-select style="height: 1rem;" class="form-select"  v-model="lavado" :options="lavados"  size="sm"></b-form-select>
                                            <label for="floatingSelect">Selecciona una Opción</label>
                                        </div>
                                    </div>
                                    <b-card v-if="lavado != ''" :title="lavado.nombre" tag="article" class="mb-2 mt-3">
                                        <b-card-text>
                                            <b-row>
                                                <b-col>
                                                    <p class="fw-bold">{{lavado.descripcion}}</p>
                                                </b-col>
                                                <b-col>
                                                    <b>Capacidad:</b>
                                                    <ul class="list-group list-group-horizontal">
                                                        <li class="list-group-item">Minima: {{ lavado.minima }}</li>
                                                        <li class="list-group-item">Maxima: {{ lavado.maxima }}</li>
                                                    </ul>
                                                </b-col>
                                            </b-row>
                                        </b-card-text>
                                    </b-card> 
                                </b-col>
                                <div class="con-switch mt-5">
                                    <b-row>
                                        <b-col class="mt-2" cols="2" v-for="(rol, i) in allRoles" :key="i">
                                            <vs-switch  :val="rol.id" v-model="optionsRoles">
                                                {{ rol.nombre }}
                                            </vs-switch>
                                        </b-col>
                                    </b-row>
                                </div>
                                <b-container class="mt-3">
                                    <vs-button
                                        success
                                        flat
                                        :active="Agregar == 1"
                                        @click="addPaso()"
                                    >
                                        Asignar Paso
                                    </vs-button>
                                </b-container>
                            </b-row>
                        </b-card>
                        <b-row>
                            <b-col class="mt-3 mb-3" lg="4" md="6" sm="6" v-for="(paso, i) in pasos" :key="i">
                                <b-card :title="paso.nombre" tag="article" class="mb-2">
                                    <b-card-text>
                                        {{paso.descripcion}}
                                    </b-card-text>
                                    <vs-button
                                        danger
                                        block
                                        @click="deletePaso(paso.id)"
                                    >
                                        Eliminar
                                    </vs-button>
                                </b-card>
                            </b-col>
                        </b-row>
                        <b-row>
                                <b-col lg="12" class="pb-2"><vs-button success size="large" @click="addProceso()">Guardar Registro</vs-button></b-col>
                        </b-row>
                    </b-container>
                </div>
            </template>
        </b-container>
        <br>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>

    </div>
</template>
<script>
import HeaderComponent from '@/components/Header.vue';
import { fetchApi, refreshSession } from "@/service/service.js"
import loginComponent from '@/components/cardLogin.vue';


export default {
    name:"PrendasView",
    data: () => ({
        options: [
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
      ],
        allRoles: [],
        lavados: [],
        tipoLavados: [],
        lavado: '',
        tipoLavado: '',
        nombreProceso: '',
        codigoProceso: '',
        descripcion: '',
        nombre: '',
        orden: 1,
        contador: 0,
        optionsRoles: [],
        pasos: [],
        Agregar: 0,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    components: {
        HeaderComponent,
        loginComponent
    },
    created(){
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })
    },
    mounted(){    
        this.mostraRoles()
        this.mostrarLavados()
        this.mostrarTipoLavados()
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
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.allRoles = data.datos
                }else{
                    this.openNotification('Ocurrio un error al obtener los datos', `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },
        mostrarLavados(){
            fetchApi(this.url+'lavadora/programa/findByAll', 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.lavados.push({"value": {id: 0, nombre: "No Aplica", descripcion: "El Proceso no requiere lavado", maxima: "No Requiere Capacidad", minima: "No Requiere Capacidad"}, "text": "No Aplica"})
                    data.datos.forEach( value => {
                        this.lavados.push({"value": {id: value.id, nombre: value.nombre, descripcion: value.descripcion, maxima: value.cantidadMaxima, minima: value.cantidadMinima}, "text": value.nombre})
                    })
                }else{
                    this.openNotification('Ocurrio un error al obtener los datos', `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },  
        
        mostrarTipoLavados(){
            fetchApi(this.url+'tipoLavado/findAll', 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.tipoLavados.push({"value": 0, "text": "No Aplica"})
                    data.datos.forEach( value => {
                        this.tipoLavados.push({"value": {id: value.id, nombre: value.nombre }, "text": value.nombre})
                    })
                }else{
                    this.openNotification('Ocurrio un error al obtener los datos', `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },  
        deletePaso(id){
            this.pasos = this.pasos.filter(paso => paso.id != id)
        },
        async addPaso(){
            let error = []
            if(this.descripcion == ''){
                error.push("<br>Es Requerido el campo Descripción")
            }
            if(this.nombre == ''){
                error.push("<br>Es Requerido el campo Nombre")
            }
            if(this.optionsRoles.length == 0){
                error.push("<br>Es Requerido seleccionar un Rol")
            }
            
            if(this.lavado == ''){
                error.push("<br>Es Requerido seleccionar un Lavado")
            }
            let pasos = {
                "id": this.contador,
                "descripcion": this.descripcion,
                "nombre": this.nombre,
                "orden": this.orden++,
                "rolesCambio": this.optionsRoles,
                "idProgramaLavado": this.lavado.id, 
                "idTipoLavado": this.tipoLavado.id
            }
            if(error.length == 0){
                this.pasos.push(pasos)
                this.contador++
                this.descripcion = ''
                this.nombre = ''
                this.optionsRole = []
                this.lavado = ''
                this.tipoLavado = ''

            }else{
                this.openNotification(`Error: Al agregar un Paso`, `${error}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
            }

        },
        async addProceso(){
            let token = this.$session.get('token')

            let json = {
                "nombreProceso": this.nombreProceso,
                "codigo": this.codigoProceso,
                "pasos": this.pasos,
            };
            let res = await fetch(this.url+"proceso/register",{
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
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Registrado Correctamente`, 'success', 'top-center',`<box-icon name='check' color="#fff"></box-icon>`)
                this.updatePage(200)
            }else{
                this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
            }
        },
        async updatePage(status){
            if(status == 200){
                this.mostraRoles()
                this.pasos = []
                this.contador = 0
                this.descripcion = ''
                this.nombre = ''
                this.optionsRole = []
                this.lavado = ''
                this.tipoLavado = ''
                this.codigoProceso = ''
                this.nombreProcesos = ''

                // location.reload();
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
.form-select{
    background: rgba(var(--vs-primary), 0.1) !important;
    color: rgba(var(--vs-primary), 1);
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
