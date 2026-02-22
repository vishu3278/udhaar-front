import { createStore } from 'vuex'
// import payees from './payees'
import { db } from '@/firebase';
import { collection, doc, getDocs, getDoc } from 'firebase/firestore';

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
		getPayees(state) {
			return state.payees
		},
		getTotal(state) {
			return state.total
		},
		getRecovered(state) {
			return state.recovered
		},
		getBad(state) {
			return state.bad
		},
		getPending(state) {
			return state.pending
		},
	},
	mutations: {
		set_payees(state, payload) {
			state.payees = payload
		},
		add_payees(state, payload) {
			state.payees.push(payload)
		},
		update_payee(state, payload) {
			let idx = state.payees.findIndex(p => p.id == payload.id)
			if (idx !== -1) {
				state.payees[idx] = payload
			}
		},
		set_recovered(state, payload) {
			state.recovered = payload
		},
		set_total(state, payload) {
			state.total = payload
		},
		add_recovered(state, payload) {
			state.recovered += payload
		},
		add_total(state, payload) {
			state.total += payload
		},
		set_error(state, payload) {
			state.error = payload
		},
		set_bad(state, payload) {
			state.bad = payload
		},
		add_bad(state, payload) {
			state.bad += payload
		},
		set_pending(state, payload) {
			state.pending = payload
		},
		add_pending(state, payload) {
			state.pending += payload
		},
	},
	actions: {
		async fetchData({ commit }) {
			commit("set_payees", [])
			commit("set_total", 0)
			commit("set_recovered", 0)
			commit("set_bad", 0)
			commit("set_pending", 0)
			commit("set_error", null)
			try {
				const payeesSnapshot = await getDocs(collection(db, 'payees'));

				const payeesData = await Promise.all(payeesSnapshot.docs.map(async (payeeDoc) => {
					const udh = { id: payeeDoc.id, ...payeeDoc.data(), total: 0, udhaar: [] }
					const udhaarSnapshot = await getDocs(collection(db, "payees", payeeDoc.id, "udhaar"));

					const udhaarData = await Promise.all(udhaarSnapshot.docs.map(async (docU) => {
						const uData = docU.data();
						if (uData.bad) commit("add_bad", uData.amount)
						udh.total += uData.amount

						let ent = { id: docU.id, ...uData, transaction: [] }
						const txnSnapshot = await getDocs(collection(db, "payees", payeeDoc.id, "udhaar", docU.id, "transaction"));

						txnSnapshot.forEach(docT => {
							const tData = docT.data();
							ent.transaction.push({ ...tData, id: docT.id })
							commit("add_recovered", tData.amount)
						})

						commit("add_total", uData.amount)
						return ent
					}));

					udh.udhaar = udhaarData;
					const finalPayee = { id: payeeDoc.id, ...payeeDoc.data(), ...udh };
					commit("add_payees", finalPayee)
					return finalPayee;
				}));

			} catch (err) {
				commit("set_error", err.message)
			} /*finally {
                loading.value = false;
            }*/
		},

		async fetchSinglePayee({ commit }, payload) {
			try {

				const docRef = doc(db, "payees", payload);
				const payeeSnap = await getDoc(docRef);

				const udh = { id: payeeSnap.id, ...payeeSnap.data(), total: 0, udhaar: [] }
				const udhaarSnapshot = await getDocs(collection(db, "payees", payload, "udhaar"));

				const udhaarData = await Promise.all(udhaarSnapshot.docs.map(async (docU) => {
					const uData = docU.data();
					if (uData.bad) commit("add_bad", uData.amount)
					udh.total += uData.amount

					let ent = { id: docU.id, ...uData, transaction: [] }
					const txnSnapshot = await getDocs(collection(db, "payees", payload, "udhaar", docU.id, "transaction"));

					txnSnapshot.forEach(docT => {
						const tData = docT.data();
						ent.transaction.push({ ...tData, id: docT.id })
					})
					return ent
				}));

				udh.udhaar = udhaarData;
				commit("update_payee", udh)
				return udh

			} catch (e) {
				// statements
				console.log(e);
			}

		}
	}
})
