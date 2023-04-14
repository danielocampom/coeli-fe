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
                                    <vs-input state="dark" dark v-model="buscarTxt" placeholder="Buscar Ordenes">
                                        <template #icon>
                                            <box-icon name='map-pin' dark></box-icon> 
                                        </template>
                                    </vs-input>
                                </b-col>
                                <b-col lg="4" md="4" sm="12"  class="p-1">
                                    <vs-button
                                        transparent 
                                        block
                                        :active="btnBuscar == 1"
                                        @click="buscar()"
                                    >
                                        <box-icon name='search-alt-2' color="#195bff"></box-icon> Buscar
                                    </vs-button>
                                </b-col>
                            </b-row>
                        </b-card>
                        
                    </b-col>
                </b-row>
            </template>
        </b-container>
        <br>
        <template>
            <v-container style="max-width: 900px;" v-if="busqueda.length > 0">
                <v-timeline dense clipped >
                    <v-timeline-item fill-dot class="white--text mb-12" color="orange" large>
                        <template v-slot:icon>
                            <span>HI</span>
                        </template>
                    </v-timeline-item>
                    <br>
                    <v-timeline-item class="mb-4" color="primary" icon-color="grey lighten-2" small  v-for="(bs, i) in busqueda" :key="i">
                        <cardRastroView :dataRastreo="bs"></cardRastroView>
                    </v-timeline-item>
                </v-timeline>
            </v-container>
        </template>

        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>

    </div>
</template>

<script>
import HeaderComponent from '@/components/Header.vue';
import { refreshSession, fetchApi } from "@/service/service.js"
import loginComponent from '@/components/cardLogin.vue';
import cardRastroView from '@/components/cardRastroView.vue';
import moment from 'moment'

export default {
    name:"rastreoOrdenesView",
    data: () => ({
        busqueda: [],
        nombreUsr: '',
        lavadora: '',
        tipoLavado: '',
        programaLavado: '',
        buscarTxt: '',
        btnBuscar: 0,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    components: {
        HeaderComponent,
        loginComponent,
        cardRastroView
    },
    created(){
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })
    },
    methods: {
        
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        
        fecha(fecha){
            moment.locale('es')
            return moment(fecha).format("LLLL");  
        },
        async buscar(){
            this.busqueda = []

            fetchApi(this.url+`orden/historial/${this.buscarTxt}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.busqueda = data.datos
                    this.refresh()
                }else{
                    this.openNotification(`Ooops! Error:`, `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                    this.busqueda = []
                }
            })
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

.card{
    border-radius: 1rem;
}
.vs-input{
    width: 100%;
}

</style>