<template>
    <div>
        <vs-tooltip bottom shadow not-hover v-model="opciones">
            <vs-alert>
                <vs-button size="large" transparent @click="opciones=!opciones">
                    <!-- <template #title> -->
                        BMW
                    <!-- </template> -->
                </vs-button>
                Se encuentra en secado 
                <hr>
                entrega 14 de enero del 2023
            </vs-alert>
            <template #tooltip>
                <div class="content-tooltip">

                    <b-list-group v-if="pathname == '/entregas'">
                        <b-list-group-item>
                            <vs-button success block>
                                Asignar Entrega
                            </vs-button>
                        </b-list-group-item>
                    </b-list-group>
                    <b-list-group v-if="pathname != '/entregas'">
                        <b-list-group-item>
                            <vs-button success block>
                                Siguiente Paso
                            </vs-button>
                        </b-list-group-item>
                    </b-list-group>
                    <b-list-group>
                        <b-list-group-item> 
                            <vs-button success block>
                                Ver Detalles
                            </vs-button>
                        </b-list-group-item>
                    </b-list-group>
                    <footer>
                    <vs-button @click="opciones=false" danger block>
                        Cancel
                    </vs-button>
                    </footer>
                </div>
            </template>
        </vs-tooltip>

        <vs-dialog v-model="active2">
            <template #header>
                <h4 class="not-margin">
                    Estas seguro<b>?</b>
                </h4>
            </template>
            <!-- <ConfirmComponent @confirm="deleteCliente"/> -->
        </vs-dialog>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>

    </div>
</template>

<script>
// import ConfirmComponent from '@/components/confirm.vue'
import loginComponent from './cardLogin.vue';
import { refreshSession } from "@/service/service.js"


export default {
    name:"CardAsignacionPrendaComponent",
    data: () => ({
        opciones: false,
        active2: false,
        pathname: window.location.pathname,

        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,

    }),
    components: {
        // ConfirmComponent,
        loginComponent
    },
    mounted(){    
       this.data()
    },
    methods: {
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
    
        async data(){
            console.log(this.pathname)
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

.card{
    border-radius: 1rem;
}
input {
    width: 100%;
}
.ml-5 .vs-card{
    margin-left: auto!important
}

.vs-card{
    padding: 0.5rem;
}

</style>
<style lang="stylus">
getColor(colorx, alpha = 1)
    unquote("rgba(var(--vs-"+colorx+"), "+alpha+")")
getVar(var)
    unquote("var(--vs-"+var+")")

.content-tooltip
  .body
    display flex
    align-items flex-start
    justify-content center
    .vs-avatar-content
      margin-top -30px
      border 3px solid getVar('theme-layout')
      box-shadow 0px 4px 15px 0px rgba(0,0,0,.1)
    .text
      display flex
      align-items center
      justify-content center
      flex-direction column
      font-size .55rem
      padding 10px
      font-weight normal
      span
        font-weight bold
        font-size .7rem
  footer
    display flex
    align-items center
    justify-content center
  h4
    padding 8px
    margin 0px
    text-align left
  p
    text-align left
    padding 0px
    margin 0px
    line-height 1rem
    padding-bottom 5px
    padding-left 8px
</style>