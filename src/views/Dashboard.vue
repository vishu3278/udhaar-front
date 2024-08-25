<template>
    <section class="py-1 px-4 ">
        <div v-if="loading">Loading...</div>
        <div v-if="error">{{ error }}</div>
        <div class="grid grid-cols-2 my-4">
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
            </div>
            <div class="column ">
                <div id="chart" style=" width:100%; aspect-ratio: 1 / 1;"></div>
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
        </div>
    </section>
</template>
<script>
import { ref, onBeforeMount, onMounted, onUpdated, computed, nextTick, onErrorCaptured } from 'vue'

// import { db } from '@/firebase';
// import { collection, getDocs } from 'firebase/firestore';
import { useStore } from 'vuex'
import * as echarts from 'echarts';

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

        /*onBeforeMount(() => {
            console.log("before mount")
        })*/

        onMounted(() => {
            loading.value = true
            // console.log('on mounted')

            // fetchData()
            store.dispatch("fetchData").then(() => {
                loading.value = false
            })
        })

        onUpdated(() => {
            renderChart()
        })

        onErrorCaptured((e) => {
            console.log(e)
        })

        /*const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'payees'));
                
                querySnapshot.forEach(async (doc) => {
                    const udh = { id: doc.id, ...doc.data(), total: 0, udhaar: [] }
                    const query = await getDocs(collection(db, "payees", doc.id, "udhaar"));
                    query.forEach(async (docU) => {
                        // console.log(docU.id, " => ", docU.data(), udh);
                        udh.total += docU.data().amount
                        let ent = { id: docU.id, ...docU.data(), transaction: [] }
                        const queryT = await getDocs(collection(db, "payees", doc.id, "udhaar", docU.id, "transaction"));
                        queryT.forEach(docT => {
                            console.log(docT.id, docT.data())
                            ent.transaction.push({...docT.data(), id: docT.id})
                            recovered.value += docT.data().amount
                            
                        })
                        udh.udhaar.push(ent)
                        total.value += docU.data().amount
                    });
                    
                    // return udh
                    // console.log("udhaar w/transact", udh)
                    payees.value.push({ id: doc.id, ...doc.data(), ...udh })
                })

                this.$store.dispatch('setPayees', payees.value)

            } catch (err) {
                error.value = err.message;
            } finally {
                loading.value = false;
            }
        };*/

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
                    top: 20,
                    // bottom: 20,
                    left: 'center',
                    // icon: "pin",
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
        }
    }
}
</script>
<style lang="css" scoped>
#chart {
    max-width: 720px;
}
</style>