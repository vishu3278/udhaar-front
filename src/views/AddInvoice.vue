<template>
    <div class="container ">
        <section class="bg-cyan-200 px-4 py-2 my-4 rounded">
            <h3 class="text-cyan-800 font-bold">Add invoice</h3>
        </section>
        <add-invoice-form v-on:submit-form=""></add-invoice-form>
    </div>
</template>
<script>
import AddInvoiceForm from '@/components/AddInvoiceForm.vue'
export default {

    name: 'AddInvoice',
    components: {
        AddInvoiceForm
    },

    data() {
        return {
        }
    },
    
}
</script>
<style lang="css" scoped>
</style>