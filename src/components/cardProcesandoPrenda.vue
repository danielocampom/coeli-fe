<template>
    <div>
        <b-card  v-if="render">
            <b-skeleton animation="throb" width="85%"></b-skeleton>
            <b-skeleton animation="throb" width="55%"></b-skeleton>
            <b-skeleton animation="throb" width="70%"></b-skeleton>
            <b-skeleton type="input"></b-skeleton>
            <b-skeleton type="input" v-if="data.idEstado == 10 && $session.get('roles') == 'SISTEMAS' || $session.get('roles') == 'ADMIN' "></b-skeleton>
            <b-skeleton type="input" v-if="data.idEstado != 10 "></b-skeleton>
            <b-skeleton type="input" v-if="$session.get('roles') == 'SISTEMAS' || $session.get('roles') == 'ADMIN' "></b-skeleton>
        </b-card>        
        <b-card v-else :title="data.nombrePrenda" :sub-title="'Cantidad de Prendas '+ data.cantidad">
            <div class='badge bg-primary text-wrap float-end mb-2' >
                {{ data.nombrePaso }}
            </div>
            <div v-if="data.idEstado == 10" class="badge bg-danger text-wrap float-end mb-3" >
                Se Requiere Autorización
            </div>
            <p class="fw-light" v-if="data.lavadora">Lavadora {{ data.lavadora }}</p>
            <vs-button block flat primary @click="modalShowDetail=!modalShowDetail"> Detalles </vs-button>
            <vs-button v-if="data.idEstado == 10 && $session.get('roles') == 'SISTEMAS' || $session.get('roles') == 'ADMIN' "  block flat primary  @click="autorizar(data.idHist)"> Autorizar </vs-button>
            <vs-button v-if="data.idEstado != 10" block flat danger @click="terminar(data.idHist)"> Terminar </vs-button>
            <vs-button v-if="$session.get('roles') == 'SISTEMAS' || $session.get('roles') == 'ADMIN' " block flat danger @click="cancel()"> Cancelar Prendra </vs-button>
            <vs-dialog blur v-model="cancelPredas">
                <template #header>
                    <h4 class="not-margin">
                        Eliminar <b>{{data.nombrePrenda}}</b>
                    </h4>
                </template>
                <div class="con-form">
                    <template>
                        <p>Cantidad <b>{{ data.cantidad }}</b></p>
                        <div class="center content-inputs">
                            <vs-input danger type="text" v-model="motivoElim" label-placeholder="Describe el motivo">
                                <template #icon>
                                    <box-icon name='rename'></box-icon>
                                </template>
                            </vs-input>
                        </div>
                        <div class="center content-inputs">
                            <vs-input danger type="number" v-model="cantidadElim" label-placeholder="Digita una cantidad">
                                <template #icon>
                                    <box-icon name='dialpad-alt' ></box-icon>
                                </template>
                            </vs-input>
                        </div>
                    </template>
                </div>

                <template #footer>
                    <div class="con-footer mt-4">
                        <vs-button danger
                            block
                            flat
                            @click="comfirm=!comfirm">
                            Eliminar
                        </vs-button>
                    </div>
                </template>
            </vs-dialog>
            <b-modal size="xl" centered v-model="modalShowDetail">
                <template #modal-header="{ close }">
                    <h5>Detalles {{ data.nombrePrenda }}</h5>
                    
                    <vs-button circle icon floating danger @click="close()">
                        <box-icon name='x' color="#fff"></box-icon>
                    </vs-button>
                </template>
                <template >
                    
                    Nombre del programa lavado <b>{{ data.nombreProgramaLavado ? data.nombreProgramaLavado : 'no Aplica' }}</b> <br>
                    Tipo de lavado <b>{{ data.tipoLavado ? data.tipoLavado : 'no Aplica'}}</b> <br>
                    Nombre del sigiente paso: <b>{{ data.nombreSigPaso }}</b> <br>
                    Cantidad minima de la lavadora: <b>{{data.cantidadMinima}}</b> <br>
                    Cantidad maxima de la lavadora: <b>{{data.cantidadMaxima}}</b>
                </template>
    
                <template #modal-footer="{ ok }">
                    <vs-button v-if="$session.get('roles') == 'SISTEMAS' || $session.get('roles') == 'ADMIN' " danger @click="aprt()">
                            Aperturar Lavadora Asignada
                    </vs-button>
                    <vs-button danger @click="ok()">
                            Salir
                    </vs-button>
                </template>
                
            </b-modal>
        </b-card>
        <vs-dialog v-model="comfirmApertura">
            <template #header>
                <h4 class="not-margin">
                    Estas seguro que deseas <b>Aperturar la lavadora asignada?</b>
                </h4>
            </template>
            <ConfirmComponent @confirm="aperturarLavadora"/>
        </vs-dialog>
        <vs-dialog v-model="comfirm">
            <template #header>
                <h4 class="not-margin">
                    Estas seguro que deseas <b>Eliminar las prednas?</b>
                </h4>
            </template>
            <ConfirmComponent @confirm="cancelPrednas"/>
        </vs-dialog>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>

    </div>
</template>

<script>
import ConfirmComponent from '@/components/confirm.vue'
import loginComponent from './cardLogin.vue';
import { refreshSession } from "@/service/service.js"


export default {
    name:"CardProcesandoPrendaComponent",
    props: {
        data: Object,
    },
    data: () => ({
        comfirm: false,
        comfirmApertura: false,
        cancelPredas: false,
        motivoElim: '',
        cantidadElim: '',
        opciones: false,
        detail: [],
        pasos: [],
        idPasos: [],  
        modalShowDetail: false,
        render: true,
        pathname: window.location.pathname,
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    components: {
        ConfirmComponent,
        loginComponent
    },
    mounted(){
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
        aprt(){
            this.modalShowDetail = false
            this.cancelPredas = false
            this.comfirmApertura = true
        },
        cancel(){
            this.modalShowDetail = false
            this.cancelPredas = false
            this.cancelPredas = true
        },
        autorizar(id){
            let token = this.$session.get('token')
            fetch(this.url+`orden/proceso/autoriza/${id}`,{
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
                    this.openNotification(`Exito: ${data.mensaje}`, `Se a Autorizado el proceso Exitosamente`, 'success', 'top-center',`<box-icon name='check' color="#fff"></box-icon>`)
                    this.$emit('updatePage', '200')
                }else{
                    this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },
        async activarLavadora(id, msg = false){
            let token = this.$session.get('token')
            const res = await fetch(this.url+`lavadora/activate/${id}`,{
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': "*",
                    'Authorization': token
                },
            })
            const data = await res.json();
            if(msg){
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.refresh()
                    this.openNotification(`Exito: ${data.mensaje}`, `Se ha Reactivado la Lavadora`, 'success', 'top-center',`<box-icon name='check' color="#fff"></box-icon>`)
    
                }else{
                    this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            }
        },
        terminar(id){

            let token = this.$session.get('token')
            fetch(this.url+`orden/proceso/${id}`,{
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
                    this.activarLavadora(this.data.idLavadora)
                    this.modalShowDetail = false
                    this.openNotification(`Exito: ${data.mensaje}`, `Se a cerrado el proceso Exitosamente`, 'success', 'top-center',`<box-icon name='check' color="#fff"></box-icon>`)
                    this.$emit('updatePage', '200')
                }else{
                    this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })

        },
        async aperturarLavadora(status){
            if(status == 200){
                this.comfirm = false
                this.activarLavadora(this.data.idHist, true)
            }else{
                this.openNotification( `Error: ¡No autorizado!`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
            }
        },
        async cancelPrednas(status){
            if(status == 200){
                let token = this.$session.get('token')

                let prenEliminadas = parseInt(this.data.cantidadPrendas)-parseInt(this.cantidadElim)

                if(prenEliminadas < 0){
                    this.openNotification( `No puedes Eliminar mas prendas de la cantidad asignada `, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)

                }else{
                    let json = {
                        "mensaje": this.motivoElim,
                        "nuevaCantidad": prenEliminadas,
                        "idOrdenPrenda": this.data.idOrdenPrenda
                    };
                    
    
                    let res = await fetch(this.url+"orden/cancela",{
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
                        this.comfirm = false
                        this.cancelPredas = false
                        this.openNotification(`Exito: ${data.mensaje}`, `Se han Eliminado Exitosamente`, 'success', 'top-center',`<box-icon name='check' color="#fff"></box-icon>`)
                        this.$emit('updatePage', '200')
                    }else{
                        this.openNotification( `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                    }
                }
            }
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