<template>
    <div class="grid grid-cols-2 divide-x-2">
        <div class="grid grid-cols-2 gap-x-4">
            <div class="column ">
                <div class="form-group">
                    <label class="form-label">Name</label>
                    <input class="form-input" type="text" v-model="form.name" placeholder="Name">
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
                    <label class="form-label">Mobile</label>
                    <input class="form-input" type="number" v-model="form.mobile" placeholder="98xxxxxxxx">
                </div>
                <!-- <div class="form-group">
                <label class="form-label">Pending</label>
                <input class="form-input" type="number" v-model="form.pending" disabled placeholder="10xxx.xx">
                <p class="form-input-hint">You can add transaction to see calculated pending amount.</p>
            </div> -->
            </div>
            <div class="form-group col-span-2">
                <label class="form-label">Remarks</label>
                <input class="form-input" type="text" v-model="form.remarks" placeholder="Some remark you want to add">
            </div>
        </div>
        <div class="column mt-4">
            <div class="grid grid-cols-2 place-items-center ">
                <div class="column ">
                    <button v-if="formdata" class="btn btn-primary" v-on:click.prevent="editPayee">Submit</button>
                    <button v-else class="btn btn-primary" v-on:click.prevent="addNewPayee">Add</button>
                </div>
                <div class="column ">
                    <router-link class="btn btn-info" to="/udhaar">Cancel</router-link>
                </div>
            </div>
        </div>
    </div>
    <div v-if="error" class="column ">
        <div class="toast mt-2">
            {{error}}
        </div>
        <div class="bar bar-sm mb-2">
            <div class="bar-item" role="progressbar" :style="{'width':timeout+'%'}" :aria-valuenow="timeout" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
    </div>
    <div v-show="loading" class=" loading-wrapper">
        <div class="loading loading-lg"></div>
    </div>
</template>
<script>
// import { collection, getDocs } from "firebase/firestore";
import { addPayee, updatePayee } from "@/firebase.js"
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

    data() {
        return {
            payee: {},
            form: this.formdata || {
                name: null,
                amount: null,
                pending: null,
                mobile: null,
                duedate: null,
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
                    amount: null,
                    pending: null,
                    mobile: null,
                    duedate: null,
                    remarks: null,
                }
            }
        }
    },
    methods: {
        addNewPayee() {
            if (this.form.name && this.form.amount && this.form.mobile && this.form.duedate) {
                addPayee(this.form)
                    .then(res => {
                        // console.log(res)
                        this.form = {
                            name: null,
                            amount: null,
                            pending: null,
                            mobile: null,
                            duedate: null,
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
    }
}
</script>
<style lang="css" scoped>
</style>