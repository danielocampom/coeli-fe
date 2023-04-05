<template>
     <b-card v-if="render">
        <b-skeleton animation width="85%"></b-skeleton>
        <b-skeleton animation width="55%"></b-skeleton>
        <b-skeleton animation width="100%"></b-skeleton>
        <b-skeleton type="input" block class="mt-2"></b-skeleton>
        <b-skeleton type="input" block class="mt-1"></b-skeleton>
    </b-card>
    
    <b-card v-else
        :title="nomCliente"
        tag="article"
        style="max-width: 20rem;"
        class="mb-2"
    >
        <b-card-text>
            <p>
                Fecha de entrega
                <strong>{{ fecha(data.fechaEntrega) }}</strong>    
            </p>
        
        </b-card-text>
        
        <vs-button primary block @click="enviarDatos(data.idOrden)">
            Enviar
        </vs-button>
        <vs-button success block @click="modalShowDetail = !modalShowDetail">
            Ver Detalles
        </vs-button>
        <b-modal size="xl" centered v-model="modalShowDetail">
            <template #modal-header="{ close }">
                <h5>Detalles <b>{{ nomCliente }}</b></h5>
                <vs-button circle icon floating danger @click="close()">
                    <box-icon name='x' color="#fff"></box-icon>
                </vs-button>
            </template>
            <template >
                <b-card v-if="prendas.length == 0">
                    <div class="d-flex flex-row bd-highlight mb-3">
                        <div class="p-2 bd-highlight">
                            <b-skeleton animation="wave" width="85%"></b-skeleton>
                        </div>
                    </div>

                    <b-skeleton type="input"></b-skeleton>
                    <br>
                    <b-skeleton type="input"></b-skeleton>
                    <br>

                    <b-row cols-sm="12" cols-md="6" cols-lg="4" class="mt-4">
                        <b-col>
                            <b-card>
                                <b-skeleton animation width="85%"></b-skeleton>
                                <b-skeleton animation width="55%"></b-skeleton>
                                <b-skeleton animation width="70%"></b-skeleton>
                            </b-card>
                        </b-col>
                        <b-col>
                            <b-card>
                                <b-skeleton animation width="85%"></b-skeleton>
                                <b-skeleton animation width="55%"></b-skeleton>
                                <b-skeleton animation width="70%"></b-skeleton>
                            </b-card>
                        </b-col>
                        <b-col>
                            <b-card>
                                <b-skeleton animation width="85%"></b-skeleton>
                                <b-skeleton animation width="55%"></b-skeleton>
                                <b-skeleton animation width="70%"></b-skeleton>
                            </b-card>
                        </b-col>
                        
                        <b-col>
                            <b-card>
                                <b-skeleton animation width="85%"></b-skeleton>
                                <b-skeleton animation width="55%"></b-skeleton>
                                <b-skeleton animation width="70%"></b-skeleton>
                            </b-card>
                        </b-col>
                    </b-row>

                </b-card>
                <div v-else v-for="(prenda, i) in prendas" :key="i">
                    <hr v-if="i>0">
                    <div class="d-flex flex-row bd-highlight mb-3">
                        <div class="p-2 bd-highlight">
                            <h4 class="mt-2">{{ prenda.prenda.nombre }}</h4>
                        </div>
                    </div>
                    cantidad: <b>{{ prenda.cantidad }}</b> <br>
                    tipo de lavado:<b> {{prenda.detalle.nombre}} ({{ prenda.detalle.codigo }})</b> 
                    
                    <br>
                    <b-row cols="1" cols-sm="12" cols-md="6" cols-lg="4" class="mt-4">
                        <b-col v-for="(paso, i) in prenda.detalle.pasos" :key="i">
                            <b-card :title="paso.nombre">
                                {{ paso.descripcion }}
                            </b-card>
                        </b-col>
                    </b-row>
                </div>
            </template>

            <template #modal-footer="{ ok }">
                <vs-button danger @click="ok()">
                        Salir
                </vs-button>
            </template>
            
        </b-modal>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>
    </b-card>
</template>
  

<script>
import moment from 'moment'
import { fetchApi, refreshSession } from "@/service/service.js"
import loginComponent from './cardLogin.vue';

export default {
    name:"cardLlegada",
    props: {
        data: Object,
    },
    data: () => ({
        modalShowDetail: false,
        nomCliente: '',
        render: true,
        prendas: [],
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    
    components: {
        loginComponent
    },
    mounted(){   
        this.dataCliente()
        setTimeout(() => {
            this.render = false
            this.data.prendas.forEach( value => {
                this.mostrarDataPrenda(value.idPrenda, value.cantidad, value.idOrdenPrena)
            })
        }, 1500)
    },
    methods: {
        fecha(fecha){
            moment.locale('es')
            return moment(fecha).format("LLLL")
        },
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        async dataCliente(){
            fetchApi(this.url+`cliente/findById/${this.data.idCiente}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.nomCliente = data.datos.nombre
                }else{
                    this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },
        async enviarDatos(idOrden){

            let ordenPrendas = []

            this.prendas.forEach( pr => {
                ordenPrendas.push({"idOrdenPrenda": pr.idOrdenPrena, "cantidad": pr.cantidad})
            })
            
            
            let json = {
                "idOrdenLavado": idOrden,
                "ordenPrendas": ordenPrendas,
            };
            
            // console.log(json)
            
            let token = this.$session.get('token')
            const res = await fetch(this.url+`orden/confirmaOrden`,{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*",
                    'Authorization': token
                },
                body: JSON.stringify(json)
            })
            const data = await res.json();
            if(data.status == 401){ this.activarReboot = true }
            if(data.status == 200){
                this.refresh()
                this.openNotification(`Exito: Orden procesada`, `Se ha Enviado Correctamente`, 'success', 'top-center',`<box-icon name='check' color="#fff"></box-icon>`)
                ordenPrendas = []
                this.$emit('updatePage', '200')
            }else{
                this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
            }
        },
        mostrarDataPrenda(id, cantidad, idOrdenPrena){
            this.prendas = []
            fetchApi(this.url+`prenda/findById/${id}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    let t = this
                    fetchApi(this.url+`proceso/findById/${data.datos.proceso}`, 'GET', this.$session.get('token'))
                    .then(dt => {
                        if(dt.status == 200){
                            t.prendas.push({"prenda": data.datos, "detalle": dt.datos, "cantidad": cantidad, "id": id, "idOrdenPrena": idOrdenPrena})
                        }
                    })
                }
            })
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
    },
}
</script>
<style>
.card{
    border-radius: 1rem;
}
.modal-xl{
    margin-top: 2rem;
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