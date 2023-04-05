<template>
    <div>
        <b-container class="bv-example-row">
            <b-card  v-if="render">
                <b-skeleton animation="throb" width="85%"></b-skeleton>
                <b-skeleton animation="throb" width="100%"></b-skeleton>
                <b-skeleton animation="throb" width="70%"></b-skeleton>
                <b-skeleton type="button" width="100%" class="mb-2"></b-skeleton>
                <b-skeleton type="button" width="100%"></b-skeleton>
            </b-card>        
            <b-card v-else :title="nomCli">
                <div class="badge bg-success text-wrap float-end" >
                    {{ data.nombreEstado }}
                </div>
                <p class="fw-light text-muted">{{ claveCli }}.</p>
                <!-- <div class="d-flex flex-row bd-highlight mb-3"> -->
                    <!-- <div class="p-2 bd-highlight"> -->
                        <vs-button block primary @click="entregar(data.idOrden)"> Entregar </vs-button>
                    <!-- </div> -->
                    <!-- <div class="p-2 bd-highlight"> -->
                        <vs-button block success @click="modalShowDetail=!modalShowDetail"> Ver Detalles </vs-button>
                    <!-- </div> -->
                <!-- </div> -->
                <b-modal size="xl" centered v-model="modalShowDetail">
                    <template #modal-header="{ close }">
                        <h5>Detalles {{ data.nomCli }} <p class="fw-light">{{ claveCli }}.</p></h5>
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
                            <div class="p-2 flex-grow-1 bd-highligh">
                                <h4 class="mt-2">{{ prenda.prenda }}</h4>
                            </div>
                            <div class="p-2 bd-highlight">
                                <vs-button circle icon floating primary @click="imprimirTicket(prenda.idOrdenPrena)">
                                    <box-icon name='printer' color="#fff"></box-icon>
                                </vs-button>
                            </div>
                        </div>
                        cantidad: <b>{{ prenda.cantidad }} 
                        <div v-if="prenda.nombreEstado" class="badge bg-success text-wrap float-end" >
                            {{ prenda.nombreEstado }}
                        </div></b> <br>
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
            </b-card>
            <div v-if="activarReboot">
                <loginComponent :login="activarReboot"></loginComponent>
            </div>
        </b-container>
    </div>
</template>

<script>
// import ConfirmComponent from '@/components/confirm.vue'
import loginComponent from './cardLogin.vue';
import { refreshSession, fetchApi } from "@/service/service.js"

export default {
    name:"CardEntregasComponent",
    props: {
        data: Object,
    },
    data: () => ({
        opciones: false,
        modalShowDetail: false,
        modalPrint: false,
        prendas: [],
        nomCli: '',
        claveCli: '',
        render: true,
        pathname: window.location.pathname,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    components: {
        // ConfirmComponent,
        loginComponent
    },
    mounted(){
        this.mostraCli()
        this.mostraCliDetail()
        setTimeout(() => {
            this.render = false
        }, 1000)   
    },
    methods: {
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        async mostraCli(){
            fetchApi(this.url+`cliente/findById/${this.data.idCliente}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.nomCli = data.datos.nombre
                    this.claveCli = data.datos.clave
                }else{
                    this.openNotification('Ocurrio un error al obtener los datos', `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },
        async imprimirTicket(idOrdenPrena){
            let objbuilder = ``
            // this.modalPrint = true
            // console.log(idOrdenPrena)
            fetchApi(this.url+`orden/reportes/prenda/${idOrdenPrena}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    data.datos.forEach( b64 => {
                        objbuilder += `<embed type='application/pdf' width='100%' height='600px' style='margin-top: 35px; border: 1px solid #ccc;' src='data:application/pdf;base64,${b64.base64}'>`
                    });
                    let win = window.open("about:blank", "hello", "width=900px,height=600px");
                    let title = "my tab title";
                    win.document.write('<html><title>'+ title +'</title><body style="margin-top: 0px; margin-left: 0px; margin-right: 0px; margin-bottom: 0px;">');
                    win.document.write(objbuilder);
                    win.document.write('</body></html>');
                }else{
                    this.openNotification('Ocurrio un error al obtener los datos', `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },
        async mostraCliDetail(){
            this.prendas = []
            this.data.prendas.forEach( prenda => {
                fetchApi(this.url+`prenda/findById/${prenda.idPrenda}`, 'GET', this.$session.get('token'))
                .then(data => {
                    if(data.status == 401){ this.activarReboot = true }
                    if(data.status == 200){
                        let t = this
                        fetchApi(this.url+`proceso/findById/${data.datos.proceso}`, 'GET', this.$session.get('token'))
                        .then(dt => {
                            if(dt.status == 200){
                                t.prendas.push({"prenda": data.datos.nombre, "detalle": dt.datos, "cantidad": prenda.cantidad, "nombreEstado": prenda.nombreEstado, "idOrdenPrena": prenda.idOrdenPrena})
                            }
                        })
                    }
                })
            })
        },
        entregar(id){
            let token = this.$session.get('token')
            fetch(this.url+`orden/entrega/${id}`,{
                method: "PUT",
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
                    this.modalShowDetail = false
                    this.openNotification(`Exito: ${data.mensaje}`, `La prenda se ha entregado`, 'success', 'top-center',`<box-icon name='check' color="#fff"></box-icon>`)
                    this.$emit('updatePage', '200')
                }else{
                    this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
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