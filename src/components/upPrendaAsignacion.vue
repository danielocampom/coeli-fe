<template>
    <div>
        <vs-button circle floating icon @click="editar = !editar">
                <box-icon name='edit-alt' color="#FFF"></box-icon>
        </vs-button>
        <vs-dialog v-model="editar">
            <template #header>
                <h4 class="not-margin">
                    Actualizar <b>{{ dataUp.nombre }}</b>
                </h4>
            </template>
    
    
            <div class="con-form">
                <vs-input
                    label-placeholder="Cantidad"
                    v-model="cantidadUp"
                />
                <div class="center con-selects">
                    <b-skeleton type="input" v-if="getPrendas.length == 0"></b-skeleton>
                    <vs-select v-else
                        placeholder="Selecciona una Prenda"
                        v-model="prendaUp"
                    >
                        <vs-option v-for="(prenda, i) in getPrendas" :key="i" :label="prenda.nombre" :value="prenda.id">
                            {{ prenda.nombre }}
                        </vs-option>
                    </vs-select>
                    
                </div>
            </div>
    
            <template #footer>
                <div class="footer-dialog">
                    <vs-button block @click="update()">
                        <box-icon name='send' color="#fff"></box-icon> Actualizar
                    </vs-button>
                </div>
            </template>
        </vs-dialog>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>

    </div>
</template>
  
<script>
import { fetchApi, refreshSession } from "@/service/service.js"
import loginComponent from './cardLogin.vue';

export default {
    name:"upPrendaAsignacion",
    props: {
        dataUp: Object,
    },
    components: {
        loginComponent
    },
    data: () => ({
        editar: false,

        prendaUp: '',
        cantidadUp: '',
        getPrendas: [],

        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,

    }),
    mounted(){
        this.mostraPrendasActivas()
        this.prendaUp = this.dataUp.idPrenda
        this.cantidadUp = this.dataUp.cantidad
    },
    methods: {
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
      
        async mostraPrendasActivas(){
            fetchApi(this.url+'prenda/findByEstado/1', 'GET', this.$session.get('token'))
            .then(data => {
                this.getPrendas = []
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.getPrendas = data.datos
                }else{
                    this.openNotification('Ocurrio un error al obtener los datos', `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },
        async update(){
            let token = this.$session.get('token')

            let json = {
                "idPrenda": this.prendaUp,
                "idOrdenPrenda": this.dataUp.idOrden,
                "cantidad": this.cantidadUp,
            };
            let res = await fetch(this.url+"orden/update/prenda",{
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
                this.editar = false
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