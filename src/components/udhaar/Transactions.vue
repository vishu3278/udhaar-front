<template>
    <div class="my-2">
        <div v-if="payee.udhaar.length == 0" class="empty text-center">
            <div class="empty-icon animate-pulse text-amber-400 text-3xl">
                <i class="ri-close-line "></i>
            </div>
            <p class="empty-title text-2xl text-amber-500">No Transactions</p>
            <p class="empty-subtitle text-lg text-amber-500">found for {{payee?.name}}</p>
            <!-- <div class="empty-action">
                <button class="btn btn-primary">Send a message</button>
            </div> -->
        </div>
        <template v-else>
            
            <div v-for="item in payee.udhaar" class="bg-slate-100 border border-indigo-300 rounded drop-shadow py-1 px-2 mt-2">
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
                
            </div>
        </template>
        <!-- <table v-else class="table table-striped table-hover w-full">
            <thead>
                <tr>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Udhaar (id)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(t, index) in transactions" class="text-center">
                    <td>{{t.amount}}</td>
                    <td>{{humanDate(t.date)}}</td>
                    <td>{{(t.udhaar_id)}}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th colspan="3" class="text-right">
                        Amount = {{totalUdhaar}}<br>
                        Total paid = {{transactionTotal}}<br>
                        Pending = {{totalUdhaar - transactionTotal}}
                    </th>
                </tr>
                <tr>
                    <td colspan="3">
                        Amount – total transactions = Pending
                    </td>
                </tr>
            </tfoot>
        </table> -->
    </div>
</template>
<script>
import { format, isValid } from 'date-fns'
import { mapGetters } from 'vuex'

export default {
    name: "Transactions",
    props: {
        // payee: Object,
        // transactions: Array,
    },
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters({
            payees: "getPayees"
        }),

        payee(){
            return this.payees.filter(p => p.id == this.$route.params.id)[0]
        },

        /*totalUdhaar(){
            return this.payee.udhaars.reduce((a, c) => a + Number(c.amount), 0)
        },
        transactionTotal() {
            let tt = this.transactions.reduce((a, c) => a + Number(c.amount), 0)
            return tt
        }*/
    },
    methods: {
        humanDate(d) {
            if (d && isValid(new Date(d))) {
                return format(new Date(d), 'dd-MMM-yyyy')
            } else {
                return "-"
            }
        },
        udharComplete (udhaar) {
            let initV = 0
            let trxTotal = udhaar.transaction.reduce((acc, curr) => acc + curr.amount, initV)
            // console.log(trxTotal, udhaar.amount)
            if (trxTotal == udhaar.amount) {
                return "complete"
            } else {
                return "pending"
            }
        }
    }
}
</script>