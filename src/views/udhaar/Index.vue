<template>
    <section class="container my-4">
        <div class="grid grid-cols-3 gap-4">
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
        <div class="flex gap-3">
            <div class="flex-1 basis-2/3">
                
                <table class="table compact table-striped table-hover w-full">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Amount</th>
                            <!-- <th>Udhaar</th> -->
                            <!-- <th>Return Date</th> -->
                            <th>Remarks</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(p, index) in payees" :key="index">
                            <td>{{ p.id }}</td>
                            <td>{{ p.name }}</td>
                            <td class="text-right">
                                {{ p?.total }}
                            </td>
                            
                            <!-- <td>
                                {{ humanDate(p.duedate) }} -
                                <span v-html="status(p.duedate)"></span>
                            </td> -->
                            <td>{{ p.remarks }}</td>
                            <td class="text-center">
                                <!-- <span v-show="p.pending == 0" class="text-xs px-2 rounded-full bg-green-300 mr-1">Done</span> -->
                                <!-- <span v-show="!p.bad && p.pending > 0" class="text-xs px-2 rounded-full bg-blue-300 mr-1">Pending</span> -->
                                <span v-show="p.udhaar[0]?.bad" class="text-xs px-2 rounded-full bg-rose-200 text-red-800 mr-1">Bad</span>
                            </td>
                            <td>
                                <div class="btn-group">
                                    <!-- <button class="btn btn-sm btn-info mr-1" @click="openTransaction(p)">
                                        Transactions
                                    </button> -->
                                    <!-- <div v-if="p.pending != 0" > -->
                                    <!-- <button class="btn btn-primary btn-sm" @click="donePayee(p)">Done</button> -->
                                    <!-- <router-link :to="'/editpayee/' + p.id" class="btn bg-amber-200 btn-sm border-amber-400 hover:bg-amber-400 text-amber-900 hover:text-amber-900 mr-1">Edit/Update</router-link> -->
                                    
                                    <button class="btn btn-sm" @click="getPeopleDetail(p)">Details</button>
                                    <button class="btn btn-sm" >Add</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="flex-auto w-1/3">
                <aside class="bg-slate-200 rounded p-3">
                    <template v-if="detail">
                        <h4 class="text-indigo-500 mb-0 flex gap-3 flex-wrap items-center">{{detail.name}} <small class="bg-indigo-400 text-white w-6 h-6 justify-center items-center inline-flex text-sm rounded-3xl">{{detail.id}}</small> <button @click="detail = null" class="ml-auto text-sm">Close</button></h4>
                        <!-- <p class="mb-3"><i class="ri-phone-line"></i> {{detail.phone}} - <i class="ri-mail-line"></i>{{detail.email}}</p> -->
                        <div v-for="item in detail.udhaar" class="flex gap-5 flex-wrap border border-indigo-300 py-1 px-1">
                            <small>{{item.id}}</small>
                            <p class="udhaar"><i class="ri-wallet-line"></i> {{item.amount}}<br><i class="ri-calendar-line"></i> {{item.date}}</p>
                            <div class="emi">
                                <!-- <div v-for="trs in detail.transaction">
                                    <p>&rarr; <i class="ri-refund-line"></i> {{trs.amount}} - <i class="ri-calendar-line"></i> {{humanDate(trs.date)}}</p>
                                </div> -->
                                <!-- <pre>{{item.amount}} == {{calcAmount(detail.transaction)}}</pre>
                                <div v-if="item.amount > calcAmount(detail.transaction)"><button class="btn-sm" @click="showTrnzForm(detail.id, item.id)">Add transaction</button></div> -->
                            </div>
                            <!-- <div v-if="item.id == transaction.udhaar_id" class=" basis-full  mb-2">
                                <p>Add transaction for this udhaar</p>
                                <div class="flex gap-2 items-center">
                                    <div class="form-group mb-0">
                                        
                                        <input class="form-input input-sm" type="number" v-model="transaction.amount" placeholder="Amount" />
                                    </div>
                                    <div class="form-group mb-0">
                                        
                                        <input class="form-input input-sm" type="date" v-model="transaction.date" placeholder="Date" />
                                    </div>
                                    <div class="form-group mb-0">
                                        <input type="text" class="form-input input-sm" v-model="transaction.udhaar_id" placeholder="Udhaar Id" readonly>
                                    </div>
                                    <div class="form-group mb-0">
                                        <input class="form-input input-sm" type="number" v-model="transaction.people_id" placeholder="People id" readonly />
                                    </div>
                                    <button class="btn" @click="closeTransaction">
                                        <i class="ri-close-line"></i>
                                    </button>
                                    <button v-if="transaction.amount && transaction.date" class="btn bg-blue-500 text-white hover:bg-blue-600 hover:border-blue-600" @click="submitTransaction">
                                        Add
                                    </button>
                                </div>
                            </div> -->
                        </div>

                    </template>
                        
                    
                </aside>
            </div>
        </div>
        
        <!-- <Modal v-show="transactionModal" @close="closeTransaction" title="Transactions">
            <template v-slot:content>
                <div class="content">
                    <Transactions :payee="payee" :transactions="transactions"></Transactions>
                    <hr>
                    <h6 class="py-2 font-bold">Add transaction</h6>
                    <div class="grid grid-cols-4 gap-2">
                        <div class="form-group">
                            <label class="form-label">Amount</label>
                            <input class="form-input input-sm" type="number" v-model="transaction.amount" placeholder="Amount" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Date</label>
                            <input class="form-input input-sm" type="date" v-model="transaction.date" placeholder="Date" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Udhaar ID</label>
                            <input type="text" class="form-input input-sm" v-model="transaction.udhaar_id" readonly>
                        </div>
                        <div class="form-group">
                            <label class="form-label">{{payee?.name}}</label>
                            <input class="form-input input-sm" type="number" v-model="transaction.people_id" placeholder="People id" readonly />
                        </div>
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <div v-if="transaction.people_id" class="flex items-center justify-between">
                    <button class="btn" @click="closeTransaction">
                        Cancel
                    </button>
                    
                    <button v-if="transaction.amount && transaction.date" class="btn bg-blue-500 text-white hover:bg-blue-600 hover:border-blue-600" @click="submitTransaction">
                        Add
                    </button>
                </div>
                <div v-else>
                    <button class="btn" @click="closeTransaction">Close</button>
                </div>
            </template>
        </Modal> -->
        <!-- <Modal v-show="udhaarModal" @close="closeUdhaarModal" :title="`Add Udhaar for ${payee?.name}`">
            <template v-slot:content>
                <div class="content">
                    <div class="grid grid-cols-2 gap-2">
                        <div class="form-group">
                            <label class="form-label">Amount</label>
                            <input class="form-input input-sm" type="number" v-model="udhaar.amount" placeholder="Amount" />
                        </div>
                        <div class="form-group">
                            <label class="form-label">Date</label>
                            <input class="form-input input-sm" type="date" v-model="udhaar.date" placeholder="Due date" />
                        </div>
                        
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <div class="flex items-center justify-between">
                    <button class="btn" @click="closeUdhaarModal">
                        Cancel
                    </button>
                    
                    <button class="btn bg-blue-500 text-white hover:bg-blue-600 hover:border-blue-600" @click="addUdhaar">
                        Add
                    </button>
                </div>
                
            </template>
        </Modal> -->
        
    </div>
</template>
<script>
import { ref, onBeforeMount, onMounted, onUpdated, computed, nextTick, onErrorCaptured } from 'vue'
import { useStore } from 'vuex'

import axios from "axios"
// import Modal from "@/components/Modal.vue"
// import Transactions from "@/components/udhaar/Transactions.vue"

import { db, /*getPayees, updatePayee, addTransaction, addUdhaar, getUdhaarTransact*/ } from "@/firebase";
import { collection, getDocs } from 'firebase/firestore';
import { format, formatDistanceToNow, compareAsc } from "date-fns";
// import * as echarts from 'echarts';

export default {
    setup(){
        const store = useStore()
        const detail = ref({})
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

        onErrorCaptured((e) => {
            console.log(e)
        })

        function getPeopleDetail(p) {
            detail.value = p
         } 

        return {
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
            getPeopleDetail,
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
<style lang="css" scoped></style>