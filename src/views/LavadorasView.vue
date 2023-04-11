<template>
    <div>
        <HeaderComponent/>
        <br>
    
        <b-container fluid class="mt-3">
            <template>
                <b-row  class="center">
                    <b-col class="mt-4  centerAll" lg="4" md="6" sm="12">
                        <vs-card>
                            <template #img>
                                <vs-input state="dark" @keyup="searchWasher()" dark v-model="buscarTxt" placeholder="Buscar Lavadora">
                                    <template #icon>
                                        <box-icon name='wind' dark></box-icon>
                                    </template>
                                </vs-input>
                                <vs-button
                                    transparent 
                                    :active="btnBuscar == 1"
                                    @click="searchWasher()"
                                >
                                    <box-icon name='search-alt-2' color="#195bff"></box-icon> Buscar
                                </vs-button>
                            </template>
                        </vs-card>
                    </b-col>
                    <b-col class="mt-4  centerAll" lg="4" md="6" sm="12">
                        <vs-card>
                            <template #img>
                                <vs-button flat icon @click="activeModalListLavado =! activeModalListLavado">
                                    <box-icon name='list-ul' color="#195bff" ></box-icon> Ver Lista de Lavados
                                </vs-button>
                                <b-modal size="xl" centered v-model="activeModalListLavado">
                                    <template #modal-header="{ close }">
                                        <h5>Todos los lavados</h5>
                                        <vs-button circle icon floating danger @click="close()">
                                            <box-icon name='x' color="#fff"></box-icon>
                                        </vs-button>
                                    </template>
                                    <template>
                                        <b-container fluid>
                                            <!-- User Interface controls -->
                                            <b-row>

                                            <b-col lg="6" class="my-1">
                                                <b-form-group
                                                label="Buscar"
                                                label-for="filter-input"
                                                label-cols-sm="3"
                                                label-align-sm="right"
                                                label-size="sm"
                                                class="mb-0"
                                                >
                                                <b-input-group size="sm">
                                                    <b-form-input
                                                    id="filter-input"
                                                    v-model="filter"
                                                    type="search"
                                                    placeholder="Buscar"
                                                    ></b-form-input>

                                                    <b-input-group-append>
                                                    <b-button :disabled="!filter" @click="filter = ''" variant="danger">X</b-button>
                                                    </b-input-group-append>
                                                </b-input-group>
                                                </b-form-group>
                                            </b-col>

                                            <b-col sm="5" md="6" class="my-1">
                                                <b-form-group
                                                label="registros"
                                                label-for="per-page-select"
                                                label-cols-sm="6"
                                                label-cols-md="4"
                                                label-cols-lg="3"
                                                label-align-sm="right"
                                                label-size="sm"
                                                class="mb-0"
                                                >
                                                <b-form-select
                                                    id="per-page-select"
                                                    v-model="perPage"
                                                    :options="pageOptions"
                                                    size="sm"
                                                ></b-form-select>
                                                </b-form-group>
                                            </b-col>

                                            <b-col sm="7" md="6" class="my-1">
                                                <b-pagination
                                                v-model="currentPage"
                                                :total-rows="totalRows"
                                                :per-page="perPage"
                                                align="fill"
                                                size="sm"
                                                class="my-0"
                                                ></b-pagination>
                                            </b-col>
                                            </b-row>

                                            <!-- Main table element -->
                                            <b-table
                                            :items="items"
                                            :fields="fields"
                                            :current-page="currentPage"
                                            :per-page="perPage"
                                            :filter="filter"
                                            :filter-included-fields="filterOn"
                                            :sort-by.sync="sortBy"
                                            :sort-desc.sync="sortDesc"
                                            :sort-direction="sortDirection"
                                            label-sort-asc=""
                                            label-sort-desc=""
                                            label-sort-clear=""
                                            stacked="md"
                                            show-empty
                                            small
                                            @filtered="onFiltered"
                                            >
                                            <template #cell(actions)="row">
                                                <vs-button circle icon floating danger @click="eliminarLavado(row.item.id)">
                                                    <box-icon name='trash' color="#fff"></box-icon>
                                                </vs-button>
                                            </template>

                                            <template #row-details="row">
                                                <b-card>
                                                <ul>
                                                    <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
                                                </ul>
                                                </b-card>
                                            </template>
                                            </b-table>

                                        </b-container>
                                    </template>
                        
                                    <template #modal-footer="{ ok }">
                                        <vs-button danger @click="ok()">
                                            <box-icon name='exit' color="#fff"></box-icon> Salir
                                        </vs-button>
                                    </template>
                                    
                                </b-modal>
                                <vs-button flat icon @click="activeModalAddLavado=!activeModalAddLavado">
                                    <box-icon name='clipboard' color="#195bff" ></box-icon> Agregar Lavado
                                </vs-button>
                                <vs-dialog v-model="activeModalAddLavado">
                                    <template #header>
                                    <h4 class="not-margin">
                                        Registrar <b>Lavado</b>
                                    </h4>
                                    </template>
                        
                                    <div class="con-form">
                                        <vs-input success class="mt-3" type="text" v-model="nomLavado" label-placeholder="nombre">
                                            <template #icon>
                                                <box-icon name='rename'></box-icon>
                                            </template>
                                        </vs-input>
                                        <vs-input success class="mt-3" type="text" v-model="desLavado" label-placeholder="descripcion">
                                            <template #icon>
                                                <box-icon name='rename'></box-icon>
                                            </template>
                                        </vs-input>

                                        <vs-input success class="mt-3" type="text" v-model="canMin" label-placeholder="Cantidad Minima">
                                            <template #icon>
                                                <box-icon name='dialpad-alt' ></box-icon>
                                            </template>
                                        </vs-input>
                                        <vs-input success class="mt-3" type="text" v-model="canMax" label-placeholder="Cantidad Maxima">
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
                                                @click="addPrograma()">
                                                Guardar
                                            </vs-button>
                                        </div>
                                    </template>
                                </vs-dialog>
                            </template>
                        </vs-card>
                    </b-col>
                    <b-col class="mt-4  centerAll" lg="4" md="6" sm="12">
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
                                    <box-icon name='wind' color="#195bff" ></box-icon> Agregar Lavadora
                                </vs-button>
                                
                                <b-modal size="xl" centered v-model="activeModal">
                                    <template #modal-header="{ close }">
                                        <h5>Agregar Lavadora</h5>
                                        <vs-button circle icon floating danger @click="close()">
                                            <box-icon name='x' color="#fff"></box-icon>
                                        </vs-button>
                                    </template>
                                    <template>
                                        <div class="con-form">
                                            <b-card>
                                                <b-row>
                                                    <b-col class="mt-4" lg="6" md="6" sm="12">
                                                        <vs-input success type="text" v-model="nombreLav" placeholder="Lavadora">
                                                            <template #icon>
                                                                <box-icon name='wind'></box-icon>
                                                            </template>
                                                        </vs-input>
                                                    </b-col>
                                                    <b-col class="mt-5" lg="6" md="6" sm="12">
                                                        <div class="con-selects">
                                                            <vs-select placeholder="Tipo de Lavado" color="success"  v-model="tipoLavado" >
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
                                                                <vs-select placeholder="Tipo de Lavado" color="success"  v-model="progLavado" >
                                                                    <vs-option  v-for="(it, i) in items" :key="i" :label="it.nombre" :value="it.id">
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
                                                <b-col class="mt-2" lg="4" md="6" sm="12" v-for="(pl, i) in programasLavado" :key="i">
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
                                        <vs-button primary @click="addWasher()">
                                            <box-icon name='save' color="#fff"></box-icon> Guardar
                                        </vs-button>
                                        <vs-button danger @click="ok()">
                                            <box-icon name='exit' color="#fff"></box-icon> Salir
                                        </vs-button>
                                    </template>
                                    
                                </b-modal>
                            </template>
                        </vs-card>
                    </b-col>
                </b-row>
            </template>
        </b-container>
        <br>
        <b-container class="bv-example-row">
            <b-row>
                <b-col class="mt-4" lg="3" md="6" sm="12" v-for="(lavadora, i) in lavadoras" :key="i">
                    <CardLavadoraComponent @updatePage="updatePage" :dataWasher="{nombre: lavadora.lavadora, estado: lavadora.idEstado, clave: lavadora.tipoLavado, id: lavadora.idLavadora, capacidad: lavadora.capacidad, programas: lavadora.programasLavado}" />
                </b-col>
            </b-row>
            <vs-alert v-if="sinData" shadow danger>
                <template #title>
                    No se han encontrado coincidencias
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
import CardLavadoraComponent from '@/components/cardLavadora.vue'
import { fetchApi, refreshSession } from "@/service/service.js"
import loginComponent from '@/components/cardLogin.vue';

export default {
    name:"lavadorasView",
    data: () => ({
        items: [],
        fields: [
          { key: 'nombre', label: 'Nombre', sortable: true, sortDirection: 'desc' },
          { key: 'descripcion', label: 'Descripción', sortable: true, class: 'text-center' },
          {
            key: 'maxCant',
            label: 'Canitidad Máxima',
            sortable: true,
            sortByFormatted: true,
            filterByFormatted: true
          },
          {
            key: 'minCant',
            label: 'Canitidad Mínima',
            sortable: true,
            sortByFormatted: true,
            filterByFormatted: true
          },
          { key: 'actions', label: 'Acciones' }
        ],
        
        totalRows: 1,
        currentPage: 1,
        perPage: 5,
        pageOptions: [5, 10, 15, { value: 100, text: "mostrar Todo" }],
        sortBy: '',
        sortDesc: false,
        sortDirection: 'asc',
        filter: null,
        filterOn: [],
        infoModal: {
          id: 'info-modal',
          title: '',
          content: ''
        },
        lavadoras: [],
        programasLavado: [],
        contador: 0,
        tiposLavado: [],
        sinData: false,
        activeModal: false,
        activeModalListLavado: false,
        activeModalAddLavado: false,
        nombreLav: '',
        tipoLavado: '',
        progLavado: '',
        nomLavado: '',
        desLavado: '',
        canMax: '',
        canMin: '',
        btnGuardar: 0,
        buscarAct: false,
        buscarTxt: '',
        btnBuscar: 0,
        hidden: true,

        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,

    }),
    components: {
        HeaderComponent,
        CardLavadoraComponent,
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
        this.mostraTipoLavado()
        this.mostrarTodosLavados()
        this.totalRows = this.items.length 
        
        
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
                        this.programasLavado.push({"id": this.contador, "nombre": pl.nombre, "descripcion": pl.descripcion, "cantidadMinima": pl.cantidadMinima, "cantidadMaxima": pl.cantidadMaxima, "idPrograma": pl.id })
                    }else{
                        this.openNotification('Ocurrio un error al obtener los datos', `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                    }
                })
            }else{
                this.openNotification('Ocurrio un error', `Es requerido seleccionar algun programa de lavado`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)

            }
        },
        elim(id){
            this.programasLavado = this.programasLavado.filter(dt => dt.id != id)
        },
        eliminarLavado(data){
            let token = this.$session.get('token')

            fetch(this.url+`lavadora/programa/delete/${data}`,{
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*",
                    'Authorization': token
                },
            })
            .then(res => res.json())
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.refresh()
                    this.activeModalListLavado = false
                    this.openNotification(`Exito: ${data.mensaje}`, `Se ha Eliminado Correctamente`, 'success', 'top-center',`<box-icon name='check' color="#fff"></box-icon>`)
                    this.mostrarTodosLavados()
                    
                    this.totalRows = this.items.length 
                }else{
                    this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })

        },
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length
            this.currentPage = 1
        },
        async mostraTipoLavado(){
            this.tiposLavado = []
            fetchApi(this.url+'tipoLavado/findAll', 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.tiposLavado = data.datos
                }else{
                    this.openNotification('Ocurrio un error al obtener los datos', `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },
        async mostrarTodos(){
            fetchApi(this.url+'lavadora/findAll', 'GET', this.$session.get('token'))
            .then(data => {
                this.lavadoras = []
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.lavadoras = data.datos
                    if(this.lavadoras.length == 0){
                        this.sinData == true
                    }
                }else{
                    this.openNotification('Ocurrio un error al obtener los datos', `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },
        async mostraActivos(){
            fetchApi(this.url+'lavadora/findByEstado/1', 'GET', this.$session.get('token'))
            .then(data => {
                this.lavadoras = []
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.lavadoras = data.datos
                    if(this.lavadoras.length == 0){
                        this.sinData == true
                    }
                }else{
                    this.openNotification('Ocurrio un error al obtener los datos', `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },
        async mostraInactivos(){

            fetchApi(this.url+'lavadora/findByEstado/7', 'GET', this.$session.get('token'))
            .then(data => {
                this.lavadoras = []
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.lavadoras = data.datos
                    if(this.lavadoras.length == 0){
                        this.sinData == true
                    }
                }else{
                    this.openNotification('Ocurrio un error al obtener los datos', `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },
        mostrarActInact(){
            this.buscarAct ? this.mostraActivos() : this.mostraInactivos()
        },
        async mostrarTodosLavados(){
            this.items = []
            fetchApi(this.url+'lavadora/programa/findByAll', 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    data.datos.forEach( val => {
                        this.items.push({ maxCant: val.cantidadMaxima, minCant: val.cantidadMinima, descripcion: val.descripcion, nombre: val.nombre, id: val.id },)
                    })
                    this.totalRows = this.items.length 

                }else{
                    this.openNotification('Ocurrio un error al obtener los datos', `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },
        async addPrograma(){
            let token = this.$session.get('token')

            let json = {
                "nombre": this.nomLavado,
                "descripcion": this.desLavado,
                "cantidadMinima": this.canMin,
                "cantidadMaxima": this.canMax
            };
            let res = await fetch(this.url+"lavadora/programa/save",{
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
                this.mostraTipoLavado()
                this.mostrarTodosLavados()

                this.canMax = ''
                this.canMin = ''
                this.desLavado = ''
                this.nomLavado = ''
            }else{
                this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
            }
        },
        async addWasher(){
            let token = this.$session.get('token')
            let pogramLav = []
            this.programasLavado.forEach( pl => {
                pogramLav.push(pl.idPrograma)
            })
            let json = {
                "lavadora": this.nombreLav,
                "idTipoLavado": this.tipoLavado,
                "programasLavado": pogramLav
            };
            let res = await fetch(this.url+"lavadora/register",{
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
                this.nombreLav = ''
                this.tipoLavado = ''
                this.progLavado = ''
                this.activeModal = false
                this.openNotification(`Exito: ${data.mensaje}`, `Se ha Registrado Correctamente`, 'success', 'top-center',`<box-icon name='check' color="#fff"></box-icon>`)
                this.mostraActivos()
            }else{
                this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
            }
        },
        async searchWasher(){

            this.lavadoras = []

            if(this.buscarTxt != ''){
                let token = this.$session.get('token')

                let json = {
                    "criterio": this.buscarTxt,
                    "estado": ""
                };
                let res = await fetch(this.url+"lavadora/find",{
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
                    this.lavadoras = data.datos

                }else{
                    this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            }else{
                this.mostrarTodos()
            }

        },
        async updatePage(status){
            if(status == 200){
                this.mostraActivos()
                this.mostraTipoLavado()
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