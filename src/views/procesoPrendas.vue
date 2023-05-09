<template>
    <div>
        <HeaderComponent/>
        <br>
    
        <b-container fluid class="mt-5">
            <template>
                <b-tabs content-class="mt-3" align="center">
                    <b-tab title="Por Procesar" active>
                        <!-- <b-container class="bv-example-row"> -->
                            <b-row>
                                <b-col class="mt-4" lg="3" md="4" sm="6" v-for="(cons, i) in consultas" :key="i">
                                    <CardProcesoPrendaComponent  v-if="!cons.idEstado" @updatePage="updatePage" :data="{prenda:cons.nombrePrenda, idPrenda: cons.idPrenda, descripcionEstado:cons.descripcionEstado, cantidadPrendas:cons.cantidadPrendas, idPaso: cons.idPaso, idOrdenPrenda: cons.idOrdenPrenda, idTipoLavado: cons.idTipoLavado, nombrePaso: cons.nombrePaso}"></CardProcesoPrendaComponent>
                                </b-col>
                            </b-row>            
                            <vs-alert v-if="sinData" shadow danger>
                                <template #title>
                                    No se han encontrado datos
                                </template>
                            </vs-alert>
                        <!-- </b-container> -->
                    </b-tab>
                    <b-tab title="Procesando">
                        <!-- <b-container class="bv-example-row"> -->
                            <b-row>
                                <b-col class="mt-4" lg="3" md="4" sm="6" v-for="(cp, i) in consultasProcesando" :key="i">
                                    <CardProcesandoPrendaComponent v-if="cp.idEstado" @updatePage="updatePage" :data="{idOrdenPrenda: cp.idOrdenPrenda, idPrenda: cp.idPrenda, idHist:cp.idHist, nombrePaso: cp.nombrePaso, nombrePrenda: cp.nombrePrenda, nombreProgramaLavado: cp.nombreProgramaLavado, nombreSigPaso: cp.nombreSigPaso, tipoLavado: cp.tipoLavado, cantidad: cp.cantidadPrendas, idSigPaso: cp.idSigPaso, nombrePaso: cp.nombrePaso, idEstado: cp.idEstado, idHist: cp.idHist, idLavadora: cp.idLavadora, cantidadMaxima: cp.cantidadMaxima, cantidadMinima: cp.cantidadMinima }"></CardProcesandoPrendaComponent>
                                </b-col>
                            </b-row>            
                            <vs-alert v-if="sinDataProcesando" shadow danger>
                                <template #title>
                                    No se han encontrado datos
                                </template>
                            </vs-alert>
                        <!-- </b-container> -->
                    </b-tab>
                </b-tabs>
            </template>
        </b-container>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>
        
    </div>
</template>

<script>
import HeaderComponent from '@/components/Header.vue';
import CardProcesoPrendaComponent from '@/components/cardProcesoPrenda.vue';
import CardProcesandoPrendaComponent from '@/components/cardProcesandoPrenda.vue';
import { refreshSession, fetchApi } from "@/service/service.js"
import loginComponent from '@/components/cardLogin.vue';

export default {
    data: () => ({
        consultas: [],
        sinData: false,
        sinDataProcesando: false,
        consultasProcesando: [],
        url: process.env.VUE_APP_SERVICE_URL_API, activarReboot: false,
    }),
    components: {
        CardProcesoPrendaComponent,
        CardProcesandoPrendaComponent,
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
        this.mostratConsultas()
        // console.log(this.consultasProcesando)
        setTimeout(() => {
            this.sinData = this.consultas.length == 0 ? false : true
            this.sinDataProcesando = this.consultasProcesando.length == 0 ? false : true
        }, 100);
    },
    methods: {
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        async mostratConsultas(){
            this.consultas = []
            this.consultasProcesando = []
            fetchApi(this.url+'orden/consulta', 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    
                    data.datos.forEach( value => {
                        // console.log(value)
                        if(value.idEstado == null){
                            this.consultas.push(value)
                        }else{
                            this.consultasProcesando.push(value)
                        }
                    })
                }else{
                    // this.openNotification(`Error: ${data.mensaje}`, `${data.diagnostico}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },
        updatePage(status){
            if(status == 200){
                this.mostratConsultas()
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
#modal-xl{
    margin-top: 5rem;
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

.vs-input{
    width: 100%;
}

#vs-input--1785{
    width: 100%;
}

</style>