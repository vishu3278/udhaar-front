export default ({
	state: {
		payees: [],
	},
	getters: {
		getPayees(state){
			return state.payees
		}
	},
	mutations: {
		setPayees(state, payload){
			state.payees = payload
		}
	},
	actions: {
		setPayees({commit}, payload){
			commit('setPayees', payload)
		}
	}
})