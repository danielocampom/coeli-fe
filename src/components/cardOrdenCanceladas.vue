<template>
    <div class="container">
        <vs-alert danger v-if="dataClient.cantidadAnterior != dataClient.cantidadActual">
            <b-skeleton v-if="!dataClient.nombreCliente" type="button"></b-skeleton>
            <div>
                <p class="fw-bold fs-4">{{ dataClient.nombrePrenda }} </p> 
                <p class="fw-semibold">{{ dataClient.nombreCliente }}</p>
            </div>
            <b-skeleton v-if="render" animation="throb" width="100%"></b-skeleton>
            <b-skeleton v-if="render" animation="throb" width="100%"></b-skeleton>
            <b-skeleton v-if="render" animation="throb" width="40%"></b-skeleton>
            
            <div v-else>
                {{dataClient.descripcion}} 
                <p>Cantidad Anterior <b>{{dataClient.cantidadAnterior}}</b></p>
                <p>Cantidad Actual <b>{{dataClient.cantidadActual}}</b></p> 
            </div>
            <hr>
        </vs-alert>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>
    </div>
</template>
  
<script>
import { refreshSession } from "@/service/service.js"
import loginComponent from './cardLogin.vue';

export default {
    name:"CardOrdenCanceladasComponent",
    props: {
        dataClient: Object,
    },
    components: {
        loginComponent
    },
    data: () => ({

        render: true,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,

    }),
    mounted(){
        setTimeout(() => {
            this.render = false
        }, 1500)

    },
    methods:{
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        actualizar(){
            console.log("updating....")
            this.$emit('updatePage', '200')
        },
        async updatePage(status){
            if(status == 200){
                this.mostrarDataClient(this.dataClient.id)
                this.dataClient.prendas.forEach( value => {
                    this.mostrarDataPrenda(value.idPrenda, value.cantidad)
                })
            }
        },
    }
}
</script>
<style>
.card{
    border-radius: 1rem;
}
.modal-xl{
    margin-top: 5rem;
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