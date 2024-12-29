<template>
    <div class="container p-2">
        <div class="grid grid-cols-2 gap-x-8">
            <div class="column">
                <div class="panel mt-2">
                    <div class="panel-header text-orange-600 font-bold text-lg pb-1 border-b border-orange-400">
                        Edit Payee
                    </div>

                    <div v-if="form" class="panel-body mt-2 shadow">
                        <!-- <edit-payee-form :formdata="form" v-on:submit-form=""></edit-payee-form> -->
                        
                            <div class="grid grid-cols-2 gap-x-8 gap-y-4 bg-orange-50 border rounded border-orange-200 p-5">
                                <div class="column ">
                                    <div class="form-group">
                                        <label class="form-label text-orange-600 font-semibold">Name *</label>
                                        <input class="form-input" type="text" v-model="form.name" placeholder="Ram Charan">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label text-orange-600 font-semibold">Mobile *</label>
                                        <input class="form-input" type="number" v-model="form.mobile" maxlength="10" placeholder="98xxxxxxxx">
                                    </div>
                                    <div class="form-group">
                                    <label class="form-label text-orange-600 font-semibold">Email</label>
                                    <input class="form-input" type="email" v-model="form.email" placeholder="email@domain.com">
                                    <!-- <p class="form-input-hint">You can add transaction to see calculated pending amount.</p> -->
                                </div>
                                    <!-- <div class="form-group">
                                    <label class="form-label">Due Date</label>
                                    <input class="form-input" type="date" v-model="form.duedate" placeholder="25-04-2022">
                                </div> -->
                                    <!-- <div class="form-group">
                                    <label class="form-label">Amount</label>
                                    <input class="form-input" type="number" v-model="form.amount" placeholder="10xxx.xx">
                                </div> -->
                                </div>
                                <div class="column ">
                                    <div class="form-group col-span-2">
                                        <label class="form-label text-orange-600 font-semibold">Remarks</label>
                                        <textarea class="form-input" rows="4" v-model="form.remarks" placeholder="Some remark you want to add"></textarea>
                                    </div>
                                </div>

                                <div class="flex justify-between col-span-2">
                                    <div class="column ">
                                        <router-link class="btn btn-info" to="/udhaar">Cancel</router-link>
                                    </div>
                                    <div class="column ">
                                        <button class="btn btn-primary" v-on:click.prevent="editPayee">Update</button>
                                        <!-- <button v-else class="btn btn-primary" v-on:click.prevent="addNewPayee">Add</button> -->
                                    </div>
                                </div>
                            </div>
                            <div class="column my-4 ml-8">
                                <div v-if="error" class="bg-red-200 border-red-300 border rounded-2xl">
                                    <div class="py-2 px-4 text-red-800">
                                        {{error}}
                                    </div>
                                    <!-- <div class="bar bar-sm mb-2">
                                        <div class="bar-item" role="progressbar" :style="{'width':timeout+'%'}" :aria-valuenow="timeout" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div> -->
                                </div>
                                <!-- <div class="grid grid-cols-2 place-items-center ">
                                    <div class="column ">
                                        <button v-if="formdata" class="btn btn-primary" v-on:click.prevent="editPayee">Submit</button>
                                        <button v-else class="btn btn-primary" v-on:click.prevent="addNewPayee">Add</button>
                                    </div>
                                    <div class="column ">
                                        <router-link class="btn btn-info" to="/udhaar">Cancel</router-link>
                                    </div>
                                </div> -->
                            </div>
                        
                    </div>
                    <div v-else class="text-rose-600 font-semibold border-l-4 border-rose-400 bg-gradient-to-r from-rose-100 to-rose-200 rounded my-2 py-2 px-4">
                        Something is wrong
                    </div>
                </div>
            </div>
            <!-- <div class="divider-vert" data-content="+"></div> -->
            <div class="column ">
                <div class="panel mt-2">
                    <div class="panel-header text-indigo-600  text-lg pb-1 border-b border-indigo-400">
                        <div class="panel-title font-bold">Past transactions</div>
                    </div>
                    <div v-if="form" class="panel-body">
                        <transactions :payee="form"></transactions>
                    </div>
                    <div v-else class="text-rose-600 font-semibold border-l-4 border-rose-400 bg-gradient-to-r from-rose-100 to-rose-200 rounded my-2 py-2 px-4">
                        Something is wrong
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
// import EditPayeeForm from '@/components/udhaar/EditPayeeForm.vue'
import Transactions from '@/components/udhaar/Transactions.vue'
import { db } from "@/firebase";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getPayeeById, updatePayee } from '@/firebase.js'
// import { format, isValid } from 'date-fns'
export default {

    name: 'EditPayeeView',
    components: {
        // EditPayeeForm,
        Transactions,
    },

    data() {
        return {
            form: {},
            error: null,
            // id: this.$route.params.id
        }
    },
    
    mounted() {
        // getPayeeById(this.$route.params.id).then(d => this.form = d).catch(e => console.log(e))
        // const docSnap = await getDoc(doc(db, "payees", this.$route.params.id));
        // console.log(this.$route.params.id)
        // this.form = docSnap.data()
        this.getPayee()
    },
    methods: {
        /*humanDate(d) {
            if (d && isValid(new Date(d))) {
                return format(new Date(d), 'dd-MMM-yyyy')
            } else {
                return "-"
            }
        },*/
        async getPayee() {
            // getPayeeById(this.$route.params.id).then(d => this.form = d).catch(e => console.log(e))
            const docSnap = await getDoc(doc(db, "payees", this.$route.params.id));
            // console.log(docSnap.data())
            this.form = docSnap.data()
        },
        async editPayee() {
            if (this.form.name && this.form.mobile) {
                const upd = await updateDoc(doc(db, 'payees', this.$route.params.id), this.form)
                console.log(upd)
                /*updatePayee(this.$route.params.id, this.form)
                    .then(() => {
                        this.error = "Success"
                        let interval = setInterval(() => {
                            this.timeout += 100 / 7
                        }, 500)
                        setTimeout(() => {
                            clearInterval(interval)
                            this.error = false
                            this.$router.push('/udhaar')
                        }, 3500)
                    })
                    .catch(e => {
                        console.log(e)
                        this.error = e
                    })*/
            } else {
                this.error = "fields required"
            }
        }
    }
}
</script>
<style lang="css" scoped>
</style>