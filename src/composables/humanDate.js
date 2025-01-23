import { ref, onMounted, onUnmounted } from 'vue'
import { format, isValid } from 'date-fns'
import { date_format } from '@/constants.js'

// by convention, composable function names start with "use"
export function usehumanDate(d) {
    // state encapsulated and managed by the composable
    // const x = ref(0)
    const fdate = ref("-")

    if (d && isValid(new Date(d))) {
        fdate.value = format(new Date(d), date_format)
    } else {
        fdate.value = "-"
    }

    return fdate

}