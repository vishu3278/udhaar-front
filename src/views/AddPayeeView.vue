<template>
    <div class="container ">
        <div class="">
            <div class="text-base font-bold text-orange-500 border-b-2 border-orange-500 pb-3 mb-5">
                Add / Edit Payee
            </div>
            <div class="panel-body ">
                <edit-payee-form ></edit-payee-form>
            </div>
            <div class="panel-footer">
                <!-- <button class="btn btn-primary" @click="addPayee">Submit</button> -->
            </div>
        </div>
        
    </div>
</template>
<script>
import EditPayeeForm from '@/components/udhaar/EditPayeeForm.vue'
import { getPayeeById, updatePayee } from '@/firebase.js'
export default {

    name: 'AddPayeeView',
    components: {
        EditPayeeForm
    },

    data() {
        return {
        }
    },
    
    /*methods: {
        addPayee(){

        }
    }*/
}
</script>
<style lang="css" scoped>
</style>