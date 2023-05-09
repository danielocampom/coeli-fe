<template>
    <div>
        <HeaderComponent/>
        <br>
        
        <b-row class="mt-5 p-4">
            <b-col>
                <b-card :title="cliente" :style="{ 'border-left': `solid 5px ${fechaEntregaColor} !important` }">
                    <b-row>
                        <b-col lg="3" md="6" sm="12">
                            <apexchart-all v-if="seriesRadial.length > 0" type="radialBar" height="350" :options="chartOptionsRadial" :series="seriesRadial"></apexchart-all>
                            <b-card no-body class="overflow-hidden" v-else>
                                <v-skeleton-loader
                                    height="300"
                                    type="image, image, image"
                                >
                                </v-skeleton-loader>
                            </b-card>
                        </b-col>
                        <b-col lg="9" md="6" sm="12">
                            <apexchart-all v-if="seriesLine.length > 0" type="line" height="350" :options="chartOptionsLine" :series="seriesLine"></apexchart-all>
                            <b-card no-body class="overflow-hidden" v-else>
                                <v-skeleton-loader
                                    height="300"
                                    type="image, image, image"
                                >
                                </v-skeleton-loader>
                            </b-card>
                        </b-col>
                    </b-row>
                </b-card>
            </b-col>
        </b-row>
        <div class="slider mt-5" v-if="sinData">
            <div class="cardsContent" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
                <lavadoraDashboard style="min-width: 20rem; margin: 1rem;" v-for="(lavadora, i) in lavadoras" :key="i" :data="{nombre: lavadora.lavadora, tipoLavado: lavadora.tipoLavado, idEstado: lavadora.idEstado}"></lavadoraDashboard>
            </div>
            <div class="controls">
                <button @click="previousSlide" :disabled="currentSlide === 0"><box-icon name='skip-previous'></box-icon></button>
                <button @click="nextSlide" :disabled="currentSlide === lavadoras.length - 1"><box-icon name='skip-next'></box-icon></button>
            </div>
        </div>
        
        <v-row class="mt-1 p-4" v-if="reload">
            <v-col sm="12" md="4" lg="3" class="mt-4">
                
                <b-card no-body class="overflow-hidden">
                    <v-skeleton-loader
                        height="300"
                        type="image, image, image"
                    >
                    </v-skeleton-loader>
                </b-card>
                
                <b-card  no-body class="overflow-hidden mt-3">
                    <v-skeleton-loader
                        height="150"
                        type="image, image, image"
                    >
                    </v-skeleton-loader>
                </b-card>
            </v-col>
            <v-col sm="12" md="4" lg="9" class="mt-4">
                <b-card  no-body class="overflow-hidden">
                    <v-skeleton-loader
                        height="470"
                        type="image, image, image"
                    >
                    </v-skeleton-loader>
                </b-card>
            </v-col>
        </v-row>
        <b-row class="mt-1 p-4" v-else>
            <b-col class="mt-4" lg="3" md="6" sm="12">
                <b-card title="Ordenes entregadas">
                    <apexchart-all type="donut" height="350" :options="chartOptionsSemiDonut" :series="entradasSalidas"></apexchart-all>
                </b-card>
                <b-card class="mt-3" title="Ordenes del mes pasado y actual">
                    <apexchart-all type="bar" height="150" :options="chartOptionsMPA" :series="seriesMPA"></apexchart-all>
                </b-card>
            </b-col>
            <b-col class="mt-4" lg="9" md="6" sm="12">
                <b-card title="Frecuencia de los clientes">
                    <apexchart-all type="line" height="450" :options="chartOptionsBarCode" :series="seriesBarCode"></apexchart-all>
                </b-card>
            </b-col>
        </b-row>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>

    </div>
</template>

<script>
import HeaderComponent from '@/components/Header.vue';
import lavadoraDashboard from '@/components/cardLavadoraDashboard.vue';
import loginComponent from '@/components/cardLogin.vue';
import { refreshSession, fetchApi } from "@/service/service.js"

export default {
    name:"DashboardView",
    
    components: {
        HeaderComponent,
        lavadoraDashboard, 
        loginComponent,
    },
    
    data: () => ({
        url: process.env.VUE_APP_SERVICE_URL_API,
        reload:true,
        activarReboot: false,

        fechaEntregaColor: '',
        cliente: '',

        ordenesAct: [],
        lavadoras: [],
        sinData: true,

        currentSlide: 0,
        entradasSalidas: [],
        chartOptionsSemiDonut: {
            chart: {
                type: 'donut',
            },
            labels: ["Entregadas", "Llegada"],
            colors:['#16F702', '#F70202'],
            plotOptions: {
                pie: {
                startAngle: -90,
                endAngle: 90,
                offsetY: 10
                }
            },
            grid: {
                padding: {
                bottom: -80
                }
            },
            responsive: [{
                breakpoint: 480,
                options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
                }
            }]
        },

        seriesMPA: [],
        chartOptionsMPA: {
            chart: {
                type: 'bar',
                height: 100
            },
            colors:['#0d6efd'],
            plotOptions: {
                bar: {
                    orderRadius: 4,
                    horizontal: true,
                }
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories: ['Mes Pasado', 'Mes Actual' ],
            }
        },

        barCodeActual: [],
        barCodeAnterior: [],
        barCodeNameCli: [],
        seriesBarCode: [],
        chartOptionsBarCode: {
            chart: {
              height: 350,
              type: 'line',
            },
            stroke: {
              width: [0, 4]
            },
            title: {
              text: 'Visitas'
            },
            dataLabels: {
              enabled: true,
              enabledOnSeries: [1]
            },
            labels: [],

            xaxis: {
              type: 'text'
            },
            yaxis: [{
              title: {
                text: 'Mes Actual',
              },
            
            }, {
              opposite: true,
              title: {
                text: 'Mes Anterior'
              }
            }]
        },

        seriesRadial: [],
        chartOptionsRadial: {
            chart: {
              height: 350,
              type: 'radialBar',
              toolbar: {
                show: true
              }
            },
            plotOptions: {
              radialBar: {
                startAngle: -135,
                endAngle: 225,
                 hollow: {
                  margin: 0,
                  size: '70%',
                  background: '#fff',
                  image: undefined,
                  imageOffsetX: 0,
                  imageOffsetY: 0,
                  position: 'front',
                  dropShadow: {
                    enabled: true,
                    top: 3,
                    left: 0,
                    blur: 4,
                    opacity: 0.24
                  }
                },
                track: {
                  background: '#fff',
                  strokeWidth: '67%',
                  margin: 0, // margin is in pixels
                  dropShadow: {
                    enabled: true,
                    top: -3,
                    left: 0,
                    blur: 4,
                    opacity: 0.35
                  }
                },
            
                dataLabels: {
                  show: true,
                  name: {
                    offsetY: -10,
                    show: true,
                    color: '#888',
                    fontSize: '17px'
                  },
                  value: {
                    formatter: function(val) {
                      return parseInt(val);
                    },
                    color: '#111',
                    fontSize: '36px',
                    show: true,
                  }
                }
              }
            },
            fill: {
              type: 'gradient',
              gradient: {
                shade: 'dark',
                type: 'horizontal',
                shadeIntensity: 0.5,
                gradientToColors: ['#007bff'],
                inverseColors: true,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100]
              }
            },
            stroke: {
              lineCap: 'round'
            },
            labels: ['Avance'],
        },


        seriesLine: [],
        chartOptionsLine: {
            chart: {
              height: 350,
              type: 'line',
              zoom: {
                enabled: false
              }
            },
            dataLabels: {
              enabled: false
            },
            colors: ['#007bff'],
            stroke: {
              curve: 'straight'
            },
            title: {
              text: 'Proceso de Prendas',
              align: 'rigth'
            },
            grid: {
              row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
              },
            },
            xaxis: {
              categories: ['Restante', 'Terminados'],
            }
        },

        
    }),
    created(){
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })
    },
    mounted(){
        this.dataDash()
        this.Lavadoras()
        this.getOrdenes()
        this.chartOptionsBarCode.labels = this.barCodeNameCli
        setTimeout(() => {
            this.getDetalles(this.ordenesAct[Math.floor(Math.random() * this.ordenesAct.length)])
            this.reload = false
        }, 4000);

        
        setInterval(() => {
            this.getDetalles(this.ordenesAct[Math.floor(Math.random() * this.ordenesAct.length)])
        }, 600000);
            
        
    },
    methods:{
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
            }) 
        },
        previousSlide() {
            this.currentSlide--
        },
        nextSlide() {
            this.currentSlide++
        },
        dataDash(){
            this.entradasSalidas = []
            this.seriesMPA = []
            fetchApi(this.url+`orden/dashboard`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    // this.entradasSalidas = 
                    this.entradasSalidas = [data.datos.entregas, data.datos.entradasMes]
                    this.seriesMPA.push({ data: [data.datos.entradasMesAnterior, data.datos.entradasMes]})
                    data.datos.clientes.forEach( cli => {
                        this.barCodeActual.push(cli.visitasMes)
                        this.barCodeAnterior.push(cli.visitasMesAnterior)
                        this.barCodeNameCli.push(cli.cliente)
                    });

                    this.seriesBarCode = [{
                        name: 'Visitas del mes actual',
                        type: 'column',
                        data: this.barCodeActual
                    }, {
                        name: 'Visitas del mes anterior',
                        type: 'line',
                        data: this.barCodeAnterior
                    }]
                }else{
                    this.openNotification('Ocurrio un error al obtener los datos', `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }

            })
            .catch(err => console.log(err))
        },
        async Lavadoras(){
            fetchApi(this.url+'lavadora/findAll', 'GET', this.$session.get('token'))
            .then(data => {
                this.lavadoras = []
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.lavadoras = data.datos
                    if(this.lavadoras.length == 0){
                        this.sinData == false
                    }
                }else{
                    this.openNotification('Ocurrio un error al obtener los datos', `${data.mensaje}`, 'danger', 'top-center',`<box-icon name='bug' color="#fff"></box-icon>`)
                }
            })
        },
        async getOrdenes(){
            fetchApi(this.url+`orden/findByEstado/9`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    data.datos.forEach(dt => {
                        this.ordenesAct.push(dt.idOrden)
                    });
                }
            })
        },
        async getDetalles(idOrdenLavado){
            this.seriesRadial = []
            this.seriesLine = []
            fetchApi(this.url+`orden/dashboard/${idOrdenLavado}`, 'GET', this.$session.get('token'))
            .then(data => {
                if(data.status == 401){ this.activarReboot = true }
                if(data.status == 200){
                    this.seriesRadial = [data.datos.avance]
                    this.seriesLine.push({name: "Procesos", data: [data.datos.cantidadRestante, data.datos.cantidadTerminados]})
                    this.cliente = data.datos.cliente
                    let fechaEstablecida = new Date(data.datos.fechaEntrega.split('T')[0])
                    let fechaActual = new Date()
                    if (fechaActual > fechaEstablecida) {
                        this.fechaEntregaColor = "#d9534f"
                    }else{
                        this.fechaEntregaColor = "#0d6efd"
                    }
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
}
</style>

<style scoped>
.slider {
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  position: relative;
}

.cardsContent {
  display: flex;
  width: 100%;
  height: 20rem;
  transition: transform 0.3s ease-in-out;
}

.controls {
  position: absolute;
  bottom: -2rem;
  left: 0;
  width: 100%
}
</style>
