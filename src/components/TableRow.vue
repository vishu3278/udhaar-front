<template>
	<tr>
		<template v-for="(f, index) in fields">
			<!-- <td v-if="key == fields[index]">{{value}}</td> -->
			<td v-if="f == 'id' || f == 'name' || f == 'total'">{{rowData[f]}}</td>
	        <td v-if="f == 'pending'">{{pending}}</td>
			<td v-if="f == 'status'" class="text-center">
	            <span v-show="rowData['udhaar'][0]?.bad" class="text-xs px-2 rounded-full bg-rose-200 text-red-800 mr-1">Bad</span>
	        </td>
			<td v-if="f == 'action'">
	            <button class="btn btn-sm" @click="$emit('show-detail')">Details</button>
	        </td>	
		</template>
	</tr>
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
            <button class="btn btn-sm">Details</button>
        </td>
    </tr> -->
</template>
<script>
import { ref, onMounted, onUpdated, computed, nextTick, onErrorCaptured } from 'vue'

export default {
	props: ['fields','rowData'],
    setup(props){
    	// console.log(props.rowData)
    	const totalAmount = ref(0)
    	const totalTrxn = ref(0)
    	const pending = computed(() => {
    		// let initV = 0
    		// let trxTotal = 0
    		// let udhAmount = 0
    		let udhaar = props.rowData.udhaar
    		if (udhaar.length > 0) {
            	props.rowData.udhaar.forEach(u => {
            		totalAmount.value += u.amount
            		if (u?.transaction.length > 0) {
            			totalTrxn.value += u.transaction.reduce((acc, curr) => acc + curr.amount, 0)
            		} else {
            			totalTrxn.value += 0
            		}
            	})
    		} else {
    			totalAmount.value = props.rowData.udhaar[0]?.amount
            	totalTrxn.value = props.rowData.udhaar[0]?.transaction.reduce((acc, curr) => acc + curr.amount, 0)
    		}
            // console.log(totalAmount.value, totalTrxn.value, udhaar)

            return totalAmount.value - totalTrxn.value

    	})

    	/*onMounted(() => {
    	    		console.log('mounted', props.rowData.id)
    	    	})*/
    	/*function udharComplete (udhaar) {
            let initV = 0
            let trxTotal = udhaar.transaction.reduce((acc, curr) => acc + curr.amount, initV)
            // console.log(trxTotal, udhaar.amount)
            if (trxTotal == udhaar.amount) {
                return "complete"
            } else {
                return "pending"
            }
        }*/
    	return {
    		totalAmount,
    		totalTrxn,
			pending,
    	}
    }

    
}
</script>
<style lang="css" scoped>
</style>