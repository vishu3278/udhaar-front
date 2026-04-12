<template>
    <section class="py-1 px-4 ">
        <div v-if="loading">Loading...</div>
        <div v-if="error">{{ error }}</div>
        <div class="grid grid-cols-3 my-4">
            <div class="column ">
                <div class="grid grid-cols-2 gap-5">
                    <div class="column col-span-2">
                        <div class="card rounded-lg p-3 bg-gradient-to-br from-sky-200 to-sky-400">
                            <div class="card-body ">
                                <h4 class="font-bold text-sky-800">{{total}}</h4>
                            </div>
                            <div class="card-header">
                                <div class="card-title h5">Total</div>
                                <div class="card-subtitle ">Payees - {{payees.length}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="column ">
                        <div class="card rounded-lg p-3 bg-gradient-to-br from-yellow-200 to-yellow-400">
                            <div class="card-body ">
                                <h4 class="font-bold text-amber-600">{{pending}}</h4>
                            </div>
                            <div class="card-header">
                                <div class="card-title h5">Pending</div>
                                <div class="card-subtitle ">lorem ipsum</div>
                            </div>
                        </div>
                    </div>
                    <div class="column ">
                        <div class="card rounded-lg p-3 bg-gradient-to-br from-red-200 to-red-400">
                            <div class="card-body ">
                                <h4 class="font-bold text-red-800">{{bad}}</h4>
                            </div>
                            <div class="card-header">
                                <div class="card-title h5">Bad</div>
                                <div class="card-subtitle ">lorem ipsum</div>
                            </div>
                        </div>
                    </div>
                    <div class="column col-span-2">
                        <div class="card rounded-lg p-3 bg-gradient-to-br from-green-200 to-green-400">
                            <div class="card-body ">
                                <h4 class="font-bold text-green-800">{{recovered}}</h4>
                            </div>
                            <div class="card-header">
                                <div class="card-title h5">Recovered</div>
                                <div class="card-subtitle ">lorem ipsum</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column ">
                <!-- <div id="chart" class="mx-auto" style=" width:600px; aspect-ratio: 4 / 3;"></div> -->
                <v-chart class="chart" :option="chart1" autoresize />
                <!-- <img :src="`https://quickchart.io/chart?width=500&height=400&chart={type:'doughnut',data:{labels:['Pending','Bad', 'Recovered'], datasets:[{backgroundColor:['rgb(234,179,8)','rgb(239,68,68)','rgb(37,194,97)'],borderWidth:4, fontColor:'rgb(250,250,250)',data:[${pending},${bad},${recovered}]}]}}`" /> -->
                <!-- <div class="card p-3 rounded">
                    <div class="card-header">
                        <div class="card-title font-bold text-blue-400">Total</div>
                        <div class="card-subtitle font-black text-xl">{{totalUdhaar}}</div>
                    </div>
                    <div class="card-body">
                        <div v-for="item in payees" :key="item.id">
                            <div class="flex gap-3">
                                <p class="font-semibold text-pink-500">{{item.name}}</p>
                                <span> - {{item.mobile}}</span>
                                <strong class="text-orange-600">{{item.total}}</strong>
                                <pre>{{item.udhaar}}</pre>
                            </div>
                            <hr>
                        </div>
                    </div>
                </div> -->
            </div>
            <div class="column">
                <!-- <h5>Another chart api</h5>
                (https://quickchart.io) -->
                <!-- <select v-model="year">
                    <option v-for="(value, key) in groupedData" :value="key">{{key}}</option>
                </select> -->
                <div class="flex flex-wrap gap-1 mb-2">
                    <button v-for="(value, key) in groupedData" :key="value" class="btn-sm" :class="{'text-blue-800 bg-blue-200': year == key}" @click="year = key">{{key}}</button>
                </div>
                <template v-if="chartLabels.length > 0 && chartDatasets.length > 0">
                    <!-- <img :src="`https://quickchart.io/chart?width=500&height=400&chart={type:'bar',data:{labels:[${chartLabels}], datasets:[{label:${year},backgroundColor:'rgb(55,125,200)',data:[${chartDatasets}]}]}}`" /> -->
                    <VChart class="chart w-full" :option="chart2"></VChart>
                </template>
            </div>
        </div>
        <article class="flex gap-3">
            
            <!-- <div v-for="(item) in groupedDataByYear" :key="item.year"> -->
                <!-- <h3 class="font-medium px-1 border border-indigo-200 text-indigo-600">{{ item.year }}</h3>
                <ul>
                    <li v-for="(value, index) in item.data" :key="value+index" class="border pb-2 px-1">
                        <p class="font-bold">{{ value.name }}</p>{{ value.total }}
                    </li>
                </ul> -->
                <table>
                    <thead>
                        <tr>
                            <th>Year</th>
                            <th>Name / Amount</th>
                            <!-- <th>Amount</th> -->
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item) in groupedDataByYear" :key="item.year">
                            <td class="font-bold text-blue-600">{{ item.year }}</td>
                            <td><ul class="flex gap-1">
                                <li v-for="(value, index) in item.data" :key="value+index" class="border border-slate-200 px-1">

                                    <strong class="text-slate-800">{{ value.name }} - </strong>
                                    <span class="text-green-600">₹{{ value.total }}</span>
                                    
                                </li>
                            </ul></td>
                        </tr>
                    </tbody>
                </table>
            <!-- </div> -->
        </article>
    </section>
</template>
<script setup>
import { ref, provide, onMounted, computed, watchEffect, onErrorCaptured } from 'vue'
import { collection, getDocs } from 'firebase/firestore';
import { useStore } from 'vuex'
import { toDate, parseISO, isValid, getMonth, getYear } from 'date-fns'
import { use } from 'echarts/core'
import { PieChart, BarChart } from 'echarts/charts'
import { parseDate, groupAllUdhaar } from '@/utils/dataHelper';

import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import { SVGRenderer } from 'echarts/renderers'
// import { CanvasRenderer } from 'echarts/renderers';
import VChart, { THEME_KEY } from 'vue-echarts';

// export default {
/*components: {
    VChart
}*/
// setup() {
use([
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    PieChart,
    BarChart,
    SVGRenderer,
    GridComponent,
    // CanvasRenderer
])

provide(THEME_KEY, '');

const store = useStore()
// let payees = ref([])
let msg = ref(null)
// let total = ref(0)
// let pending = ref(0)
// let bad = ref(0)
// let recovered = ref(0)
const loading = ref(true);
const error = ref(null);
const chartLabels = ref([])
const chartDatasets = ref([])
const year = ref(new Date().getFullYear())
const chartColors = ref([
    "#73c0de",
    "#fac858",
    "#9a60b4",
    "#91cc75",
    "#fc8452",
    "#5470c6",
    "#ee6666",
    "#3ba272",
    "#ea7ccc"
])

// computed properties
const payees = computed(() => {
    return store.getters.getPayees
})
const total = computed(() => store.getters.getTotal)
const recovered = computed(() => store.getters.getRecovered)
const bad = computed(() => store.getters.getBad)
const totalUdhaar = computed(() => {
    return payees.value.reduce((accumulator, item) => accumulator + parseInt(item.total), 0);
    // return payees.length
});
const pending = computed(() => total.value - (recovered.value + bad.value))

const groupedData = computed(() => {
    return payees.value.reduce((acc, item) => {
        const year = getYear(parseISO(item.udhaar[0]?.date)); // Extract year from date
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(item);
        return acc;
    }, {});
});

const chart2 = ref({

    title: {
        text: 'Udhaar by year',
        textStyle: {
            color: "#0ea5e9",
        }
    },
    tooltip: {
        show: true
    },
    /*legend: {
      data: ['Udhaar']
    },*/
    xAxis: {
        data: [],
        axisLabel: {
            // inside: true,
            rotate: 45,
        }
    },
    yAxis: {},
    series: [{
        name: 'Udhaar',
        type: 'bar',
        data: []
    }]
})

const chart1 = ref({
    title: {
        text: 'Udhaar',
        left: 'center',
        textStyle: {
            color: '#0ea5e9'
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)',
    },
    legend: {
        orient: 'horizontal',
        align: 'auto',
        top: 40,
        data: ['Pending', 'Recovered', 'Bad'],
    },
    series: [{
        type: 'pie',
        radius: ['20%', '60%'],
        center: ['50%', '60%'],
        data: [
            { value: pending.value, name: 'Pending' },
            { value: recovered.value, name: 'Recovered' },
            { value: bad.value, name: 'Bad' },
        ],
        color: ['#eab308', '#22c55e', '#ef4444'],
        label: {
            formatter: '{b}:{d}%',
            borderWidth: 0,
        },
        itemStyle: {
            borderWidth: 2,
            borderColor: 'white',
        },
    }, ],
});

const groupedDataByYear = ref([])

/*watch (groupedData, (newValue, oldValue) => {
    let l = []
    let d = []
    for(let [key, value] of Object.entries(newValue)){
        console.info(key)
        if(key == 2022){
            if (key == 2022) {
                value.map(elem => {
                    l.push(elem.name)
                    d.push(value.total)
                })
            }
        }
    }
    chartLabels.value = l
    chartDatasets.value = d            
})*/

watchEffect(async () => {
    // Update chart2 (Bar Chart)
    let l = []
    let d = []
    for (let [key, value] of Object.entries(groupedData.value)) {
        if (key == year.value) {
            value.map((elem, index) => {
                l.push(elem.name)
                d.push({ value: elem.total, itemStyle: { color: chartColors.value[index] } })
            })
        }
    }
    chartLabels.value = l
    chartDatasets.value = d
    chart2.value.xAxis.data = l
    chart2.value.series[0].data = d

    // Update chart1 (Pie Chart)
    chart1.value.series[0].data = [
        { value: pending.value, name: 'Pending' },
        { value: recovered.value, name: 'Recovered' },
        { value: bad.value, name: 'Bad' },
    ]

    // Update groupedDataByYear
    groupedDataByYear.value = await groupAllUdhaar(payees.value)
})

/*onBeforeMount(() => {
    console.log("before mount")
})*/

onMounted(async () => {
    loading.value = true

    if (store.getters.getPayees.length < 1) {
        await store.dispatch("fetchData")
    }
    loading.value = false
})

onErrorCaptured((e) => {
    console.log(e)
})
</script>
<style lang="css" scoped>
.chart {
    height: 400px;
}
</style>