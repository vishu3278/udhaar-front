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
            
            <div v-for="(item) in groupedDataByYear" :key="item.year">
                <h3 class="font-medium px-1 border border-indigo-200 text-indigo-600">{{ item.year }}</h3>
                <ul>
                    <li v-for="(value, index) in item.data" :key="value+index" class="border pb-2 px-1">
                        <!-- <span class="text-gray-400">{{value.name}}</span> -->
                        <p class="font-bold">{{ value.name }}</p>{{ value.total }}
                    </li>
                </ul>
            </div>
        </article>
    </section>
</template>
<script setup>
import { ref, provide, onBeforeMount, onMounted, onUpdated, computed, watch, watchEffect, nextTick, onErrorCaptured } from 'vue'
import NewsCard from '@/components/NewsCard.vue'
import { db } from '@/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useStore } from 'vuex'
import * as echarts from 'echarts';
import { toDate, parseISO, isValid, getMonth, getYear } from 'date-fns'
import { use } from 'echarts/core'
import { PieChart, BarChart } from 'echarts/charts'

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
const year = ref(2022)
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

const groupedDataByYear = ref([])

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

watchEffect(() => {
    let l = []
    let d = []
    for (let [key, value] of Object.entries(groupedData.value)) {
        // console.info(key)
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
})

/*onBeforeMount(() => {
    console.log("before mount")
})*/

onMounted(async () => {
    loading.value = true
    // console.log('on mounted')

    if (store.getters.getPayees.length < 1) {
        store.dispatch("fetchData").then(() => {
            loading.value = false
            // renderChart()
        })
    }

    // realtime update
    // const payees = collection(db, "payees")

    // const udhaar = await getDocs(collection(db, "payees", "N2aGDPMMbwGw1VjgA8NM", "udhaar"));
    // const q = query(udhaar, where("amount", ">=", "5000"))
    /*udhaar.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });*/

    // getUdhaarByDate()
    groupedDataByYear.value = await groupAllUdhaar(store.getters.getPayees)
})

onUpdated(() => {
    // renderChart()
    // getUdhaarByDate()
})

onErrorCaptured((e) => {
    console.log(e)
})

function parseDate(date) {
    // supports both "YYYY-MM-DD" and "DD-MM-YYYY"
    if (date.includes("-")) {
        const parts = date.split("-");
        if (parts[0].length === 4) return parseISO(date); // YYYY-MM-DD
        return parseISO(`${parts[2]}-${parts[1]}-${parts[0]}`); // DD-MM-YYYY
    }
    return parseISO(date);
}

function groupAllUdhaar(data) {
    const yearGroups = {};
    // console.log(data)
    data.forEach(person => {
        person.udhaar.forEach(u => {
            const year = getYear(parseDate(u.date));

            if (!yearGroups[year]) yearGroups[year] = [];

            yearGroups[year].push({
                name: person.name,
                total: u.amount
            });
        });
    });

    // convert to requested final format
    return Object.keys(yearGroups).map(year => ({
        year,
        data: yearGroups[year]
    }));
}

const getUdhaarByDate = () => {
    let byYear = []
    payees.value.map(p => {
        // console.info(p.id)
        let d = parseISO(p.udhaar[0]?.date)
        // console.log(d, isValid(d))
        if (isValid(d)) {
            console.info(getMonth(d), getYear(d))
        } else {
            // console.warn("invalid date")
            console.warn(d)
        }
    })

}

const renderChart = () => {
    const chartDom = document.getElementById('chart');
    console.info(chartDom)
    if (!chartDom) return
    let myChart = echarts.init(chartDom);
    let option = {
        tooltip: {
            trigger: 'item'
        },
        title: {
            show: false,
            text: "Udhaar Chart",
            left: 'center',
            // right: 'center',
            // textAlign: 'center',
        },
        legend: {
            // show: false,
            // top: 20,
            bottom: 20,
            left: 'center',
            icon: "pin",
            itemGap: 20,
            textStyle: {
                fontSize: 14,
            }
        },
        series: [{
            name: 'Udhaar',
            type: 'pie',
            radius: ['15%', '40%'],
            avoidLabelOverlap: true,
            /*itemStyle: {
                borderRadius: 3,
                borderColor: '#fff',
                borderWidth: 1
            },*/
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                /*label: {
                    show: true,
                    fontSize: '32',
                    fontWeight: 'bold'
                }*/
            },
            labelLine: {
                length: 20,
                showAbove: true,
                smooth: 0.25,
            },
            label: {
                formatter: ' {b|{b}}\n{c|{c}}\n{d|{d}%} ',
                position: 'outside',
                fontWeight: 'bold',
                // backgroundColor: '#F6F8FC',
                // padding: 4,
                // borderColor: '#8C8D8E',
                // borderWidth: 1,
                // borderRadius: 4,
                alignTo: 'labelLine',
                rich: {
                    b: {
                        color: '#4C5058',
                        fontSize: 14,
                        lineHeight: 18
                    },
                    c: {
                        color: '#6E7079',
                        fontSize: 16,
                        fontWeight: 'bold',
                        lineHeight: 20,
                    },
                    d: {
                        color: "#657892",
                        fontWeight: 'light',
                        lineHeight: 16
                    }
                }
            },
            data: [
                { value: pending.value, name: 'Pending' },
                { value: bad.value, name: 'Bad' },
                { value: recovered.value, name: 'Recovered' },
            ],
            color: ['#eab308', '#ef4444', '#22c55e'],
        }]
    };

    option && myChart.setOption(option);
}


const chart1 = ref({
    // backgroundColor: 'transparent',
    // darkMode: false,
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
        // left: 'auto',
        // right: 'auto',
        align: 'auto',
        top: 40,
        data: ['Pending', 'Recovered', 'Bad'],
    },
    series: [{
        // name: 'Udhaar',
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
            // position: 'inside',
            formatter: '{b}:{d}%',
            // rotate: true,
            borderWidth: 0,
        },
        itemStyle: {
            // borderType: 'dashed',
            borderWidth: 2,
            borderColor: 'white',
        },
        /*emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },*/
    }, ],
});

/*return {
    payees,
    msg,
    total,
    pending,
    bad,
    recovered,
    loading,
    error,
    totalUdhaar,
    getUdhaarByDate,
    groupedData,
    // chartData,
    chartLabels,
    chartDatasets,
    year,
    chart1,
    chart2,
    chartColors,
}*/
// }
// }
</script>
<style lang="css" scoped>
#chart {
    /*    max-width: 720px;*/
}

.chart {
    height: 400px;
}
</style>