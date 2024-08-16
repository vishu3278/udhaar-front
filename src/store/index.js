import { createStore } from 'vuex'
// import payees from './payees'
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default createStore({
	state: {
		payees: [],
		total: 0,
		recovered: 0,
		pending: 0,
		bad: 0,
		error: null,
	},
	getters: {
		getPayees(state){
			return state.payees
		},
		getTotal(state){
			return state.total
		},
		getRecovered(state){
			return state.recovered
		},
		getBad(state){
			return state.bad
		},
		getPending(state){
			return state.pending
		},
	},
	mutations: {
		set_payees(state, payload){
			state.payees = payload
		},
		add_payees(state, payload){
			state.payees.push(payload)
		},
		set_recovered(state, payload){
			state.recovered = payload
		},
		set_total(state, payload){
			state.total = payload
		},
		add_recovered(state, payload){
			state.recovered += payload
		},
		add_total(state, payload){
			state.total += payload
		},
		set_error(state, payload){
			state.error = payload
		},
		set_bad(state, payload){
			state.bad = payload
		},
		add_bad(state, payload){
			state.bad += payload
		},
		set_pending(state, payload){
			state.pending = payload
		},
		add_pending(state, payload){
			state.pending += payload
		},
	},
	actions: {
		async fetchData({commit}) {
			commit("set_payees", [])
			commit("set_total", 0)
			commit("set_recovered", 0)
			commit("set_bad", 0)
			commit("set_pending", 0)
			commit("set_error", null)
            try {
                const payeesSnapshot = await getDocs(collection(db, 'payees'));
                let payees = [], total = 0, recovered = 0

                payeesSnapshot.forEach(async (doc) => {
                    const udh = { id: doc.id, ...doc.data(), total: 0, udhaar: [] }
                    const udhaarSnapshot = await getDocs(collection(db, "payees", doc.id, "udhaar"));
                    udhaarSnapshot.forEach(async (docU) => {
                        // console.log(docU.id, " => ", docU.data(), udh);
                        if (docU.data().bad) commit("add_bad", docU.data().amount)
                        udh.total += docU.data().amount
                        let ent = { id: docU.id, ...docU.data(), transaction: [] }
                        const txnSnapshot = await getDocs(collection(db, "payees", doc.id, "udhaar", docU.id, "transaction"));
                        txnSnapshot.forEach(docT => {
                            // console.log(docT.id, docT.data())
                            ent.transaction.push({...docT.data(), id: docT.id})
                            recovered += docT.data().amount
                            // console.log("recovered", recovered)
                            commit("add_recovered", docT.data().amount)
                        })
                        udh.udhaar.push(ent)
                        total += docU.data().amount
                        // console.log("total", total)
                        commit("add_total", docU.data().amount)
                    });
                    
                    payees.push({ id: doc.id, ...doc.data(), ...udh })
                    // console.log("payees", doc.data(), udh)
                    commit("add_payees", { id: doc.id, ...doc.data(), ...udh })
                })
                

            } catch (err) {
                commit("set_error", err.message)
            } /*finally {
                loading.value = false;
            }*/
        },

		setPayees({commit}, payload){
			commit('set_payees', payload)
		}
	}
})
