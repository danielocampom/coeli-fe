<template>
    <div>
        <HeaderComponent/>
        <br>
        <b-container class="bv-example-row mt-5">
            <b-row v-if="reload">
                <b-col class="mt-4" lg="3" md="6" sm="12" >
                        <b-card>
                        <b-skeleton animation="fade" width="100%"></b-skeleton>
                    </b-card>
                </b-col>
                <b-col class="mt-4" lg="3" md="6" sm="12" >
                        <b-card>
                        <b-skeleton animation="fade" width="100%"></b-skeleton>
                    </b-card>
                </b-col>
                <b-col class="mt-4" lg="3" md="6" sm="12" >
                        <b-card>
                        <b-skeleton animation="fade" width="100%"></b-skeleton>
                    </b-card>
                </b-col>
                <b-col class="mt-4" lg="3" md="6" sm="12" >
                        <b-card>
                        <b-skeleton animation="fade" width="100%"></b-skeleton>
                    </b-card>
                </b-col>
            </b-row>
            <b-row v-else>
                <b-col class="mt-4" lg="3" md="6" sm="12" >
                    <vs-card type="3">
                        <template #img>
                            <box-icon name='cloud' size='lg' animation='fade-down' ></box-icon>
                            50%
                        </template>
                        <template #text>
                            <p>
                                Lorem ipsum dolor sit 
                            </p>
                        </template>
                    </vs-card>
                </b-col>
                <b-col class="mt-4" lg="3" md="6" sm="12" >
                    <vs-card type="3">
                        <template #img>
                            <box-icon name='cloud-drizzle' size='lg' animation='fade-up' ></box-icon>
                            50%
                        </template>
                        <template #text>
                            <p>
                                Lorem ipsum dolor sit 
                            </p>
                        </template>
                    </vs-card>
                </b-col>
                <b-col class="mt-4" lg="3" md="6" sm="12" >
                    <vs-card type="3">
                        <template #img>
                            <box-icon name='cloud-lightning' size='lg' animation='flashing' ></box-icon>
                            50%
                        </template>
                        <template #text>
                            <p>
                                Lorem ipsum dolor sit 
                            </p>
                        </template>
                    </vs-card>
                </b-col>
                <b-col class="mt-4" lg="3" md="6" sm="12" >
                    <vs-card type="3">
                        <template #img>
                            <box-icon name='log-in-circle' size='lg' animation='fade-right' ></box-icon>
                            50%
                        </template>
                        <template #text>
                            <p>
                                Lorem ipsum dolor sit 
                            </p>
                        </template>
                    </vs-card>
                </b-col>

            </b-row>

            <b-row v-if="reload">
                <b-col class="mt-4" lg="4" md="12" sm="12" >
                    
                    <b-card no-body class="overflow-hidden">
                        <b-skeleton-img aspect="3:2"></b-skeleton-img>
                    </b-card>
                </b-col>
                <b-col class="mt-4" lg="4" md="12" sm="12" >
                    
                    <b-card no-body class="overflow-hidden">
                        <b-skeleton-img aspect="3:2"></b-skeleton-img>
                    </b-card>
                </b-col>
                <b-col class="mt-4" lg="4" md="12" sm="12" >
                    
                    <b-card no-body class="overflow-hidden">
                        <b-skeleton-img aspect="3:2"></b-skeleton-img>
                    </b-card>
                </b-col>
            </b-row>
            <b-row v-else>
                <b-col class="mt-4" lg="4" md="12" sm="12">
                    <vs-card type="3" class="cardKM">
                        <template #img>
                            <donutPie v-model="dp" :title="'your title'" :remark="'your remark'"/>
                        </template>
                    </vs-card>
                </b-col>
                <b-col class="mt-4" lg="4" md="12" sm="12">
                    <vs-card type="3" class="cardKM">
                        <template #img>
                            <donutPie v-model="dp" :title="'your title'" :remark="'your remark'"/>
                        </template>
                    </vs-card>
                </b-col>
                <b-col class="mt-4" lg="4" md="12" sm="12">
                    <vs-card type="3" class="cardKM">
                        <template #img>
                            <donutPie v-model="dp" :title="'your title'" :remark="'your remark'"/>
                        </template>
                    </vs-card>
                </b-col>
            </b-row>

            <b-row v-if="reload">
                <b-col class="mt-4" lg="8" md="12" sm="12" >
                    <b-card>
                        <b-row no-gutters>
                            <b-col md="5">
                                <b-skeleton-img aspect="3:2"></b-skeleton-img>
                            </b-col>
                            <b-col md="7">
                                <b-skeleton type="input"></b-skeleton>
                                <b-card class="mt-5 m-3">
                                    <b-skeleton animation="fade" width="85%"></b-skeleton>
                                    <b-skeleton animation="fade" width="55%"></b-skeleton>
                                    <b-skeleton animation="fade" width="70%"></b-skeleton>
                                </b-card>
                            </b-col>
                        </b-row>
                    </b-card>
                </b-col>
                <b-col class="mt-4" lg="4" md="12" sm="12" >
                    <b-card no-body class="overflow-hidden">
                        <b-skeleton-img aspect="3:2"></b-skeleton-img>
                    </b-card>
                </b-col>
            </b-row>
            <b-row v-else>
                <b-col class="mt-4" lg="8" md="12" sm="12" >
                    <b-card no-body class="overflow-hidden">
                        <b-row no-gutters>
                            <b-col md="5">
                                <D3PieChart :config="chart_configD" :datum="chart_dataD"></D3PieChart>
                            </b-col>
                            <b-col md="7">
                                <h1 class="text-primary fw-bolder text-center mb-5 mt-3">900,000,000</h1>
                                <b-card class="mt-5 m-3">
                                    <b-progress rogress :value="value" :max="max" class="mb-3"></b-progress>
                                    <b-progress rogress :value="value-20" :max="max" class="mb-3"></b-progress>
                                    <b-progress rogress :value="value+12" :max="max" class="mb-3"></b-progress>
                                </b-card>
                            </b-col>
                        </b-row>
                    </b-card>
                </b-col>
                <b-col class="mt-4" lg="4" md="12" sm="12" >
                    <b-card no-body class="overflow-hidden">
                        <!-- <D3PieChart :config="chart_configD" :datum="chart_dataD"></D3PieChart> -->
                        <D3LineChart class="m-3" :config="chart_configL" :datum="chart_dataL"></D3LineChart>

                    </b-card>
                </b-col>
            </b-row>

            <b-row v-if="reload">
                <b-col class="mt-4" lg="4" md="4" sm="6">
                    <b-card>
                        <b-skeleton type="input"></b-skeleton>
                        <b-skeleton-img class="mt-3" aspect="3:1"></b-skeleton-img>
                        <br>
                        <b-skeleton animation="fade" width="85%"></b-skeleton>
                        <b-skeleton animation="fade" width="55%"></b-skeleton>
                        <b-skeleton animation="fade" width="70%"></b-skeleton>
                        <b-skeleton class="mt-3" type="input"></b-skeleton>
                    </b-card>
                </b-col>
                <b-col class="mt-4" lg="4" md="4" sm="6">
                    <b-card>
                        <b-skeleton type="input"></b-skeleton>
                        <b-skeleton-img class="mt-3" aspect="3:1"></b-skeleton-img>
                        <br>
                        <b-skeleton animation="fade" width="85%"></b-skeleton>
                        <b-skeleton animation="fade" width="55%"></b-skeleton>
                        <b-skeleton animation="fade" width="70%"></b-skeleton>
                        <b-skeleton class="mt-3" type="input"></b-skeleton>
                    </b-card>
                </b-col>
                <b-col class="mt-4" lg="4" md="4" sm="6">
                    <b-card>
                        <b-skeleton type="input"></b-skeleton>
                        <b-skeleton-img class="mt-3" aspect="3:1"></b-skeleton-img>
                        <br>
                        <b-skeleton animation="fade" width="85%"></b-skeleton>
                        <b-skeleton animation="fade" width="55%"></b-skeleton>
                        <b-skeleton animation="fade" width="70%"></b-skeleton>
                        <b-skeleton class="mt-3" type="input"></b-skeleton>
                    </b-card>
                </b-col>
            </b-row>
            <b-row v-else>
                <b-col class="mt-4" lg="4" md="4" sm="6">
                    <b-card title="Prendas en llegada" align="center">
                        <D3PieChart :config="chart_configD" :datum="chart_dataD"></D3PieChart>
                        <b-card-text>
                            Some quick example text to build on the <em>card title</em> and make up the bulk of the card's
                            content.
                        </b-card-text>
                        <vs-button block> Detallar </vs-button>

                    </b-card>
                </b-col>
                <b-col class="mt-4" lg="4" md="4" sm="6">
                    <b-card title="Prendas en Salida" align="center">
                        <D3PieChart :config="chart_configD" :datum="chart_dataD"></D3PieChart>
                        <b-card-text>
                            Some quick example text to build on the <em>card title</em> and make up the bulk of the card's
                            content.
                        </b-card-text>
                        <vs-button block> Detallar </vs-button>

                    </b-card>
                </b-col>
                <b-col class="mt-4" lg="4" md="4" sm="6">
                    <b-card title="Prendas en Proceso" align="center">
                        <D3PieChart :config="chart_configD" :datum="chart_dataD"></D3PieChart>
                        <b-card-text>
                            Some quick example text to build on the <em>card title</em> and make up the bulk of the card's
                            content.
                        </b-card-text>
                        <vs-button block> Detallar </vs-button>
                    </b-card>
                </b-col>
            </b-row>
            <br>

            <b-row v-if="reload">
                <b-col class="mt-4" lg="4" md="12" sm="12" >
                    <b-card>
                        <b-skeleton type="input"></b-skeleton>
                        <br>
                        <b-skeleton animation="fade" width="100%"></b-skeleton>
                        <b-skeleton animation="fade" width="100%"></b-skeleton>
                        <b-skeleton animation="fade" width="100%"></b-skeleton>

                        <b-skeleton-img class="mt-3" aspect="3:1"></b-skeleton-img>
                        <br>
                        <b-skeleton animation="fade" width="100%"></b-skeleton>
                        <b-skeleton animation="fade" width="100%"></b-skeleton>
                        <b-skeleton animation="fade" width="100%"></b-skeleton>
                        <b-skeleton class="mt-3" type="input"></b-skeleton>
                    </b-card>
                </b-col>
                <b-col class="mt-4" lg="8" md="12" sm="12" >
                    <b-card>
                        <b-skeleton type="input"></b-skeleton>
                        <b-skeleton-img class="mt-3" aspect="3:1"></b-skeleton-img>
                        <br>
                        <b-skeleton animation="fade" width="55%"></b-skeleton>
                        <b-skeleton class="mt-3" type="input"></b-skeleton>
                    </b-card>
                </b-col>
                <b-col class="mt-4" lg="12" md="12" sm="12" >
                    <b-card>
                        <b-skeleton type="input"></b-skeleton>
                        <br>
                        <b-skeleton animation="fade" width="85%"></b-skeleton>

                        <b-skeleton-img class="mt-3" aspect="3:1"></b-skeleton-img>
                        <br>
                        <b-skeleton animation="fade" width="70%"></b-skeleton>
                        <b-skeleton class="mt-3" type="input"></b-skeleton>
                    </b-card>
                </b-col>
            </b-row>
            <b-row v-else>
                <b-col class="mt-4" lg="4" md="12" sm="12" >
                    <b-card title="Prendas en llegada" align="center">
                        <D3BarChart :config="chart_configH" :datum="chart_dataH" :title="chart_title" source="chart_source ejemplo data center "></D3BarChart>
                        <vs-button block> Detallar </vs-button>
                    </b-card>
                </b-col>
                
                <b-col class="mt-4" lg="8" md="12" sm="12" >
                    <b-card title="Prendas en llegada" align="center">
                        <D3BarChart
                        :config="chart_config"
                        :datum="chart_data"
                        :title="chart_title"
                        :source="chart_source"
                        ></D3BarChart>

                        <vs-button block> Detallar </vs-button>
                    </b-card>
                </b-col>
                
                <b-col class="mt-4" lg="12" md="12" sm="12" >
                    <b-card title="Prendas en llegada" align="center">
                        <D3LineChart :config="chart_configL" :datum="chart_dataL"></D3LineChart>
                        <vs-button block> Detallar </vs-button>
                    </b-card>
                </b-col>
            </b-row>

        </b-container>
        <div v-if="activarReboot">
            <loginComponent :login="activarReboot"></loginComponent>
        </div>

    </div>
</template>

<script>
import HeaderComponent from '@/components/Header.vue';
// import CalendarComponent from '@/components/calendario.vue';
import loginComponent from '@/components/cardLogin.vue';
import { D3BarChart, D3PieChart, D3LineChart } from 'vue-d3-charts';
import { DonutPie } from 'donut-pie'
import { refreshSession } from "@/service/service.js"



export default {
    name:"DashboardView",
    
    components: {
        HeaderComponent,
        // CalendarComponent,
        D3BarChart,
        D3PieChart,
        D3LineChart,
        DonutPie,
        loginComponent
    },
    data: () => ({
        url: process.env.VUE_APP_SERVICE_URL_API,
        "reload":true,
        activarReboot: false,
        dp: 90,
        value: 33.333333333,
        max: 50,
        chart_title: 'Titulo de la barra',
        chart_source: 'Datos',
        chart_data: [
            //...
            {hours: 1892, production: 2541, year: '2013'},
            {hours: 1273, production: 2541, year: '2014'},
            {hours: 1234, production: 2541, year: '2015'},
            {hours: 3676, production: 9613, year: '2016'},
            {hours: 3578, production: 6315, year: '2017'},
            {hours: 4323, production: 2541, year: '2018'},
            {hours: 4567, production: 2541, year: '2019'},
            {hours: 4687, production: 2541, year: '2020'},
            {hours: 4343, production: 2541, year: '2021'},
            {hours: 3443, production: 2541, year: '2022'},
            {hours: 5000, production: 2541, year: '2023'},
        ],
        chart_config: {
            key: 'year',
            currentKey: '2004',
            values: ['hours'],
            axis: {
                yTicks: 3
            },
            color: {
                default: '#222f3e',
                current: '#41B882'
            }
        },  
        chart_dataD: [
            {hours: 20, name: 'Lorem'},
            {hours: 30, name: 'Ipsum'},
            {hours: 31, name: 'Dolor'},
            {hours: 15, name: 'Sit'},
        ],
        chart_configD: {
            key: 'name',
            value: 'hours',
            color: {scheme: 'schemeTableau10'},
            radius: {inner: 80},
            

        },
        count: 1,
        chart_dataL: [
            {hours: 238, production: 134, date: 2000},
            {hours: 938, production: 478, date: 2001},
            {hours: 1832, production: 1392, date: 2002},
            {hours: 2092, production: 2343, date: 2003},
            {hours: 2847, production: 2346, date: 2004},
            {hours: 2576, production: 2233, date: 2005},
            {hours: 2524, production: 2325, date: 2006},
            {hours: 1648, production: 2456, date: 2007},
            {hours: 2479, production: 2329, date: 2008},
            {hours: 3200, production: 2438, date: 2009}
        ],
        chart_configL: {
            values: ['hours', 'production'],
            date: {
                key: 'date',
                inputFormat: '%Y',
                outputFormat: '%Y',
            },
            tooltip: {
                labels: ['Total hours', 'Total production']
            },
            axis: {
                yFormat: '.1s',
                yTicks: 6,
                yTitle: 'Lorem ipsum',
                xTicks: 5,
            },
            color: {
            scheme: ['#41B882', '#222f3e']
            },
            transition: {
                ease: 'easeBounceOut',
                duration: 1000
            }
        },
        chart_dataH: [
        {vue: 20, d3: 62, category: 'lorem'},
        {vue: 28, d3: 47, category: 'ipsum'},
        {vue: 35, d3: 36, category: 'dolor'},
        {vue: 60, d3: 24, category: 'sit'},
        {vue: 65, d3: 18, category: 'amet'},
      ],
      chart_configH: {
        key: 'category',
        values: ['vue', 'd3'],
        orientation: 'horizontal',
        color: {
          keys: {
            vue: '#41b882',
            d3: '#b35899', 
          },
        },
      },
      chart_dataHD: [
        {vue: 20, category: 'lorem'},
        {vue: 28, category: 'ipsum'},
        {vue: 35, category: 'dolor'},
      ],
      
      chart_configHD: {
        key: 'category',
        values: ['vue'],
        orientation: 'horizontal',
        color: {
          keys: {
            vue: '#0d6efd',
          },
        },
      },
    }),
    created(){
        refreshSession(this.url ,this.$session.get('token')).then( data => {
            this.$session.start()
            this.$session.set('token', data.datos.token)
        })
    },
    mounted(){
        setTimeout(() => {
            this.reload = false
        }, 4000);
    },
    methods:{
        refresh(){
            refreshSession(this.url ,this.$session.get('token')).then( data => {
                this.$session.start()
                this.$session.set('token', data.datos.token)
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
.cardKM{
    display: grid;
    place-items: center;
}
</style>