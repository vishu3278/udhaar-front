<template>
    <div class="grid grid-cols-2 ">
        <div class="grid grid-cols-2 gap-x-8 gap-y-4 bg-orange-100 border rounded border-orange-200 p-5">
            <div class="column ">
                <div class="form-group">
                    <label class="form-label text-orange-600 font-semibold">Name *</label>
                    <input class="form-input" type="text" v-model="form.name" placeholder="Ram Charan">
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
                <div class="form-group">
                    <label class="form-label text-orange-600 font-semibold">Mobile *</label>
                    <input class="form-input" type="number" v-model="form.mobile" maxlength="10" placeholder="98xxxxxxxx">
                </div>
                <!-- <div class="form-group">
                <label class="form-label">Pending</label>
                <input class="form-input" type="number" v-model="form.pending" disabled placeholder="10xxx.xx">
                <p class="form-input-hint">You can add transaction to see calculated pending amount.</p>
            </div> -->
            </div>
            <div class="form-group col-span-2">
                <label class="form-label text-orange-600 font-semibold">Remarks</label>
                <input class="form-input" type="text" v-model="form.remarks" placeholder="Some remark you want to add">
            </div>

            <div class="flex justify-between col-span-2">
                <div class="column ">
                    <button v-if="formdata" class="btn btn-primary" v-on:click.prevent="editPayee">Submit</button>
                    <button v-else class="btn btn-primary" v-on:click.prevent="addNewPayee">Add</button>
                </div>
                <div class="column ">
                    <router-link class="btn btn-info" to="/udhaar">Cancel</router-link>
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
    
    <div v-show="loading" class=" loading-wrapper">
        <div class="loading loading-lg"></div>
    </div>
</template>
<script>
import { ref, onMounted, onUpdated, computed, nextTick, onErrorCaptured } from 'vue'
import { db } from "@/firebase";
import { collection, doc, getDocs, addDoc } from 'firebase/firestore';
// import { addPayee, updatePayee } from "@/firebase.js"
export default {

    name: 'EditPayee',
    props: {
        formdata: {
            type: Object,
            default () {
                return null
            }
        }
    },

    setup(props){
        const form = ref({
            name: null,
            mobile: null,
            remarks: null,
        })
        const error = ref(false)
        const loading = ref(false)

        onMounted(() => {
            console.log(props.formdata)
        })

        async function addNewPayee() {
            if (form.value.name && form.value.mobile) {
                const payeesRef = collection(db, 'payees');
                const docRef = await addDoc(payeesRef, form.value);
                return docRef
            } else {
                error.value = "Required fields"
            }
        }

        async function updatePayee(id, content) {
            const upd = await updateDoc(doc(db, 'payees', id), content)
            return upd
        }

        return {
            form,
            error,
            loading,
            addNewPayee,
            updatePayee,
        }
    }

    /*data() {
        return {
            payee: {},
            form: this.formdata || {
                name: null,
                // amount: null,
                // pending: null,
                mobile: null,
                // duedate: null,
                remarks: null,
            },
            loading: false,
            error: false,
            timeout: 0,
        }
    },
    watch: {
        formdata() {
            if (this.formdata) {
                this.form = this.formdata
            } else {
                this.form = {
                    name: null,
                    // amount: null,
                    // pending: null,
                    mobile: null,
                    // duedate: null,
                    remarks: null,
                }
            }
        }
    },
    methods: {
        addNewPayee() {
            if (this.form.name && this.form.mobile) {
                addPayee(this.form)
                    .then(res => {
                        // console.log(res)
                        this.form = {
                            name: null,
                            // amount: null,
                            // pending: null,
                            mobile: null,
                            // duedate: null,
                            remarks: null,
                        }
                        this.error = "Success"
                        this.$router.push('/udhaar')
                    })
                    .catch(e => {
                        console.log(e)
                        this.error = e
                    })
            } else {
                this.error = "fields required"
            }
        },
        editPayee() {
            if (this.form.name && this.form.amount && this.form.mobile && this.form.duedate) {
                // console.log(this.form)
                updatePayee(this.$route.params.id, this.form)
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
                    })
            } else {
                this.error = "fields required"
            }
        }
    }*/
}
</script>
<style lang="css" scoped>
</style>