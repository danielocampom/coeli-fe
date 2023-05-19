<template>
    <div>
        <b-card :title="data.nombre" :sub-title="tipoLavado" v-if="reload">
            <apexchart-all type="donut" :options="chartOptionsG" :series="series" v-if="data.idEstado == 1"></apexchart-all>
            <apexchart-all type="donut" :options="chartOptionsR" :series="series" v-if="data.idEstado == 7"></apexchart-all>
            <apexchart-all type="donut" :options="chartOptionsY" :series="series" v-if="data.idEstado == 6"></apexchart-all>
        </b-card>
        <b-card no-body class="overflow-hidden" v-else>
            <v-skeleton-loader
                height="300"
                type="image, image, image"
            >
            </v-skeleton-loader>
        </b-card>
    </div>
</template>
  
<script>
import { fetchApi } from "@/service/service.js"

export default {
    name:"lavadoraDashboard",
    props: {
        data: Object,
    },
    data: () => ({
        url: process.env.VUE_APP_SERVICE_URL_API,
        reload: false,
        tipoLavado: '',
        color: [],
        series: [100],
        chartOptionsR: {
            chart: {
                type: 'donut',
            },
            colors:['#fb5f4f'],
            labels: [""],
            dataLabels: {
                enabled: false,
            },
            responsive: [{
                breakpoint: 240,
                options: {
                    chart: {
                        width: 100,
                    },
                    legend: {
                        position: 'center',
                        offsetY: 0,
                        height: 50,
                    }
                }
            }]
        },
        
        chartOptionsG: {
            chart: {
                type: 'donut',
            },
            colors:['#4eeba2'],
            labels: [""],
            dataLabels: {
              enabled: false
            },
            responsive: [{
                breakpoint: 240,
                options: {
                    chart: {
                        width: 0,
                    },
                    legend: {
                        position: 'center',
                            offsetY: 0,
                            height: 50,
                    }
                }
            }]
        },

        chartOptionsY: {
            chart: {
                type: 'donut',
            },
            colors:['#fddb58'],
            labels: [""],
            dataLabels: {
              enabled: false
            },
            responsive: [{
                breakpoint: 240,
                options: {
                    chart: {
                        width: 100,
                    },
                    legend: {
                        position: 'center',
                            offsetY: 0,
                            height: 50,
                    }
                }
            }]
        },
    }),
    mounted(){
        this.Lavadoras()
        setTimeout(() => {
            this.reload = true
        }, 1500);
        
    },
    methods: {
        async Lavadoras(){
            fetchApi(this.url+`tipoLavado/findById/${this.data.tipoLavado}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.tipoLavado = data.datos.nombre
                }
            })
        },
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
    /* height: 20rem; */
}

</style>