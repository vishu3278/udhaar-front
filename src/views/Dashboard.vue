<template>
    <section class="py-1 px-4 ">
        <div v-if="loading">Loading...</div>
        <div v-if="error">{{ error }}</div>
        <div class="grid grid-cols-3 my-4">
            <div class="column ">
                <div class="grid grid-cols-2 gap-5">
                    <div class="column col-span-2">
                        <div class="card rounded-lg p-3 bg-gradient-to-br from-sky-200 to-sky-500">
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
                        <div class="card rounded-lg p-3 bg-gradient-to-br from-yellow-200 to-yellow-500">
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
                        <div class="card rounded-lg p-3 bg-gradient-to-br from-red-200 to-red-500">
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
                        <div class="card rounded-lg p-3 bg-gradient-to-br from-green-200 to-green-500">
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
                <div v-for="(items, year) in groupedData" :key="year">
                  <h2>{{ year }}</h2>
                  <ul>
                    <li v-for="item in items" :key="item.id">{{ item.name }} - {{ item.total }}</li>
                  </ul>
                </div>
            </div>
            <div class="column ">
                <div id="chart" class="mx-auto" style=" width:600px; aspect-ratio: 4 / 3;"></div>
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
                <h5>Another chart api</h5>
                (https://quickchart.io)
                <img src="https://quickchart.io/chart?width=500&height=400&chart={type:'bar',data:{labels:['Jan','Feb', 'Mar','Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'], datasets:[{label:'Udhaar',data:[50,60,70,180,190]}, {label:'Recovered',data:[100,200,300,400,500]}]}}" />
            </div>
        </div>
        
    </section>
</template>
<script>
import { ref, onBeforeMount, onMounted, onUpdated, computed, nextTick, onErrorCaptured } from 'vue'
import NewsCard from '@/components/NewsCard.vue'
import { db } from '@/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useStore } from 'vuex'
import * as echarts from 'echarts';
import { toDate, parseISO, isValid, getMonth, getYear } from 'date-fns'

export default {
    setup() {
        const store = useStore()
        // let payees = ref([])
        let msg = ref(null)
        // let total = ref(0)
        // let pending = ref(0)
        // let bad = ref(0)
        // let recovered = ref(0)
        const loading = ref(true);
        const error = ref(null);

        const payees = computed(() => {
            return store.getters.getPayees
        } )
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

        /*onBeforeMount(() => {
            console.log("before mount")
        })*/

        onMounted(() => {
            loading.value = true
            // console.log('on mounted')

            if(store.getters.getPayees.length < 1) {
                store.dispatch("fetchData").then(() => {
                    loading.value = false
                })
            }
        })

        onUpdated(() => {
            // renderChart()
            // getUdhaarByDate()
        })

        onErrorCaptured((e) => {
            console.log(e)
        })

        const getUdhaarByDate = () => {
            /*const payeesRef = collection(db, "payees");
            const q = query(payeesRef, where("udhaar", "==", true));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, " => ", doc.data());
            });*/
            let byYear = []
            payees.value.map(p => {
                // console.info(p.id)
                let d = parseISO(p.udhaar[0]?.date)
                // console.log(d, isValid(d))
                if(isValid(d)){
                    console.info(getMonth(d), getYear(d))
                } else {
                    // console.warn("invalid date")
                    console.warn(d)
                }
            })

        }

        const renderChart = () => {
            const chartDom = document.getElementById('chart');
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
        return {
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
        }
    }
}
</script>
<style lang="css" scoped>
#chart {
/*    max-width: 720px;*/
}
</style>