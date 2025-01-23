<template>
	<!-- <h3>{{udh}} Udhaar + transactions </h3> -->
	<template v-if="udh > 0">
	    <div v-for="item in props.udhaar" class="bg-slate-100 border border-indigo-300 rounded drop-shadow py-1 px-2 mt-2">
	        <div class="mr-auto">
	            <small>{{item.id}}</small>
	            <div class="udhaar text-base flex items-center justify-between border-y border-solid border-indigo-300 py-2 mb-2">
	                <span class="text-center font-bold w-24"><i class="ri-wallet-line text-2xl text-indigo-400"></i> <br>{{item.amount}}</span>
	                <span class="text-center min-w-24"><i class="ri-calendar-line text-2xl text-indigo-400"></i> <br>{{usehumanDate(item.date)}}</span>
	                <span v-show="item?.bad" class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 to-rose-300 text-rose-600 text-3xl font-bold shadow">B</span>
	                <span v-if="udharComplete(item) == 'pending'" class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-amber-300 text-amber-600 font-bold text-3xl shadow">P</span>
	                <span v-else class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-300 text-emerald-600 font-bold text-3xl shadow">C</span>
	            </div>
	            <div v-for="trx in item.transaction" :key="trx.id" class="">&bull; {{trx.amount}} - {{usehumanDate(trx.date)}}</div>
	        </div>
	    </div>
	</template>
</template>
<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { usehumanDate } from '@/composables/humanDate.js'
    
    const props = defineProps({
        udhaar: {type: Array, required: true},
    })

    onMounted(() => {
    	console.log("composition api component mounted")
    })

    const udh = computed(() => {
    	return props.udhaar.length
    })

    const udharComplete = (udhaar) => {
        let initV = 0
        let trxTotal = udhaar.transaction.reduce((acc, curr) => acc + curr.amount, initV)
        // console.log(trxTotal, udhaar.amount)
        if (trxTotal == udhaar.amount) {
            return "complete"
        } else {
            return "pending"
        }
    }

</script>
