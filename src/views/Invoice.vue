<template>
    <section class="container bg-zinc-200 px-4 py-2 my-4 rounded ">
        <div class="flex items-center gap-8">
            <h3 class="mb-0 font-bold">Invoices</h3>
            <router-link to="/addinvoice" class="btn btn-primary btn-sm "><i class="ri-add-line"></i> Add</router-link>
        </div>
    </section>
    <div class="container">
        <div class="grid grid-cols-3 gap-2">
            <div class="column col-span-2">
                <table class="table compact table-striped table-hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>No.</th>
                            <th>Date / Place</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Phone / Email</th>
                            <!-- <th>Email</th> -->
                            <th>Mode</th>
                            <th>Amount</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(p, index) in invoices" :key="index" :class="{'bg-error': p.bad, 'bg-success': p.pending == 0}">
                            <td>{{index}}</td>
                            <td>{{p.no}}</td>
                            <td>{{p.date}} <br>{{p.place}}</td>
                            <td>{{p.from}}</td>
                            <td><div v-html="p.to"></div></td>
                            <td>{{p.phone}} <br>{{p.email}}</td>
                            <td>{{p.payment_mode}}</td>
                            <td>{{p.total}}</td>
                            <td>
                                <!-- <button class="btn btn-sm"><i class="ri-file-edit-line"></i></button> -->
                                <button class="btn btn-primary btn-sm" title="Preview" @click="setActiveInvoice(p.id)"><i class="ri-eye-line"></i></button>
                            </td>
                        </tr>
                    </tbody>
                    <!-- <tfoot>
                        <tr>
                            <td colspan="4"></td>
                            <td colspan="4"></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tfoot> -->
                </table>
                <div class="border-2 border-zinc-400 my-4"></div>
                <h5>Companies</h5>
                <table class="table compact table-striped table-hover">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Initial</th>
                            <th>Name / Address</th>
                            <th>Contact / Phone / Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(c, index) in companies">
                            <td>{{index}}</td>
                            <td>{{c.initial}}</td>
                            <td><span class="font-semibold">{{c.company}}</span><br>{{c.address}}</td>
                            <td><span class="font-medium">{{c.name}}</span><br>{{c.phone}} <br>{{c.email}}</td>
                            <td><button class="btn btn-sm" @click="editCompany = c"><i class="ri-edit-line"></i></button></td>
                        </tr>
                    </tbody>
                </table>
                <div class="border-2 border-zinc-400 my-4"></div>
                <h5>Add Company</h5>
                <add-company-form :formdata="editCompany" @clear-update="() => {editCompany = null}" @get-companies="fetchCompanies()"></add-company-form>
            </div>
            <div class="column bg-zinc-200 rounded" >
                <!-- <div v-if="activeInvoice">
                    <div class="d-flex justify-center my-1">
                        <div class="btn-group ">
                            <button class="btn btn-sm" @click="closePreview">Close</button>
                            <button class="btn btn-sm">Download</button>
                            <button class="btn btn-sm">Print</button>
                        </div>
                    </div>
                    <br>
                </div> -->
                <template v-if="activeInvoice">
                    <invoice-template :invoice="activeInvoice" :key="activeInvoice.id" @close-preview="activeInvoice = null"></invoice-template>
                </template>
                <div v-else>
                    <div class="flex items-center gap-4 bg-zinc-300 p-2 m-2 ">
                        <div class="empty-icon text-zinc-400 text-5xl">
                            <i class="ri-error-warning-line"></i>
                        </div>
                        <div>
                            <p class="empty-title text-lg">You have not selected any Invoice</p>
                            <p class="empty-subtitle text-zinc-600">Click the preview button to start.</p>
                            <div class="empty-action my-2">
                                <button class="btn btn-primary" @click="setActiveInvoice(invoices[0].id)">Preview 1</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="modal " :class="{'active': msg }">
        <a href="#close" class="modal-overlay" aria-label="Close" @click="closeModal"></a>
        <div class="modal-container">
            <div class="modal-header">
                <a href="#close" class="btn btn-clear float-right" @click="closeModal" aria-label="Close"></a>
                <div class="modal-title h5">Modal title</div>
            </div>
            <div class="modal-body">
                <div class="content">
                    {{msg}}
                    <!-- content here -->
                </div>
            </div>
            <!-- <div class="modal-footer">
                ...
            </div> -->
        </div>
    </div>
</template>
<script>
import { getInvoices, getCompanies } from "@/firebase.js"
import { format, formatDistanceToNow, compareAsc } from 'date-fns'
import InvoiceTemplate from "@/components/InvoiceTemplate.vue"
import AddCompanyForm from '@/components/AddCompanyForm.vue'
// import * as echarts from 'echarts';

export default {

    name: 'InvoiceView',
    components: {
        InvoiceTemplate,
        AddCompanyForm,
    },
    data() {
        return {
            invoices: [],
            companies: [],
            editCompany: null,
            msg: "",
            balance: 0,
            totalDebit: 0,
            totalCredit: 0,
            activeInvoice: null,
        }
    },

    mounted() {
        // console.log('mounted')
        getInvoices()
            .then(inv => {
                this.invoices = inv
            })
            .catch(e => console.log(e))
        getCompanies().then(c => {
            this.companies = c
        }).catch(e => console.warn(e))
    },
    methods: {
        setActiveInvoice(id) {
            this.activeInvoice = this.invoices.find(inv => inv.id == id)
        },
        closePreview() {
            this.activeInvoice = null
        },
        closeModal() {
            this.msg = null
        },
        autocloseModal(duration = 3500) {
            setTimeout(() => {
                this.msg = null
            }, duration)
        },
        humanDate(d) {
            return format(new Date(d), 'dd-MMM-yyyy')
        },
        fetchCompanies() {
            getCompanies().then(c => {
                this.companies = c
            }).catch(e => console.warn(e))
        },
    }
}
</script>
<style lang="css" scoped>
</style>