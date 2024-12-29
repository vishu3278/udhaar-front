<template>
    <section class="container my-4">
        <div class="grid grid-cols-3 gap-3">
            <div class="column">
                <div class="card bg-gradient-to-br from-blue-200 to-blue-400 rounded p-4">
                    <div class="card-header text-blue-800">
                        <div class="card-title ">
                            Total
                        </div>
                        <strong class="text-2xl">{{ total }}</strong>
                        <!-- <div class="card-subtitle text-gray">lorem ipsum</div> -->
                    </div>
                    <!-- <div class="card-body ">
                        <h4 class="">{{total}}</h4>
                    </div> -->
                </div>
            </div>
            <!-- <div class="divider-vert"></div> -->
            <div class="column">
                <div class="card bg-gradient-to-br from-yellow-200 to-yellow-400 rounded p-4">
                    <div class="card-header text-amber-600">
                        <div class="card-title ">
                            Pending
                        </div>
                        <strong class="text-2xl">{{ pending }}</strong>
                        <!-- <div class="card-subtitle text-gray">lorem ipsum</div> -->
                    </div>
                </div>
            </div>
            <!-- <div class="divider-vert"></div> -->
            <div class="column">
                <div class="card bg-gradient-to-br from-red-200 to-red-400 rounded p-4">
                    <div class="card-header text-red-800">
                        <div class="card-title ">
                            Bad
                        </div>
                        <strong class="text-2xl">{{ bad }}</strong>
                        <!-- <div class="card-subtitle text-gray">lorem ipsum</div> -->
                    </div>
                </div>
            </div>
            <!-- <div class="divider-vert"></div> -->
        </div>
    </section>
    <div class="container">
            <div :class="{'w-4/5': detail}">
                
                <table class="table compact table-striped table-hover w-full">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Amount</th>
                            <!-- <th>Remarks</th> -->
                            <th>Pending</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="p in payees">
                            <table-row :fields="fields" :row-data="p" :active="detail?.id" @show-detail="getPeopleDetail(p)"></table-row>
                        </template>
                        <!-- <tr v-for="(p, index) in payees" :key="index" :class="{'selected': p.id == detail.id}" @click.stop="getPeopleDetail(p)">
                            <td>{{ p.name }} - <span class="text-slate-500">{{ p.id }}</span></td>
                            <td class="text-right">
                                {{ p?.total }}
                            </td>
                            
                            <td>{{ p.remarks }}</td>
                            <td>
                                <span v-show="p.pending == 0" class="text-xs px-2 rounded-full bg-green-300 mr-1">Done</span>
                            </td>
                            <td class="text-center">
                                <span v-show="p.udhaar[0]?.bad" class="text-xs px-2 rounded-full bg-rose-200 text-red-800 mr-1">Bad</span>
                            </td>
                            <td>
                                <button class="btn btn-sm" >Details</button>
                            </td>
                        </tr> -->
                    </tbody>
                </table>
            </div>
        
            <div v-show="detail" class="fixed bg-gradient-to-br from-stone-100 to-neutral-300 udhaar-panel outline outline-4 outline-neutral-300 top-0 right-0 bottom-0 z-50">
                <aside class="p-4 h-full flex flex-col justify-between">
                    <template v-if="detail">
                        <div>
                            <h4 class="text-indigo-500 font-bold mb-0 flex gap-3 flex-wrap items-center">{{detail.name}} 
                                <button @click="detail = null" class="ml-auto px-3 text-sm ">x</button>
                            </h4>
                            <small class=" text-indigo-600 inline-flex text-sm ">{{detail.id}}</small> 
                            <p class="mb-2"><i class="ri-phone-line"></i> {{detail.mobile}} - <i class="ri-mail-line"></i>{{detail.email}}</p>
                            <hr>
                        </div>
                        <div class="mb-4 overflow-y-auto">
                            
                            <div v-for="item in detail.udhaar" class="bg-slate-100 border border-indigo-300 rounded drop-shadow py-1 px-2 mt-2">
                                <div class="mr-auto">
                                    <small>{{item.id}}</small>
                                    <div class="udhaar text-base flex items-center justify-between border-y border-solid border-indigo-300 py-2 mb-2">
                                        <span class="text-center font-bold w-24"><i class="ri-wallet-line text-2xl text-indigo-400"></i> <br>{{item.amount}}</span>
                                        <span class="text-center min-w-24"><i class="ri-calendar-line text-2xl text-indigo-400"></i> <br>{{humanDate(item.date)}}</span>
                                        <span v-show="item?.bad" class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 to-rose-300 text-rose-600 text-3xl font-bold shadow">B</span>
                                        <span v-if="udharComplete(item) == 'pending'" class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-amber-300 text-amber-600 font-bold text-3xl shadow">P</span>
                                        <span v-else class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-300 text-emerald-600 font-bold text-3xl shadow">C</span>
                                    </div>
                                    <div v-for="trx in item.transaction" :key="trx.id" class="">&bull; {{trx.amount}} - {{humanDate(trx.date)}}</div>
                                </div>
                                <div class="mb-2 mt-2 pt-2 border-t border-indigo-300 border-solid">
                                    <button v-if="transactionForm != item.id && udharComplete(item) == 'pending'" class="btn-sm" @click="showTrnzForm(item.id)">Add transaction</button>
                                    <template v-if="transactionForm == item.id">
                                        <div class="flex gap-2 items-end">
                                            <div class="form-group">
                                                <label class="form-label">Amount</label>
                                                <input class="form-input input-sm" type="number" v-model="transactionAmount" placeholder="Amount" />
                                            </div>
                                            <div class="form-group">
                                                <label class="form-label">Date</label>
                                                <input class="form-input input-sm" type="date" v-model="transactionDate" placeholder="Date" />
                                            </div>
                                            <div class="form-group flex gap-2">
                                                <button class="btn-sm " @click="transactionForm = null">Close</button>
                                                <button class="btn-sm" @click="submitTransaction(detail.id, item.id)">Add</button>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>

                        <!-- <button class="btn">Add new udhaar</button> -->
                        </div>
                        <!-- <br> -->
                        <!-- <hr> -->
                        
                        <div class="content bg-neutral-100 drop-shadow rounded p-2 mt-auto">
                            <h5 class="text-indigo-500">Add udhaar</h5>
                            <div class="flex gap-2">
                                <div class="form-group grow">
                                    <label class="form-label">Amount</label>
                                    <input class="form-input input-sm" type="number" v-model="udhaarAmount" placeholder="Amount" />
                                </div>
                                <div class="form-group grow">
                                    <label class="form-label">Date</label>
                                    <input class="form-input input-sm" type="date" v-model="udhaarDate" placeholder="Due date" />
                                </div>
                                <div class="form-group shrink">
                                    <label class="form-label">&nbsp;</label><br>
                                    <button class="btn" @click="addUdhaar">Add</button>
                                </div>
                            </div>
                        </div>
                    </template>
                        
                    
                </aside>
            </div>
        
    </div>
</template>
<script>
import { ref, onBeforeMount, onMounted, onUpdated, computed, nextTick, onErrorCaptured } from 'vue'
import { useStore } from 'vuex'

import axios from "axios"
// import Modal from "@/components/Modal.vue"
// import Transactions from "@/components/udhaar/Transactions.vue"
import TableRow from '@/components/TableRow.vue'

import { db } from "@/firebase";
import { collection, doc, getDocs, addDoc } from 'firebase/firestore';
import { format, isValid, formatDistanceToNow, compareAsc } from "date-fns";
// import { date_format } from '@/constants.js'
// import * as echarts from 'echarts';

export default {
    components: {
        TableRow
    },
    setup(){
        const store = useStore()
        const fields = ["id", 'name', "total",  "pending", "status", "action"]
        const detail = ref(null)
        const udhaarAmount = ref(0)
        const udhaarDate = ref(null)
        const transactionForm = ref(null)
        const transactionAmount = ref(0)
        const transactionDate = ref(null)
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

        onMounted(() => {
            // console.log('on mounted', store.getters.getPayees.length < 1)
            if(store.getters.getPayees.length < 1) store.dispatch("fetchData")
        })

        onErrorCaptured((e) => {
            console.log(e)
        })

        function getPeopleDetail(p) {
            detail.value = p
         } 

        async function addUdhaar () {
            if(detail.value.id){
                // console.log(detail.value.id, udhaarAmount.value, udhaarDate.value)

                const udh = await addDoc(collection(db, "payees", detail.value.id, "udhaar"), {
                  amount: udhaarAmount.value,
                  date: udhaarDate.value
                });

                // console.log("document created", udh.id)
                udhaarAmount.value = 0
                udhaarDate.value = null

                const newUdh = await store.dispatch("fetchSinglePayee", detail.value.id)
                // console.log(newUdh)
                detail.value = newUdh
                
                // detail.value = null
            }
        }

        function showTrnzForm(udhaarId){
            // console.log(...arguments)
            transactionForm.value = udhaarId
        }

        function udharComplete (udhaar) {
            let initV = 0
            let trxTotal = udhaar.transaction.reduce((acc, curr) => acc + curr.amount, initV)
            // console.log(trxTotal, udhaar.amount)
            if (trxTotal == udhaar.amount) {
                return "complete"
            } else {
                return "pending"
            }
        }

        async function submitTransaction(payeeId, udhaarId){
            try {
                const txn = await addDoc(collection(db, "payees", payeeId, "udhaar", udhaarId, "transaction"), {
                    amount: transactionAmount.value,
                    date: transactionDate.value
                });

                console.log("trx added",txn.id)
                transactionAmount.value = 0
                transactionDate.value = null
                transactionForm.value = null
                store.dispatch("fetchData")
                
            } catch(e) {
                console.warn(e);
            }
        }

        function humanDate(d) {
            if (d && isValid(new Date(d))) {
                return format(new Date(d), "dd-MMM-yyyy");
            } else {
                return "-";
            }
        }

        return {
            fields,
            payees,
            // msg,
            total,
            pending,
            bad,
            recovered,
            // loading,
            // error,
            totalUdhaar,
            detail,
            udhaarAmount,
            udhaarDate,
            getPeopleDetail,
            addUdhaar,
            showTrnzForm,
            transactionForm,
            transactionAmount,
            transactionDate,
            submitTransaction,
            udharComplete,
            humanDate,
        }
    }
    /*name: "Udhaar",
    components: {
        Transactions,
        Modal,
    },*/

    /*data() {
        return {
            payees: [],
            payee: null,
            transactions: null,
            msg: "",
            total: 0,
            pending: 0,
            bad: 0,
            transactionModal: false,
            transaction: {
                // id: null,
                amount: 0,
                date: null,
                udhaar_id: null,
                people_id: null,
            },
            udhaar: {
                people_id: null,
                amount: 0,
                date: null,
            },
            loading: false,
            udhaarModal: false,
            detail: null,
        };
    },*/

    /*mounted() {
        // console.log('mounted')
        
        axios.get(
                import.meta.env.VITE_API_URL + "/people").then(res => {
                // console.log(res.data)
                this.payees = res.data.data
                this.loading = false
            }).catch(err => console.warn(err))
        getPayees()
            .then((p) => {
                console.log(p)
                this.payees = p;
            })
            .catch((e) => console.log(e));
    },*/
    /*methods: {
        calcAmount(udhaars){
            // const udhrs = [...udhaars]
            // console.log(udhaars)
            if (udhaars.length == 0) {
                return "0.00"
            }
            if (udhaars.length == 1) {
                return udhaars[0].amount
            }
            if (udhaars.length > 1) {
                let t = udhaars.reduce((acc,curr) => acc + Number(curr.amount), 0)
                // console.log(t)
                return Number.parseFloat(t).toFixed(2);
            } 
        },
        addBadPayee(id) {
            updatePayee(id, { bad: true })
                .then((res) => {
                    console.log(res);
                    this.msg = "Success";
                    this.autocloseModal();
                })
                .catch((e) => {
                    console.log(e);
                    this.msg = e;
                });
        },
        markNotBad(id) {
            console.log('not bad')
        },
        donePayee(payee) {
            // console.log(payee)
            updatePayee(payee.id, { pending: 0, bad: false })
                .then(() => {
                    // console.log(res)
                    this.msg = "Success";
                    this.autocloseModal();
                })
                .catch((e) => {
                    console.log(e);
                    this.msg = e;
                });
        },
        closeModal() {
            this.msg = null;
        },
        autocloseModal(duration = 3500) {
            setTimeout(() => {
                this.msg = null;
            }, duration);
        },
        humanDate(d) {
            if (d) {
                return format(new Date(d), "dd-MMM-yyyy");
            } else {
                return "-";
            }
        },
        status(date) {
            const d = new Date(date);
            if (compareAsc(new Date(date), new Date()) == 1) {
                return "Upcoming";
            } else {
                return formatDistanceToNow(d);
            }

        },
        async openUdhaarModal(payee){
            this.payee = payee
            // this.udhaar.people_id = payee.id
            this.udhaarModal = true
        },
        closeUdhaarModal(){
            this.payee = null
            this.udhaarModal = false
        },
        async openTransaction(payee) {
            // console.log(payee)
            this.payee = payee;
            const udh = await axios.get(import.meta.env.VITE_API_URL + "/transact/people/" + payee.id)
            // console.log(udh)
            if (udh.status == 200) {
                this.transactions = udh.data.data
            } else {
                this.transactions = []
            }

            this.transactionModal = true;
            this.transaction.people_id = payee.id;
            this.transaction.udhaar_id = this.payee.udhaars.at(-1).id
        },
        
        showTrnzForm(people, udhaar){
            this.transaction.people_id = people
            this.transaction.udhaar_id = udhaar
        },
        closeTransaction() {
            // this.transactionModal = false;
            this.$nextTick(() => {
                this.transaction = {};
            })
        },
        submitTransaction() {
            this.loading = true;
            
            axios.post(
                import.meta.env.VITE_API_URL + "/transact", { amount: this.transaction.amount, date: this.transaction.date, people_id: this.transaction.people_id, udhaar_id: this.transaction.udhaar_id }).then((res) => {
                console.log(res.data)
                // this.transactions.push(res.data)
                this.loading = false
                this.transaction = {}
                this.udhaarModal = false
            })
        },
        addUdhaar(){
            axios.post(
                import.meta.env.VITE_API_URL + "/udhaar", { amount: this.udhaar.amount, date: this.udhaar.date, people_id: this.udhaar.people_id }).then((res) => {
                console.log(res.data)
                // this.transactions.push(res.data)
                this.loading = false
                this.udhaar = {}
                this.udhaarModal = false
            })

            // addUdhaar(this.udhaar.payee, { amount: this.udhaar.amount, date: this.udhaar.date})
        },
        getPeopleDetail(people){
            // console.log(people)
            getUdhaarTransact(people.id).then(data => {
                // console.log(data)
                this.detail = data
            }).catch(e => console.warn(e))
            axios.get(
                import.meta.env.VITE_API_URL + "/people/detail/" + id).then(p => {
                // console.log(p.data)
                this.detail = p.data
                
            }).catch(err => console.warn(err))
        },

    },*/
};
</script>
<style lang="scss" scoped>
.udhaar-panel {
    width: 30rem;
}
</style>